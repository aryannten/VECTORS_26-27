import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged,
} from '../lib/firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)         // Firebase user object
  const [userRole, setUserRole] = useState(null)  // 'user' | 'security' | 'admin'
  const [loading, setLoading] = useState(true)    // Initial auth check
  const [idToken, setIdToken] = useState(null)    // Firebase ID token for API calls
  const [hasPass, setHasPass] = useState(false)
  const [userPass, setUserPass] = useState(null)
  const [passLoading, setPassLoading] = useState(true)

  /**
   * Sync the Firebase user with the backend MongoDB user.
   * Returns the user's role.
   */
  const syncWithBackend = useCallback(async (firebaseUser) => {
    if (!firebaseUser) return null
    try {
      const token = await firebaseUser.getIdToken()
      setIdToken(token)

      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setUserRole(data.user.role)
        return data.user
      }
    } catch (error) {
      console.error('[Auth] Backend sync failed:', error)
    }
    return null
  }, [])

  /**
   * Check and sync entry pass verification status with the backend.
   * Wrapped in useCallback so reference remains stable across renders.
   */
  const checkPassStatus = useCallback(async (firebaseUser) => {
    const targetUser = firebaseUser || auth.currentUser
    
    // Only flag passLoading if pass state is entirely absent
    setPassLoading(prev => (!hasPass && !userPass ? true : prev))

    try {
      // 1. Instant optimistic check from localStorage
      const cached = localStorage.getItem('vectorsPass')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          if (parsed && parsed.registrationId) {
            setHasPass(true)
            setUserPass(prev => {
              if (prev && prev.registrationId === parsed.registrationId && prev.checkedIn === parsed.checkedIn) {
                return prev
              }
              return parsed
            })
          }
        } catch {
          // ignore corrupted local storage
        }
      }

      // 2. Authoritative backend verification
      if (targetUser) {
        const token = await targetUser.getIdToken()
        const res = await fetch('/api/register/status', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        })

        if (res.ok) {
          const data = await res.json()
          if (data.hasPass) {
            setHasPass(true)
            setUserPass(prev => {
              if (
                prev &&
                prev.registrationId === data.pass?.registrationId &&
                prev.checkedIn === data.pass?.checkedIn &&
                prev.day1CheckedIn === data.pass?.day1CheckedIn &&
                prev.day2CheckedIn === data.pass?.day2CheckedIn
              ) {
                return prev
              }
              return data.pass
            })
            localStorage.setItem('vectorsPass', JSON.stringify(data.pass))
            return data.pass
          } else {
            setHasPass(false)
            setUserPass(null)
            localStorage.removeItem('vectorsPass')
            return null
          }
        }
      } else if (!auth.currentUser) {
        setHasPass(false)
        setUserPass(null)
      }
    } catch (err) {
      console.error('[Auth] Pass status check error:', err)
    } finally {
      setPassLoading(false)
    }
  }, [hasPass, userPass])

  /**
   * Direct setter called when a pass is newly generated in the frontend.
   */
  const setPassData = useCallback((passData) => {
    if (passData && passData.registrationId) {
      setHasPass(true)
      setUserPass(passData)
      localStorage.setItem('vectorsPass', JSON.stringify(passData))
    } else {
      setHasPass(false)
      setUserPass(null)
      localStorage.removeItem('vectorsPass')
    }
  }, [])

  // Listen to Firebase auth state & token refreshes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync with backend BEFORE exposing the user to the app.
        // This prevents a race where Dashboard mounts and calls the
        // API before the MongoDB user record exists.
        await syncWithBackend(firebaseUser)
        setUser(firebaseUser)
        await checkPassStatus(firebaseUser)
      } else {
        setUser(null)
        setUserRole(null)
        setIdToken(null)
        setHasPass(false)
        setUserPass(null)
        setPassLoading(false)
      }
      setLoading(false)
    })

    const unsubscribeToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const freshToken = await firebaseUser.getIdToken()
          setIdToken(freshToken)
        } catch (err) {
          console.error('[Auth] onIdTokenChanged error:', err)
        }
      } else {
        setIdToken(null)
      }
    })

    return () => {
      unsubscribeAuth()
      unsubscribeToken()
    }
  }, [syncWithBackend, checkPassStatus])

  /**
   * Sign in with email and password.
   */
  const login = useCallback(async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const backendUser = await syncWithBackend(result.user)
    return backendUser
  }, [syncWithBackend])

  /**
   * Sign in with Google.
   */
  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider)
    const backendUser = await syncWithBackend(result.user)
    return backendUser
  }, [syncWithBackend])

  /**
   * Sign up with email, password, and display name.
   */
  const signup = useCallback(async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(result.user, { displayName })
      // Force-refresh the ID token so the new displayName claim is
      // included in the token sent to the backend sync endpoint.
      await result.user.getIdToken(true)
    }
    const backendUser = await syncWithBackend(result.user)
    return backendUser
  }, [syncWithBackend])

  /**
   * Send password reset email to user.
   */
  const resetPassword = useCallback(async (email) => {
    return await sendPasswordResetEmail(auth, email)
  }, [])

  /**
   * Sign out.
   */
  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
    setUserRole(null)
    setIdToken(null)
    setHasPass(false)
    setUserPass(null)
  }, [])

  /**
   * Get a fresh ID token for API calls.
   * Supports forceRefresh if an expired or invalid token error was received.
   */
  const getToken = useCallback(async (forceRefresh = false) => {
    const activeUser = auth.currentUser || user
    if (activeUser) {
      try {
        const token = await activeUser.getIdToken(forceRefresh)
        return token
      } catch (err) {
        console.error('[Auth] Failed to retrieve fresh token:', err)
      }
    }
    return null
  }, [user?.uid])

  const value = useMemo(() => ({
    user,
    userRole,
    loading,
    idToken,
    hasPass,
    userPass,
    passLoading,
    setPassData,
    checkPassStatus,
    login,
    loginWithGoogle,
    signup,
    resetPassword,
    logout,
    getToken,
  }), [
    user,
    userRole,
    loading,
    idToken,
    hasPass,
    userPass,
    passLoading,
    setPassData,
    checkPassStatus,
    login,
    loginWithGoogle,
    signup,
    resetPassword,
    logout,
    getToken,
  ])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
