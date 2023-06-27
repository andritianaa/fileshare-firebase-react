import React from 'react';
import { Navbar as ReactNavbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomReactNavbar = ({ currentUser, handleSignOut }) => {
    return (
        <ReactNavbar expand="lg">
            <Container>
                <ReactNavbar.Brand href="/">File share</ReactNavbar.Brand>
                <ReactNavbar.Toggle aria-controls="ReactNavbar-nav" />
                <ReactNavbar.Collapse id="ReactNavbar-nav">
                    <Nav className="me-auto">
                        <Link to="/" className="nav-link">
                            Accueil
                        </Link>
                        <Link to="/files" className="nav-link">
                            Fichiers
                        </Link>
                        {currentUser && (
                            <Link to="/sent" className="nav-link">
                                Fichiers envoyés
                            </Link>
                        )}
                    </Nav>
                    <div className={isLoaded ? '' : 'd-done'}>
                        {currentUser ? (
                            <Button variant="outline-danger" onClick={handleSignOut}>
                                Se déconnecter
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={async () => await firebase.signinWithGoogle()}>
                                Se connecter
                            </Button>
                        )}
                    </div>
                </ReactNavbar.Collapse>
            </Container>
        </ReactNavbar>
    );
};

export default CustomReactNavbar;
