// NOT IN USE
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './header.css';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useLocation } from 'react-router-dom';

function NavBar() {
    // to prevent already logged in user to access login page
    const [ loggedIn ,setLoggedIn ] = useState(false);
    const location = useLocation();

    const fetchUserData = async() => {
        auth.onAuthStateChanged(async (user) => {
            // console.log(user);

            if (user) {
                try {
                    const docRef = doc(db, "Users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setLoggedIn(true);
                        console.log("User is already logged in");
                        console.log(docSnap.data());
                    } else {
                        console.log("User is not logged in");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                console.log("User is not logged in");
                setLoggedIn(false);
            }
        });
    };

    useEffect(() => {
        fetchUserData()
    },[]);

    async function handleLogout() {
        try {
            await auth.signOut();
            window.location.href = "/login";
            console.log("User has logged out successfully");
            setLoggedIn(false);
        } catch (error) {
            console.log(error.message);
            console.log("Error in logging out");
        }
    }

    const isProfilePage = location.pathname === '/profile';

    return (
        <Navbar variant="dark" backgroundcolor='black' expand="lg" className="header">
            <Container fluid>
                <Navbar.Brand href="/main" className="App-logo" />
                <Navbar.Toggle aria-controls="navbar-dark-example"/>
                <Navbar.Collapse id="navbar-dark-example">
                    <Nav>
                        <NavDropdown
                            id="nav-dropdown-dark-example"
                            title="Menu"
                            // menuVarient="dark"
                            >
                            {loggedIn && (<NavDropdown.Item href="/profile">Profile</NavDropdown.Item>) }
                            {loggedIn && (<NavDropdown.Item href="/community">Community</NavDropdown.Item>) }
                            <NavDropdown.Item href="/about">About</NavDropdown.Item>
                            <NavDropdown.Item href="/contact">Contact</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            {loggedIn && (<NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>) }
                            {!loggedIn && (<NavDropdown.Item href="/login">Login</NavDropdown.Item>) }
                        </NavDropdown>

                        {isProfilePage && (
                        <>
                            <Nav.Link href="/settings" className="ms-3">Update Profile</Nav.Link>
                        </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;