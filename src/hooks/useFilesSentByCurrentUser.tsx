import { FileData } from "../services/models/FileData"
import { useState, useEffect, useContext } from 'react';
import firebaseService from './../services/firebase'
import { User } from "firebase/auth";
import { AuthContext } from '../context/AuthContext';
export type UseFilesSentByCurrentUserData = {
    currentUser: User,
    files: FileData[]
}
export const UseFilesSentByCurrentUser = (): UseFilesSentByCurrentUserData => {
    const { currentUser } = useContext(AuthContext)
    const [files, setFiles] = useState<FileData[]>([])
    const fetchData = async () => {
        setFiles(await firebaseService.getFilesSentByCurrentUser())
    }

    useEffect(() => {
        fetchData()
    })
    return { currentUser, files }
}