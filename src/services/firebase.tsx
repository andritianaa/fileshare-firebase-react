import { Auth, GoogleAuthProvider, User, UserCredential, getAuth, signInWithPopup, signOut } from "firebase/auth"
import { CollectionReference, Firestore, QuerySnapshot, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"
import { FirebaseStorage, UploadTask, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { FileData } from "./models/FileData"
import { UserData } from './models/userData'
import { initializeApp } from "firebase/app"
import { uuidv4 } from '@firebase/util'
import { customAlphabet } from 'nanoid'
import config from './config.json'

class FirebaseService {

    usersCollection: CollectionReference<UserData>
    filesCollection: CollectionReference<FileData>
    googleAuthProvider: GoogleAuthProvider
    storage: FirebaseStorage
    firestore: Firestore
    auth: Auth

    constructor() {
        initializeApp(config)
        this.auth = getAuth()
        this.storage = getStorage()
        this.auth.useDeviceLanguage()
        this.firestore = getFirestore()
        this.googleAuthProvider = new GoogleAuthProvider()

        this.filesCollection = collection(this.firestore, 'files') as CollectionReference<FileData>
        this.usersCollection = collection(this.firestore, 'users') as CollectionReference<UserData>

    }


    async addUser(user: User): Promise<void> {
        await setDoc(doc(this.usersCollection, user.uid), {
            uid: user.uid,
            displayName: user.displayName
        })
    }
    async signinWithGoogle(): Promise<UserCredential> {
        try {
            const userCredential = await signInWithPopup(this.auth, this.googleAuthProvider)
            await this.addUser(userCredential.user)
        } catch (error) {
            return null
        }
    }

    async signOut(): Promise<void> {
        await signOut(this.auth)
    }

    getUniqueFilename(file: File): string {
        return `${uuidv4()}.${file.name.split('.').pop()}`
    }

    uploadFile(file: File, filename: string): UploadTask {
        const storageRef = ref(this.storage, filename)
        return uploadBytesResumable(storageRef, file)
    }

    async addFile(originalFilename: string, uniqueFilename: string): Promise<string> {
        const id = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)().toUpperCase()
        await setDoc(doc(this.filesCollection, id), {
            id: id,
            uniqueFilename: uniqueFilename,
            originalFilename: originalFilename,
            userId: this.auth.currentUser ? this.auth.currentUser.uid : null
        })
        return id
    }

    async getSingleFile(id: string): Promise<FileData> {
        const fileData = await getDoc(doc(this.filesCollection, id))
        return fileData.data()
    }
    async getSingleUser(id: string): Promise<UserData> {
        const userData = await getDoc(doc(this.usersCollection, id))
        return userData.data()
    }


    async getFilesSentByCurrentUser(): Promise<FileData[]> {
        const files: FileData[] = []
        const q = query(this.filesCollection, where('userId', '==', this.auth.currentUser.uid))
        const querySnapshot = await getDocs(q)
        querySnapshot.docs.forEach(doc => { files.push(doc.data()) })
        return files
    }
}

export default new FirebaseService()