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

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        await syncWithBackend(firebaseUser)
      } else {
        setUser(null)
        setUserRole(null)
        setIdToken(null)
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
