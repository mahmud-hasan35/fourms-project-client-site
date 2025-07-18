import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { createUserWithEmailAndPassword, GoogleAuthProvider,sendPasswordResetEmail, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
import { auth } from '../Firebase/Firebase.init'

export default function AuthProvider({children}) {

    const [user,setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const googleProvider = new GoogleAuthProvider();

        const createUser = (email,password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth,email,password)

    }
        const signIn = (email,password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth,email,password);
    }

       const googleLogin = () => {
    setLoading(true)
    return signInWithPopup(auth,googleProvider)
   }


   //    update profile //

const updateUserProfile = profileInfo => {
    return updateProfile(auth.currentUser, profileInfo);
}

   const updateUser = (updatedData) => {
      return updateProfile(auth.currentUser, updatedData);
   };
    
    const logOut = () => {
        setLoading(true)
        return signOut(auth);
    }

      // 🔐 Reset password function
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth,email)
  };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth,currentUser => {
            setUser(currentUser)
            setLoading(false)
        });
        return () => {
            unSubscribe()
        }
    },[])

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleLogin,
        updateUserProfile,
        updateUser,
        logOut,
        resetPassword
    }

  return (
    <AuthContext value={authInfo}>
        {children}
    </AuthContext>
  )
}
