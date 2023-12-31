import { ChangeEvent, FormEvent, useState } from 'react'
import { Card, Form, Button, ProgressBar } from 'react-bootstrap'
import Swal from 'sweetalert2'
import firebaseService from './../services/firebase'

export default function Home() {
    const MAX_FILE_SIZE_IN_MB = 20

    const [file, setFile] = useState<File>()
    const [fileInputRef, setFileInputRef] = useState<HTMLInputElement>()

    const [uploadProgress, setUploadProgress] = useState<number>(0)


    const [validated, setValidated] = useState<boolean>(false)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files === null || files.length === 0) return
        const fileSizeInMB = Number((files[0].size / (1048576)).toFixed(2))
        if (fileSizeInMB > MAX_FILE_SIZE_IN_MB) {
            Swal.fire({
                icon: 'error',
                title: 'Le fichier est trop volumineux',
                text: `La taille du fichier ne doit pas être supperieur à ${MAX_FILE_SIZE_IN_MB}`,
            })
            setFile(null)
            return
        }
        setFile(files[0])
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!e.currentTarget.checkValidity()) {
            setValidated(true)
            return
        }
        const uniqueFilename = firebaseService.getUniqueFilename(file)
        const uploadTask = firebaseService.uploadFile(file, uniqueFilename)

        uploadTask.on('state_changed', (snapshot) => {
            setUploadProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        })

        const id = await firebaseService.addFile(file.name, uniqueFilename)
        setFile(null)
        fileInputRef.value = null
        Swal.fire({
            footer: `<a href='/files/${id}'>${id}</a>`,
            icon: 'success',
            text: 'Le fichier a été envoyé avec succès!',
            title: 'Félicitations!'

        })
    }
    return (
        <Card>
            <Card.Header>Envoyer un fichier</Card.Header>
            <Card.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Control className="mb-3" type='file' required onChange={handleFileChange} ref={setFileInputRef} />
                    <ProgressBar animated className='mb-3' now={uploadProgress} label={`${uploadProgress}%`}></ProgressBar>
                    <Button className='w-100' type='submit'>Obtenir un lien</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}