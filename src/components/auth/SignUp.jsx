// SignUp.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { getDatabase, ref, set } from "firebase/database";
import "./SignUp.css"
import app from "../../firebase";

const SignUp = ({ onSignUp }) => {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const db = getDatabase(app);

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Get the user's UID
                const uid = userCredential.user.uid;
                // Create a new user node in the database with UID as the key
                set(ref(db, `users/${uid}`), {
                    email: email // Store additional user data if needed
                });
                onSignUp(); // Call the onSignUp handler upon successful sign-up
            })
            .catch((error) => {
                console.log(error);
            });
    };    

    return (
        <div className="sign-up-container">
            <form onSubmit={signUp}>
                <h1>Create your account</h1>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit">Sign Up</button>
            </form>
            <Link to="/signin">Already have an account? Sign In</Link>
        </div>
    );
};

export default SignUp;
