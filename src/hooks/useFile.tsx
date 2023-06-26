import { DocumentData } from "firebase/firestore"
import { FullMetadata, getMetadata, ref, getStorage } from 'firebase/storage';
import { FileData } from "../services/models/FileData"
import { useState, useEffect } from 'react';
import firebaseService from './../services/firebase'
export type UseFileData = {
    error: boolean,
    file: FileData,
    loading: boolean,
    metadata: FullMetadata,
    owner: DocumentData

}
export const useFile = (id: string): UseFileData => {
    const [error, setError] = useState<boolean>(false)
    const [file, setFile] = useState<FileData>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [metadata, setMetadata] = useState<FullMetadata>()
    const [owner, setOwner] = useState<DocumentData>()

    const fetchData = async () => {
        try {
            const file = await firebaseService.getSingleFile(id)
            setFile(file)
            setMetadata(await getMetadata(ref(getStorage(), file.uniqueFilename)))

            if (file.userId) setOwner(await firebaseService.getSingleUser(file.userId))
        } catch (error) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    })
    return { error, file, loading, metadata, owner }
}