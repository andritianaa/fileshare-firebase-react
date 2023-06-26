import { useContext } from 'react'
import { Navbar as ReactNavbar, Container, Nav, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import firebase from '../services/firebase'

export default function Navbar() {
    const { currentUser, isLoaded } = useContext(AuthContext)

    return (
        <ReactNavbar>
            <Container>
                <ReactNavbar.Brand href='/'>File share</ReactNavbar.Brand>
                <Nav className='me-auto'>
                    <Link to='/' className='nav-link'>Accueil</Link>
                    <Link to='/files' className='nav-link'>Fichiers</Link>
                    {currentUser && <Link to='/sent' className='nav-link'>Fichiers envoyés</Link>}
                </Nav>
                <div className={isLoaded ? '' : 'd-done'}>
                    {currentUser
                        ? <Button variant='outline-danger' onClick={async () => await firebase.signOut()}>Se déconnecter</Button>
                        : <Button variant='primary' onClick={async () => await firebase.signinWithGoogle()}>Se connecter</Button>
                    }
                </div>
            </Container>
        </ReactNavbar>
    )
} 