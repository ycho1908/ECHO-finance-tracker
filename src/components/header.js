import React, { useEffect, useState } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from '@firebase/firestore';


function Header() {
    // to prevent already logged in user to access login page
    const [ loggedIn ,setLoggedIn ] = useState(false);

    const fetchUserData = async() => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user);

            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setLoggedIn(true);
                    console.log("User is already logged in");
                    console.log(docSnap.data());
                }
                else {
                    console.log("User is not logged in");
                }
            }
            else {
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


    return (
        <header className="header">
            <Link to="/" className="App-logo-link">
                <div className="App-logo"></div>
            </Link>

            {loggedIn && (
                <div className="button-container">
                    <button className="button-48" role="button" onClick={handleLogout}>
                        <span className="text">Log out</span>
                    </button>
                    <Link to="/contact" className="button-48" role="button">
                        <span className="text">Contact</span>
                    </Link>
                    <Link to="/about" className="button-48" role="button">
                        <span className="text">About</span>
                    </Link>
                </div> 
            )}

            {!loggedIn && (
                <div className="button-container">
                    <Link to="/login" className="button-48">
                        <span className="text">Login</span>
                    </Link>
                    <Link to="/contact" className="button-48" role="button">
                        <span className="text">Contact</span>
                    </Link>
                    <Link to="/about" className="button-48" role="button">
                        <span className="text">About</span>
                    </Link>
                </div>
            )}

        </header>
    );
}
export default Header;
