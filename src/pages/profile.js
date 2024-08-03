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
    const [ date, setDate ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ journalLog, setJournalLog ] = useState([]);
    const [ uid, setUID ] = useState("");
    const [ isPublic , setIsPublic ] = useState(false);
    const [ price , setPrice ] = useState(0);
    const [ categories , setCategories ] = useState("");

    // for sorting data
    const[sortedField, setSortedField] = React.useState(null);
    const[sortDesc, setSortDesc] = useState('desc');
    const[sortDate, setSortDate] = useState('desc');
    const[sortStatus, setSortStatus] = useState('desc');
    const[sortPrice, setSortPrice] = useState('desc');
    const[sortCategory, setSortCategory] = useState('desc');

    const[searchDesc, setSearchDesc] = useState('');
    const[searchDate, setSearchDate] = useState('');
    const[searchStatus, setSearchStatus] = useState('');
    const[searchPrice, setSearchPrice] = useState('');
    const[searchCategory, setSearchCategory] = useState('');

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

    // for budget categories
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSelectChange = (e) => {
        const options = Array.from(e.target.options);
        const selectedValues = options.filter(option => option.selected).map(option => option.value);
        setSelectedOptions(selectedValues);
    };


    // Journal 

    const createJournal = async (event) => {
        event.preventDefault();
        try {
            const journalRef = collection(db, "Journal");
            await addDoc(journalRef, { Description: description, Time: date , UID: uid, Public: isPublic, Price: price, Category: categories})
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
            if (sortedField === 'Description') 
                return sortDesc === 'asc' ? -1 : 1;
            else if (sortedField === 'Time') 
                return sortDate === 'asc' ? -1 : 1;
            else if (sortedField === 'Public') 
                return sortStatus === 'asc' ? -1 : 1;
            else if (sortedField === 'Price') 
                return sortPrice === 'asc' ? -1 : 1;
            else if (sortedField === 'Category') 
                return sortCategory === 'asc' ? -1 : 1;
        }
        if (a[sortedField] > b[sortedField]) {
            if (sortedField === 'Description') 
                return sortDesc === 'asc' ? 1 : -1;
            else if (sortedField === 'Time') 
                return sortDate === 'asc' ? 1 : -1;
            else if (sortedField === 'Public') 
                return sortStatus === 'asc' ? 1 : -1;
            else if (sortedField === 'Price') 
                return sortPrice === 'asc' ? 1 : -1;
            else if (sortedField === 'Category') 
                return sortCategory === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const clickSort = (field) => {
        console.log(sortedField, field);
        if (sortedField !== field) {
            setSortedField(field);
        } 
        if (field === 'Category') 
            sortCategory === 'asc' ? setSortCategory('desc') : setSortCategory('asc');
        else if (field === 'Description') 
            sortDesc === 'asc' ? setSortDesc('desc') : setSortDesc('asc');
        else if (field === 'Time') 
            sortDate === 'asc' ? setSortDate('desc') : setSortDate('asc');
        else if (field === 'Public') 
            sortStatus === 'asc' ? setSortStatus('desc') : setSortStatus('asc');
        else if (field === 'Price')
            sortPrice === 'asc' ? setSortPrice('desc') : setSortPrice('asc');
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
                <h2>Your Finance ECHOs</h2>
                <hr/>
                {journalLog.length === 0 ? (
                    <p>No journal entries found.</p>
                ) : (
                    <>
                    {/* SEARCH */}
                    <h4><em>Search Tool</em></h4>
                    <div style={{ display: 'flex', alignItems: 'center'}}>
                        <div style={{ marginLeft: '5px', marginRight: '5px'}}>
                            <input
                                type="text"
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                                placeholder="Category"
                                style={{ width: '100%'}}
                            />
                        </div>
                        <div style={{ marginLeft: '5px', marginRight: '5px'}}>
                            <input
                                type="text"
                                value={searchDesc}
                                onChange={(e) => setSearchDesc(e.target.value)}
                                placeholder="Description"
                                style={{ width: '100%'}}
                            />
                        </div>
                        <div style={{ marginLeft: '5px', marginRight: '5px'}}>
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                placeholder="Date"
                            />
                        </div>
                        <div style={{ marginLeft: '5px', marginRight: '5px'}}>
                            <input
                                type="number"
                                value={searchPrice}
                                onChange={(e) => setSearchPrice(e.target.value)}
                                placeholder="Price"
                                style={{ width: '100%'}}
                            />
                        </div>
                        <div style={{ marginLeft: '5px', marginRight: '5px'}}>
                            <input
                                type="text"
                                value={searchStatus}
                                onChange={(e) => setSearchStatus(e.target.value)}
                                placeholder="Status"
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
                                <span onClick={() => clickSort('Category')}>
                                    Category
                                    <button type="button" style={{ border: 'none', backgroundColor: 'transparent', color: 'white'}}>
                                        {sortCategory === 'asc' ? '▲' : '▼'}
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
                                <span onClick={() => clickSort('Price')}>
                                    Price
                                    <button type="button" style={{ border: 'none', backgroundColor: 'transparent', color: 'white'}}>
                                        {sortStatus === 'asc' ? '▲' : '▼'}
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
                            return searchCategory.toLowerCase() === '' ? journal : journal.Category.toLowerCase().includes(searchCategory.toLowerCase());
                        })
                        .filter((journal) => {
                            return searchDesc.toLowerCase() === '' ? journal : journal.Description.toLowerCase().includes(searchDesc.toLowerCase());
                        })
                        .filter((journal) => {
                            return searchDate.toLowerCase() === '' ? journal : journal.Date.toLowerCase().includes(searchDate);
                        })
                        .filter((journal) => {
                            return searchStatus.toLowerCase() === '' ? journal : journal.Status.toLowerCase().includes(searchStatus);
                        })
                        .filter((journal) => {
                            const searchPriceNumber = Number(searchPrice);
                            return searchPrice === '' ? journal : journal.Price === searchPriceNumber;
                        })
                        .map((journal) => (

                            <tr key={journal.id}>
                                <td style={{ border: '1px solid white' }}>{journal.Category}</td>
                                <td style={{ border: '1px solid white' }}>{journal.Description}</td>
                                <td style={{ border: '1px solid white' }}>{journal.Time}</td>
                                <td style={{ border: '1px solid white' }}>{journal.Price}</td>
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
                <h2>Log your finance echo</h2>
                <br/>

                <div>
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
                    <br/>

                    <label>Price</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <br/>

                    <label>Select Categories</label>
                    <select
                        multiple
                        className="form-control"
                        value={selectedOptions}
                        onChange={handleSelectChange}
                    >
                        <option value="Housing">Housing</option>
                        <option value="Food">Food</option>
                        <option value="Transporation">Transportation</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Leisure">Leisure</option>
                        <option value="Education">Education</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                    </select>

                    <div>
                        <p>Selected Options: {selectedOptions.join(', ')}</p>
                    </div>
                    <br/>

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