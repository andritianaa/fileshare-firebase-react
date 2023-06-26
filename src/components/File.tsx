import { useParams } from "react-router-dom"
import { useFile } from '../hooks/useFile';
import { Alert, Card, Spinner, Button } from 'react-bootstrap';
import { useState } from 'react';
import { getBlob, getStorage, ref } from "firebase/storage";

export default function File() {
    const params = useParams()
    const [downloading, setDownloading] = useState<boolean>(false)
    const { error, file, loading, metadata, owner } = useFile(params.id)

    const handleDownload = async () => {
        setDownloading(true)
        const blob = await getBlob(ref(getStorage(), file.uniqueFilename))
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.originalFilename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setDownloading(false)
    }
    return (
        <div>
            {error
                ? (
                    <Alert variant='danger'>Une erreur s'est porduite</Alert>
                )
                : loading ? (
                    <Card>
                        <Card.Body className="d-flex justify-conent-center">
                            <Spinner animation="border" role='status'></Spinner>
                        </Card.Body>
                    </Card>
                ) :
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>{file?.originalFilename}</Card.Title>
                            <Button className={downloading ? 'disabled mb-3' : 'mb-3'} variant='success' onClick={handleDownload}>{downloading ? 'Téléchargement en cours...' : 'Télécharger'}</Button>
                        </Card.Body>
                        <Card.Footer>
                            Partagé par {owner ? owner.displayName : 'Un utilisateur anonyme'}
                        </Card.Footer>
                    </Card>
            }
        </div>
    )
}