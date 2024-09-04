import './userAuth.css';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../components/firebase';
import { toast } from 'react-toastify';
import SignInWithGoogle from '../components/googleSignIn';
import { doc, getDoc } from '@firebase/firestore';
import { Navigate, useNavigate } from 'react-router';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const navigate = useNavigate();

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

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");
            toast.success("User logged in sucessfully", {
                position: 'top-center',
            });
            window.location.href="/profile";
            // navigate("/profile");
        } catch (error) {
            console.log(error.message);

            if (error.code === 'auth/too-many-requests') {
                // if there are too many requests
                try {
                    await sendPasswordResetEmail(auth, email);
                    toast.info("Due to numerous failed login attempts, a password reset email has been sent.", {
                        position: 'bottom-center',
                    });
                } catch (emailError) {
                    // if there is an error in sending the password reset email
                    console.error("Error in sending password reset email: ", emailError);
                    toast.error("Error in sending password reset email. Please try againn later.", {
                        position: 'bottom-center',
                    });
                }
            } else {
                toast.error(error.message, {
                    position: "botton-center",
                });
            }
        }
    }

    return (
        <div>
        {!loggedIn ? (
        <form className="login-box" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <br/>

            <div className="mb-3">
                <label>Email address</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="d-grid">
                <button className="button-11" type="submit">Submit</button>
            </div>

            <p className="forgot-password text-right">
                New user <a href="/register">Register Here</a>
            </p>
            <SignInWithGoogle/>
        </form>
        ) : (
            <Navigate to = "/profile"/>
            // navigate("/profile") // works, but causes an error "Cannot update a component (BrowserRouter)"
        )}
        </div>
    )
}

export default Login;