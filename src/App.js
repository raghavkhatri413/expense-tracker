// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import MainPage from './components/MainPage'; // Assuming you have a component for the main page
import ForgotPassword from './components/auth/ForgotPassword';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in by this device(check from local storage)
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    // Store authentication state in local storage
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    // Store authentication state in local storage
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    // Clear authentication data from local storage
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn onSignIn={handleSignIn} />} />
        {isAuthenticated ? (
          <Route path="/mainpage" element={<MainPage onSignOut={handleSignOut} />} />
        ) : (
          <>
            <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
          </>
        )}
      </Routes>
      {isAuthenticated && <Navigate to="/mainpage" replace />}
    </BrowserRouter>
  );
}

export default App;