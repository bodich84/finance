import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider, db } from '../../firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // профіль у /users/<uid> (опційно)
  const ensureUserDoc = async (user) => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        displayName: user.displayName || user.email || 'Unknown',
        email: user.email ?? null,
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
      })
    }
  }

  // перевірка доступу за UID
  const isAllowedByUid = async (uid) => {
    if (!uid) return false
    const ref = doc(db, 'workspaces', 'mainWorkspace', 'allowedUsers', uid)
    const snap = await getDoc(ref)
    return snap.exists()
  }

  const googleAuth = async () => {
    setLoading(true)
    try {
      const { user } = await signInWithPopup(auth, provider)

      const allowed = await isAllowedByUid(user.uid)
      if (!allowed) {
        await signOut(auth)
        toast.error('⛔ Вас не додано в робочий простір')
        return
      }

      await ensureUserDoc(user) // опційно
      toast.success('Login successfully')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-wrapper'>
      <h2>
        Login on <span style={{ color: 'var(--primary-purple)' }}>Financely</span>
      </h2>
      <Button
        text={loading ? 'Loading...' : 'Login with Google'}
        onClick={googleAuth}
        purple={false}
        icon={<FcGoogle className='FcGoogle' />}
      />
    </div>
  )
}

export default GoogleLogin
