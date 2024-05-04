// SignIn.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../../firebase"; 
import "./SignIn.css";

const SignIn = ({ onSignIn }) => {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                onSignIn();
            })
            .catch((error) => {
                setError("Invalid email or password.");
                console.log(error);
            });
    };

    return (
        <div className="sign-in-container">
            <form onSubmit={signIn}>
                <h1>Sign-in to your account</h1>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit">Sign In</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <Link to="/forgotpassword">Forgot Password?</Link>
            <Link to="/signup">Don't have an account? Sign Up</Link>
        </div>
    );
};

export default SignIn;