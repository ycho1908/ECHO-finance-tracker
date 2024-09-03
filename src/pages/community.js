import '../App.css';
import React, { useEffect, useState } from "react";
import { auth, db } from "../components/firebase";
import { doc, getDoc, getDocs, collection, addDoc, query, where, updateDoc, deleteDoc } from "@firebase/firestore";
import { Navigate, useNavigate } from 'react-router';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { Container } from 'react-bootstrap';


function Community() {
    const navigate = useNavigate();

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

    const [publicLogs, setPublicLogs] = useState([]);
    const [flipped, setFlipped] = useState({})

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

                    // const journalRef = collection(db, "Journal");
                    // const filteredJournal = query(journalRef, where("UID", "==", user.uid));
                    // const journalSnap = await getDocs(filteredJournal);
                    // setJournalLog(journalSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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

    const fetchPublicLogs = async () => {
        try {
            const logRef = collection(db, 'Journal');
            const publicQuery = query(logRef, where('Public', '==', true));
            const publicSnapshot = await getDocs(publicQuery);

            const publicLogs = publicSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setPublicLogs(publicLogs);
        } catch (error) {
            console.error('Error in getting public logs: ', error);
        }
    };

    useEffect(() => {
        fetchUserData()
        fetchPublicLogs()
    },[]);

    const handleFlip = (id) => {
        setFlipped ((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }


    return (
        <>
        <Container maxWidth='md'>
        {publicLogs.length > 0 ? (
            <Box sx={{ mt: 4 }}>
                <Typography variant='h4' align='center'>Public ECHO Logs</Typography>
                <Typography variant='body1' align='center' marginBottom={3}>This is an encouraging community, where we support each other in each other's journal in tracking their expenses. You can only see the public expenses. These are used to show others in the community of your expense logs.</Typography>
                <Typography variant='body1' align='center' marginBottom={3}><em>Click to see more detail of the finance echo-logs!</em></Typography>
                <Grid container spacing={3} justifyContent="center">
                    {publicLogs.map(log => (
                        <Grid item xs={12} sm={6} md={4} key={log.id}>
                            <Card sx={{ position: 'relative', height: '200px', perspective: '1000px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CardActionArea onClick={() => handleFlip(log.id)} sx={{ height: '100%', width: '100%' }}>
                                    <CardContent sx={{ p: 0, height: '100%', width: '100%' }}>
                                        <Box sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            transformStyle: 'preserve-3d',
                                            transition: 'transform 0.6s',
                                            transform: flipped[log.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        }}>
                                            {/* Front Face */}
                                            <Box sx={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: uid === log.UID ? 'gray' : 'white',
                                                border: uid === log.UID ? '1px solid gray' : '1px solid #ddd',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            }}>
                                                <Typography variant='h6' align='center'>
                                                    <em>Echo Title: <br/></em>
                                                    {log.Description}
                                                </Typography>
                                            </Box>

                                            {/* Back Face */}
                                            <Box sx={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                transform: 'rotateY(180deg)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: uid === log.UID ? 'gray' : 'white',
                                                border: uid === log.UID ? '1px solid gray' : '1px solid #ddd',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            }}>
                                                <Typography variant='h6' align='center'>
                                                    Expense: ${log.Price.toFixed(2)} <br/>
                                                    Category: {log.Category} <br/>
                                                    Time: {log.Time}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ) : (
            <Typography variant="body1">No public logs available.</Typography>
        )}
    </Container>
    <div style={{ position: 'absolute', bottom: '20px', right: '20px'}}>
        <ContactSupportIcon sx={{ color: 'white', fontSize: '50px'}} onClick={() => navigate('/chatbot')}/>
    </div>
    </>
    );
}

export default Community;