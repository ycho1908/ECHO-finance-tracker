import '../App.css';
import React, { useEffect, useState } from "react";
import { auth, db } from "../components/firebase";
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from "@firebase/firestore";
import { useNavigate } from 'react-router-dom';


function Settings() {
    // to fetch whether the user is logged in or not

    // for user data
    const [ userDetails, setUserDetails ] = useState(null);
    const [ loggedIn ,setLoggedIn ] = useState(true);
    const [ first, setFirst ] = useState("");
    const [ last, setLast ] = useState("");

    // for journal data
    const [ uid, setUID ] = useState("");

    // for budget data
    const [ budgetLog, setBudgetLog ] = useState([]);
    const [ goal, setGoal ] = useState(0);

    const navigate = useNavigate();

    // fetching user login and journal & budget data
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

                    const budgetRef = collection(db, "Budget");
                    const filteredBudget = query(budgetRef, where("UID", "==", user.uid));
                    const budgetSnap = await getDocs(filteredBudget);
                    setBudgetLog(budgetSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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

    // Budget
    const createBudget = async (event) => {
        event.preventDefault();
        try {
            const budgetRef = collection(db, "Budget");
            const userBudget = query(budgetRef, where("UID", "==", uid));
            const budgetSnap = await getDocs(userBudget);
            
            if (!budgetSnap.empty) {
                const budgetDoc = budgetSnap.docs[0];
                const budgetDocRef = doc(db, "Budget", budgetDoc.id);

                await updateDoc(budgetDocRef, { GoalExpense: parseFloat(goal)});
                console.log("Updated budget goal");
            } else {
                alert("First create the budget goal to update in your profile");
            }

            navigate('/profile');
        }
        catch (error) {
            console.error("Error updating a budget goal: ", error);
        }
    }

    const updateProfile = async (event) => {
        event.preventDefault();
        try {
            const userDocRef = doc(db, "Users", uid);
    
            await updateDoc(userDocRef, { firstName: first, lastName: last });
            console.log("Updated profile data");
    
            navigate('/profile');
        }
        catch (error) {
            console.error("Error updating a profile data: ", error);
        }
    }

    return (
        <div style={{paddingTop: '30px', flexDirection: 'row', width: '100vw'}}>
            {userDetails ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={userDetails.photo}
                            width={'10%'}
                            style={{
                                borderRadius: '50%',
                                border: '5px solid white',
                            }}
                        />
                    </div>
                    <br />
                    <h3 style={{ fontWeight: 'bold', top: '120px' }}>Welcome {userDetails.firstName}</h3>
                    <div>
                        <p>Email: {userDetails.email}</p>
                        <p>Name: {userDetails.firstName} {userDetails.lastName}</p>
                    </div>
                    <br />
                    <hr />
                    <br/>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <form onSubmit={updateProfile}>
                        <h2>Update your personal data</h2>
                        <br/>
        
                        <div>
                            <label>First Name</label>
                            <input
                                type="string"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={first}
                                onChange={(e) => setFirst(e.target.value)}
                            />
                            <br/>
                            <label>Last Name</label>
                            <input
                                type="string"
                                className="form-control"
                                placeholder="Enter your last name"
                                value={last}
                                onChange={(e) => setLast(e.target.value)}
                            />
                            <br/>
                        </div>
                        <div className="d-grid justify-content-center">
                            <button className="button-11" type="submit" disabled={!first || !last}>Submit</button>
                        </div>
                        </form>
                    </div>
                    <br/>
                    <hr/>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <form onSubmit={createBudget}>
                        <h2>Update your budget</h2>
                        <br/>
        
                        <div>
                            <label>Goal Expense</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter your goal expense"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                            />
                            <br/>
                        </div>

                        <div className="d-grid justify-content-center">
                            <button className="button-11" type="submit">Submit</button>
                        </div>
                        </form>
                        <hr/>
                    </div>
                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

export default Settings;