import '../App.css';
import React, { useEffect, useState } from "react";
import { auth, db } from "../components/firebase";
import { doc, getDoc } from "@firebase/firestore";
import { Navigate } from 'react-router';


function Profile() {
    const [ userDetails, setUserDetails ] = useState(null);
    const [ loggedIn ,setLoggedIn ] = useState(true);

    const fetchUserData = async() => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user);
            setUserDetails(user);

            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                    console.log(docSnap.data());
                }
                else {
                    console.log("User is not logged in");
                    setLoggedIn(false);
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

    return (
        <div className="profile-box">
            {loggedIn ? (userDetails ? (
                <>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <img
                        src={userDetails.photo}
                        width={"40%"}
                        style={{ borderRadius: "50%" }}
                    />
                </div>
                    <h3 style={{color: 'black', fontWeight: 'bold'}}>Welcome {userDetails.firstName}</h3>
                    <div>
                        <p>Email: {userDetails.email}</p>
                        <p>First Name: {userDetails.firstName}</p>
                        <p>Last Name: {userDetails.lastName}</p>
                    </div>
                </>
            ) : (
                <p>Loading the user information...</p>
            )) : (
            <Navigate to = "/login"/> 
            )}
        </div>
    );
}

export default Profile;