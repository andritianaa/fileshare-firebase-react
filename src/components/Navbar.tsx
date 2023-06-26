import { Navbar as ReactNavbar, Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
export default function Navbar() {

    return (
        <ReactNavbar>
            <Container>
                <ReactNavbar.Brand href='/'>File share</ReactNavbar.Brand>
                <Nav className='me-auto'>
                    <Link to='/' className='nav-link'>Accueil</Link>
                    <Link to='/files' className='nav-link'>Fichiers</Link>
                    <Link to='/sent' className='nav-link'>Fichiers envoyés</Link>
                </Nav>
            </Container>
        </ReactNavbar>
    )
} 