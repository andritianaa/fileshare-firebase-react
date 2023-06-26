import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { UseFilesSentByCurrentUser } from '../hooks/useFilesSentByCurrentUser';
import { useNavigate } from "react-router-dom";

export default function FileSent() {
    const { files } = UseFilesSentByCurrentUser()
    const navigate = useNavigate()
    return (
        <Card>
            <Card.Header>Fichier envoyés</Card.Header>
            <ListGroup className="list-group-flush">
                {0 === files.length
                    ? <ListGroupItem>Aucuns fichiers envoyés</ListGroupItem>
                    : files.map((doc, key) => {
                        return <ListGroupItem action key={key} onClick={() => navigate(`/files/${doc.id}`)}> {doc.originalFilename}</ListGroupItem>
                    })
                }

            </ListGroup>
        </Card>
    )
}