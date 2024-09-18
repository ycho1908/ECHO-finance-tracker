import './userAuth.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../components/firebase';
import { setDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Navigate } from 'react-router';
import { Analytics } from '@vercel/analytics/react';

function Register() {
    const [first, setFirstName] = useState('');
    const [last, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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


    const handleRegister= async(e)=>{
        e.preventDefault();
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const user= credential.user;
            console.log(user);
            if (user) {
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    firstName: first,
                    lastName: last,
                    photo: ""
                });
            }
            console.log("User Registered Successfully");
            toast.success("User Registered Successfully", {position: 'top-center',})
        } catch (error) {
            console.log(error.message);
            toast.error(error.message, {position: "bottom-center",})
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!loggedIn ? (
        <form className="login-box" onSubmit={handleRegister}>
            <h1>Sign Up</h1>

            <div className="mb-3">
                <label>First name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{ width: '20vw', alignItems: 'center'}} 
                />
            </div>

            <div className="mb-3">
                <label>Last name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{ width: '20vw', alignItems: 'center'}} 
                />
            </div>

            <div className="mb-3">
                <label>Email address</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '20vw', alignItems: 'center'}} 
                />
            </div>

            <div>
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '20vw', alignItems: 'center'}} 
                />
            </div>
            <br/>
            <div className="d-grid">
                <button className="button-85" style={{marginTop: '20px', marginBottom:'20px'}} type="submit">Submit</button>
            </div>
        </form>
        ) : (
            <Navigate to = "/profile"/>
            // navigate("/profile") // works, but causes an error "Cannot update a component (BrowserRouter)"
        )}
        <Analytics/>
        </div>
    )
}

export default Register;