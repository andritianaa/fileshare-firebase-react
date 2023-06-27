import { useContext } from 'react'
import { Navbar as ReactNavbar, Container, Nav, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import firebase from '../services/firebase'
import google from './../assets/google.png'
export default function Navbar() {
    const { currentUser, isLoaded } = useContext(AuthContext)

    return (
        <ReactNavbar bg="primary" expand="lg" className="text-white">
            <Container>
                <ReactNavbar.Brand className="text-white" href="#">Fileshare</ReactNavbar.Brand>
                <ReactNavbar.Toggle aria-controls="ReactNavbar-nav dar" className="text-white" />
                <ReactNavbar.Collapse id="ReactNavbar-nav">
                    <Nav className="me-auto">
                        <Link to="/" className="nav-link text-white">
                            Upload
                        </Link>
                        <Link to="/files" className="nav-link text-white">
                            Search
                        </Link>
                        {currentUser && (
                            <Link to="/sent" className="nav-link text-white">
                                My files
                            </Link>
                        )}
                    </Nav>
                    {/* <div className={isLoaded ? '' : 'd-done'}>
                        {currentUser ? (
                            <Button variant="outline-danger" onClick={async () => await firebase.signOut()}>
                                Se déconnecter
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div> */}
                </ReactNavbar.Collapse>
            </Container>
            {!currentUser ? (
                <img id="google" src={google} onClick={async () => await firebase.signinWithGoogle()} />) : (<></>)}
        </ReactNavbar>
    );
} 