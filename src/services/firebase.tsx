import { initializeApp } from "firebase/app"
import config from './config.json'
import { uuidv4 } from '@firebase/util'
import { Auth, GoogleAuthProvider, User, UserCredential, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { CollectionReference, Firestore, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { FileData } from "./models/FileData";
import { FirebaseStorage, UploadTask, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { UserData } from './models/userData';
import { customAlphabet } from 'nanoid'
class FirebaseService {
    auth: Auth
    firestore: Firestore
    filesCollection: CollectionReference<FileData>
    googleAuthProvider: GoogleAuthProvider
    storage: FirebaseStorage
    usersCollection: CollectionReference<UserData>

    constructor() {
        initializeApp(config)
        this.auth = getAuth()
        this.auth.useDeviceLanguage()
        this.googleAuthProvider = new GoogleAuthProvider()

        this.firestore = getFirestore()
        this.filesCollection = collection(this.firestore, 'files') as CollectionReference<FileData>
        this.usersCollection = collection(this.firestore, 'users') as CollectionReference<UserData>

        this.storage = getStorage()
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
        await setDoc(doc(this.filesCollection, uniqueFilename), {
            id: id,
            uniqueFilename: uniqueFilename,
            originalFilename: originalFilename,
            userId: this.auth.currentUser ? this.auth.currentUser.uid : null
        })
        return id
    }

}

export default new FirebaseService();