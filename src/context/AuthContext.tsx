import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import firebaseService from './../services/firebase'
export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<User>(null)
    const [isLoaded, setIsloaded] = useState<boolean>(false)

    useEffect(() => {
        firebaseService.auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setIsloaded(true)
        })
    }, [currentUser,])
    return (
        <AuthContext.Provider value={{ currentUser, isLoaded }}>
            {children}
        </AuthContext.Provider>
    )
}