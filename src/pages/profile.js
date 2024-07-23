import '../App.css';
import React, { useEffect, useState } from "react";
import { auth, db } from "../components/firebase";
import { doc, getDoc, getDocs, collection, addDoc, query, where, updateDoc, deleteDoc } from "@firebase/firestore";
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
    const [ journalLog, setJournalLog ] = useState([]);
    const [ uid, setUID ] = useState("");
    const [ isPublic , setIsPublic ] = useState(false);

    // for sorting data
    const[sortedField, setSortedField] = React.useState(null);
    const[sortTitle, setSortTitle] = useState('desc');
    const[sortDesc, setSortDesc] = useState('desc');
    const[sortDate, setSortDate] = useState('desc');
    const[sortStatus, setSortStatus] = useState('desc');

    const[searchTitle, setSearchTitle] = useState('');
    const[searchDesc, setSearchDesc] = useState('');
    const[searchDate, setSearchDate] = useState('');
    const[searchStatus, setSearchStatus] = useState('');

    // fetching user login and journal data
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
                    const filteredJournal = query(journalRef, where("UID", "==", user.uid));
                    const journalSnap = await getDocs(filteredJournal);
                    setJournalLog(journalSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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

    // to sort the table of journals
    const sortedData = journalLog.slice().sort((a, b) => {
        if (!sortedField) 
            return 0;
        if (a[sortedField] < b[sortedField]) {
            if (sortedField === 'Title') 
                return sortTitle === 'asc' ? -1 : 1;
            else if (sortedField === 'Description') 
                return sortDesc === 'asc' ? -1 : 1;
            else if (sortedField === 'Time') 
                return sortDate === 'asc' ? -1 : 1;
            else if (sortedField === 'Public') 
                return sortStatus === 'asc' ? -1 : 1;
        }
        if (a[sortedField] > b[sortedField]) {
            if (sortedField === 'Title') 
                return sortTitle === 'asc' ? 1 : -1;
            else if (sortedField === 'Description') 
                return sortDesc === 'asc' ? 1 : -1;
            else if (sortedField === 'Time') 
                return sortDate === 'asc' ? 1 : -1;
            else if (sortedField === 'Public') 
                return sortStatus === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const clickSort = (field) => {
        console.log(sortedField, field);
        if (sortedField !== field) {
            setSortedField(field);
        } 
        if (field === 'Title') 
            sortTitle === 'asc' ? setSortTitle('desc') : setSortTitle('asc');
        else if (field === 'Description') 
            sortDesc === 'asc' ? setSortDesc('desc') : setSortDesc('asc');
        else if (field === 'Time') 
            sortDate === 'asc' ? setSortDate('desc') : setSortDate('asc');
        else if (field === 'Public') 
            sortStatus === 'asc' ? setSortStatus('desc') : setSortStatus('asc');
    };


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

            {/* TABLE w/SORTING AND SEARCHING */}
            <div style={{ float: 'left', width: '60%', marginTop: '20px', marginLeft: '30px', padding: '20px'}}>
                <h2>Your ECHOs</h2>
                <br/>
                {journalLog.length === 0 ? (
                    <p>No journal entries found.</p>
                ) : (
                    <>
                    {/* SEARCH */}
                    <div style={{ display: 'flex', alignItems: 'center'}}>
                        <div style={{ marginLeft: '5px', marginRight: '5px'}}>
                            <input
                                type="text"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                placeholder="Search by Title"
                                style={{ width: '100%'}}
                            />
                        </div>
                        <div style={{ marginLeft: '5px', marginRight: '5px'}}>
                            <input
                                type="text"
                                value={searchDesc}
                                onChange={(e) => setSearchDesc(e.target.value)}
                                placeholder="Search by Description"
                                style={{ width: '100%'}}
                            />
                        </div>
                        <div style={{ marginLeft: '5px', marginRight: '5px'}}>
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                placeholder="Search by Date"
                            />
                        </div>
                        <div style={{ marginLeft: '5px', marginRight: '5px'}}>
                            <input
                                type="text"
                                value={searchStatus}
                                onChange={(e) => setSearchStatus(e.target.value)}
                                placeholder="Search by Status"
                                style={{ width: '100%'}}
                            />
                        </div>
                    </div>
                    <br/>
                    {/* SORT */}
                    <table style={{width: '100%'}}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid white' }}>
                                <span onClick={() => clickSort('Title')}>
                                    Title
                                    <button type="button" style={{ border: 'none', backgroundColor: 'transparent', color: 'white'}}>
                                        {sortTitle === 'asc' ? '▲' : '▼'}
                                    </button>
                                </span>
                                </th>
                                <th style={{ border: '1px solid white' }}>
                                <span onClick={() => clickSort('Description')}>
                                    Description
                                    <button type="button" style={{ border: 'none', backgroundColor: 'transparent', color: 'white'}}>
                                        {sortDesc === 'asc' ? '▲' : '▼'}
                                    </button>
                                </span>
                                </th>
                                <th style={{ border: '1px solid white' }}>
                                <span onClick={() => clickSort('Time')}>
                                    Date
                                    <button type="button" style={{ border: 'none', backgroundColor: 'transparent', color: 'white'}}>
                                        {sortDate === 'asc' ? '▲' : '▼'}
                                    </button>
                                </span>
                                </th>
                                <th style={{ border: '1px solid white' }}>
                                <span onClick={() => clickSort('Public')}>
                                    Status
                                    <button type="button" style={{ border: 'none', backgroundColor: 'transparent', color: 'white'}}>
                                        {sortStatus === 'asc' ? '▲' : '▼'}
                                    </button>
                                </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {sortedData.filter((journal) => {
                            return searchTitle.toLowerCase() === '' ? journal : journal.Title.toLowerCase().includes(searchTitle);
                        })
                        .filter((journal) => {
                            return searchDesc.toLowerCase() === '' ? journal : journal.Description.toLowerCase().includes(searchDesc);
                        })
                        .filter((journal) => {
                            return searchDate.toLowerCase() === '' ? journal : journal.Date.toLowerCase().includes(searchDate);
                        })
                        .filter((journal) => {
                            return searchStatus.toLowerCase() === '' ? journal : journal.Status.toLowerCase().includes(searchStatus);
                        })
                        .map((journal) => (

                            <tr key={journal.id}>
                                <td style={{ border: '1px solid white' }}>{journal.Title}</td>
                                <td style={{ border: '1px solid white' }}>{journal.Description}</td>
                                <td style={{ border: '1px solid white' }}>{journal.Time}</td>
                                <td style={{ border: '1px solid white' }}>{journal.Public ? "Public" : "Private"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </>
                )}
            </div>

            {/* FORM: LOGGING ENTRY */}
            <div style={{ float: 'left', width: '30%', marginTop: '20px', marginLeft: '50px', padding: '20px'}}>
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