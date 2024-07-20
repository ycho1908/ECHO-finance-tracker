// import '../App.css';
import React, { useEffect, useState } from "react";
import { auth, db } from "../components/firebase";
import { doc, getDoc, getDocs, collection, addDoc, updateDoc, deleteDoc } from "@firebase/firestore";
import { Navigate } from 'react-router';


function Profile() {
    // to fetch whether the user is logged in or not

    // for user data
    const [ userDetails, setUserDetails ] = useState(null);
    const [ loggedIn ,setLoggedIn ] = useState(true);

    // for journal data
    const [ title , setTitle ] = useState("");
    const [ date, setDate ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ journal, setJournal ] = useState([]);
    const [ uid, setUID ] = useState("");
    const [ isPublic , setIsPublic ] = useState(false);

    const fetchUserData = async() => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user);
            setUserDetails(user);

            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUID(user.uid);
                    setUserDetails(docSnap.data());
                    console.log(docSnap.data());
                    const journalRef = collection(db, "Journal");
                    const data = await getDocs(journalRef);
                    setJournal(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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


    // Journal 

    const createJournal = async (event) => {
        event.preventDefault();
        try {
            const journalRef = collection(db, "Journal");
            await addDoc(journalRef, { Title: title, Description: description, Time: date , UID: uid, Public: isPublic })
            console.log("added a journal");
            window.location.reload()
        }
        catch (error) {
            console.error("Error adding journal: ", error);
        }
    }

    // const deleteUser = async (id) => {
    //     const userDoc = doc(db, "backenddata", id)
    //     console.log("Got the Document ID")
    //     await deleteDoc(userDoc)
    //     console.log("Deleted the Document")
    //     window.location.reload()
    // }

    return (
        <div style={{paddingTop: '30px', flexDirection: 'row', width: '100vw'}}>
            {/* flexDirection: "column", alignItems: "center", paddingTop: "20px" */}
            {loggedIn ? (userDetails ? (
                <>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <img
                        src={userDetails.photo}
                        width={'10%'}
                        style={{ borderRadius: '50%',
                            border: '5px solid white',
                        }}
                    />
                </div>
                    <br/>
                    <h3 style={{fontWeight: 'bold', top: '120px'}}>Welcome {userDetails.firstName}</h3>
                    <div>
                        <p>Email: {userDetails.email}</p>
                        <p>Name: {userDetails.firstName} {userDetails.lastName}</p>
                    </div>
                </>
            ) : (
                <p>Loading the user information...</p>
            )) : (
            <Navigate to = "/login"/> 
            )}

            <div style={{ float: 'left', width: '60%', marginTop: '20px', padding: '20px'}}>
                <h2>Column</h2>
                <p>Some text..</p>
            </div>
            <div style={{ float: 'left', width: '30%', marginTop: '20px', padding: '20px'}}>
                <form onSubmit={createJournal}>
                <h1>Log your echo</h1>
                <br/>

                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <br/>

                    <label>Date</label>
                    <input
                        type="date"
                        className="form-control"
                        placeholder="Enter date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <br/>

                    <label>Description</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <span>      Your privacy setting is: {isPublic ? "Public" : "Private"}</span>
                    <br/>
                    <br/>

                    <div className="d-grid justify-content-center">
                        <button className="button-11" type="submit">Submit</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;