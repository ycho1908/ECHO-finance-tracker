import { useEffect, useState } from 'react';
import '../App.css';
import { auth, db } from '../components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { Analytics } from '@vercel/analytics/react';

export default function Nav() {
    // to prevent already logged in user to access login page
    const [ loggedIn ,setLoggedIn ] = useState(false);
    const navigate = useNavigate();

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
        <div className="spline-container" style={{ backgroundColor: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <button className="button-85" style={{marginTop: '20px', marginBottom:'20px'}} onClick={() => navigate('/about')}>About</button>
            <button className="button-85" style={{marginTop: '20px', marginBottom:'20px'}} onClick={() => navigate('/contact')}>Contact</button>
            {loggedIn && (<button className="button-85" style={{marginTop: '20px', marginBottom:'20px'}} onClick={() => navigate('/profile')}>Profile</button>) }
            {loggedIn && (<button className="button-85" style={{marginTop: '20px', marginBottom:'20px'}} onClick={() => navigate('/community')}>Community</button>) }
            {loggedIn && (<button className="button-85" style={{marginTop: '20px', marginBottom:'20px'}} onClick={handleLogout}>Logout</button>) }
            {!loggedIn && (<button className="button-85" style={{marginTop: '20px', marginBottom:'20px'}} onClick={() => navigate('/login')}>Login</button>) }
            <div style={{ position: 'absolute', bottom: '20px', right: '20px'}}>
                <ContactSupportIcon sx={{ color: 'white', fontSize: '50px'}} onClick={() => navigate('/chatbot')}/>
            </div>
            <Analytics/>
        </div>
    );
}