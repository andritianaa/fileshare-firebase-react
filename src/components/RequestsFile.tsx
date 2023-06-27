import { Button, Card, Form } from 'react-bootstrap';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebaseService from './../services/firebase'
import Swal from 'sweetalert2';
export default function RequestsFile() {
    const [fileId, setFileId] = useState<string>('')
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const file = await firebaseService.getSingleFile(fileId)
        if (undefined !== file) {
            navigate(`/files/${file.id}`)
            return
        }
        else {
            setFileId('')
            await Swal.fire({
                icon: 'error',
                title: 'Aucun résultats',
                text: 'Veuillez rechercher avec un identifiant correct'
            })
        }
    }
    return (
        <Card>
            <Card.Header>Rechercher un fichier</Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Control className='mb-3' type='text' onChange={(e) => setFileId(e.target.value)} placeholder='ABCDEFGH' max='8' minLength={8} maxLength={8} required />
                    <Button className='w-100' type='submit'>Rechercher</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}