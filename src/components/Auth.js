import React, { useEffect, useState, useRef, createContext, } from 'react'
import { firestore, auth } from '../database/firebase'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export const AuthContext = createContext()

export default function Auth({ children }) {
    const [user, setUser] = useState(localStorage.getItem("signin"))
    const [loading, setLoading] = useState(false)

    const userRef = useRef(firestore.collection("users")).current

    useEffect(() => {
        const authUnsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                setLoading(true)
                userRef.doc(firebaseUser.uid).onSnapshot((doc) => {
                    if (doc.data()) {
                        const data = {
                            uid: doc.data().uid,
                            email: doc.data().email,
                            displayName: doc.data().displayName,
                            image: doc.data().image,
                            role: doc.data().role,
                            firstName: doc.data().firstName,
                            lastName: doc.data().lastName,
                            address: doc.data().address,
                            phoneNumber: doc.data().phoneNumber
                        }
                        setUser(data)
                        setLoading(false)
                    } else {
                        setLoading(false)
                    }
                })
                localStorage.setItem("signin", "true")
            } else {
                setUser(null)
                localStorage.removeItem("signin")
            }
        })
        
        return () => {
            authUnsubscribe()
        }
    }, [userRef])
    
    if (loading) {
        return  <Backdrop
                    sx={{ color: '#3098d9', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
    }

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )
}
