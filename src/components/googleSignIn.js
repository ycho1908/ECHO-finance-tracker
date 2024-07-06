import '../pages/userAuth.css';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from './firebase';
import { toast } from 'react-toastify';
import { doc, setDoc } from '@firebase/firestore';

function SignInWithGoogle() {

    function googleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async(result) => {
            console.log(result);
            const user = result.user;
            if (result.user) {
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    firstName: user.displayName,
                    lastName: "",
                    photo: user.photoURL
                });
                toast.success("User logged in successfully", {
                    position: "top-center",
                });
                window.location.href = "/profile";
            }
        });
    }

    return (
        <div>
            <p className="continue-p">--OR continue with--</p>
            <div 
                style={{display:"flex", justifyContent:"center",cursor:"pointer"}}
                onClick={googleLogin}
            >
                <img src={require("../assets/google-white.png")} width={"80%"}/>
            </div>

        </div>
    )
}

export default SignInWithGoogle;