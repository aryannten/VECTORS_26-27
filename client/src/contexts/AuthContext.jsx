import { createContext, useContext, useState, useEffect } from 'react'
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

  /**
   * Sync the Firebase user with the backend MongoDB user.
   * Returns the user's role.
   */
  const syncWithBackend = async (firebaseUser) => {
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
  }

  const [hasPass, setHasPass] = useState(false)
  const [userPass, setUserPass] = useState(null)
  const [passLoading, setPassLoading] = useState(true)

  /**
   * Check and sync entry pass verification status with the backend.
   */
  const checkPassStatus = async (firebaseUser) => {
    setPassLoading(true)
    try {
      // 1. Instant optimistic check from localStorage
      const cached = localStorage.getItem('vectorsPass')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          if (parsed && parsed.registrationId) {
            setHasPass(true)
            setUserPass(parsed)
          }
        } catch {
          // ignore corrupted local storage
        }
      }

      // 2. Authoritative backend verification
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        const res = await fetch('/api/register/status', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          if (data.hasPass) {
            setHasPass(true)
            setUserPass(data.pass)
            localStorage.setItem('vectorsPass', JSON.stringify(data.pass))
          } else {
            setHasPass(false)
            setUserPass(null)
            localStorage.removeItem('vectorsPass')
          }
        }
      } else {
        setHasPass(false)
        setUserPass(null)
      }
    } catch (err) {
      console.error('[Auth] Pass status check error:', err)
    } finally {
      setPassLoading(false)
    }
  }

  /**
   * Direct setter called when a pass is newly generated in the frontend.
   */
  const setPassData = (passData) => {
    if (passData && passData.registrationId) {
      setHasPass(true)
      setUserPass(passData)
      localStorage.setItem('vectorsPass', JSON.stringify(passData))
    } else {
      setHasPass(false)
      setUserPass(null)
      localStorage.removeItem('vectorsPass')
    }
  }

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        await syncWithBackend(firebaseUser)
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

    return () => unsubscribe()
  }, [])

  /**
   * Sign in with email and password.
   */
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const backendUser = await syncWithBackend(result.user)
    return backendUser
  }

  /**
   * Sign in with Google.
   */
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    const backendUser = await syncWithBackend(result.user)
    return backendUser
  }

  /**
   * Sign up with email, password, and display name.
   */
  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(result.user, { displayName })
    }
    const backendUser = await syncWithBackend(result.user)
    return backendUser
  }

  /**
   * Security team login or registration — signs in or registers using user's chosen credentials,
   * automatically grants security role via backend, and grants immediate scanner access.
   */
  const securityLogin = async (email, password, isNewAccount = false, displayName = '') => {
    let firebaseUser

    if (isNewAccount) {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      firebaseUser = result.user
      if (displayName) {
        await updateProfile(firebaseUser, { displayName })
      }
    } else {
      const result = await signInWithEmailAndPassword(auth, email, password)
      firebaseUser = result.user
    }

    const token = await firebaseUser.getIdToken()
    setIdToken(token)

    const res = await fetch('/api/auth/security-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const errorData = await res.json()
      await signOut(auth)
      throw new Error(errorData.message || 'Security login failed.')
    }

    const data = await res.json()
    setUser(firebaseUser)
    setUserRole(data.user.role)
    return data.user
  }

  /**
   * Send password reset email to user.
   */
  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email)
  }

  /**
   * Sign out.
   */
  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setUserRole(null)
    setIdToken(null)
  }

  /**
   * Get a fresh ID token for API calls.
   */
  const getToken = async () => {
    if (user) {
      const token = await user.getIdToken()
      setIdToken(token)
      return token
    }
    return null
  }

  const value = {
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
    securityLogin,
    resetPassword,
    logout,
    getToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
