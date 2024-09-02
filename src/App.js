import './App.css';
import About from './pages/about';
import Contact from './pages/contact';
import React, { useState } from 'react';
// import Header from './components/header';
import Main from './pages/main';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { auth } from './components/firebase';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/header2';
import Nav from './pages/nav';
import Settings from './pages/settings';
import Community from './pages/community';
import ChatBot from './pages/chatbot';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const isPageWOStyle = location.pathname === '/' || location.pathname === '/main' || location.pathname === '/nav';

  return (
    <div className={isPageWOStyle ? 'Main-no-styles' : 'App-page'}>
      {/* <Header/> */}
      {!isPageWOStyle && <NavBar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to= "/profile" /> :<Main/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path="/nav" element={<Nav />} />
        <Route path="/contact" element={<Contact />}/>
        <Route path="/login" element={user ? <Navigate to="/profile"/> : <Login/>} />
        <Route path="/register" element={user ? <Navigate to = "/profile"/> : <Register/>}/>
        <Route path="/profile" element={user ? <Navigate to = "/login"/> : <Profile/>}/>
        <Route path="/settings" element={user ? <Navigate to = "/login"/> : <Settings/>}/>
        <Route path="/community" element={user ? <Navigate to = "/login"/> : <Community/>}/>
        <Route path="/chatbot" element={user ? <Navigate to = "/login"/> : <ChatBot/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
      {!isPageWOStyle && <ToastContainer />}
    </div>
  );
}

export default App;


/*

// PREVIOUS IMPLEMENTATION OF GOOGLE SIGN IN USING REACT-OAUTH

import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      setIsLoggedIn(true)
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
      /// request to google
      if (user) {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
      }
    },
    [user]
  );

  const logOut = () => {
    googleLogout();
    // resetting the profile and logged in information
    setProfile(null);
    setIsLoggedIn(false);
  };

  // to prevent the profile from appearing in every page
  const noProfilePages = ['/contact'];

  return (
    <div className={isLoggedIn ? "App-basic" : "App-before-login"} >
      <div className={isLoggedIn ? "" : "login-box"}>
      <Header loggedInStatus={isLoggedIn} logOut={logOut}/>
      {profile ? (
        !noProfilePages.includes(location.pathname) && 
          (<div className="profile-box">
            <img src={profile.picture} alt="user profile image" class="profile-picture"/>
            <h3>Welcome, {profile.name}!</h3>
            <p>Email Address: {profile.email}</p>
          </div>)
      ) : (
        <div>
          <br/>
          <span>
            <GoogleLogin
              onSuccess={login}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </span>
        </div>
      )}
      </div>
    <div>
      <Routes>
        <Route path="/" element={profile ? <Main /> : <Navigate to="/" />}/>
        <Route path="/contact" element={<Contact />}/>
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
*/