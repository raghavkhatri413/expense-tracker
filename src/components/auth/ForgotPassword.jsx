// ForgotPassword.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth"; 
import { auth } from "../../firebase"; 
import "./ForgotPassword.css"

const ForgotPassword = () => {
    const [email, setEmail] = useState(""); 
    const [message, setMessage] = useState("");

    const handleSendResetEmail = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setMessage("Password reset email sent. Please check your inbox.");
            })
            .catch((error) => {
                setMessage("Error sending password reset email.");
                console.log(error);
            });
    };

    return (
        <div className="forgot-password-container">
            <h1>Forgot Password</h1>
            <p>Enter your email address to receive a password reset link.</p>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <button onClick={handleSendResetEmail}>Send Reset Password Link</button>
            {message && <p className="message">{message}</p>} 
            <Link to="/signin">Back to Sign In</Link>
        </div>
    );
};

export default ForgotPassword;
