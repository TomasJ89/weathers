import React from 'react';
import mainStore from "../../store/mainStore.jsx";
import {useNavigate} from "react-router-dom";

const Header = () => {

    const { user } = mainStore(); // Get user data from global store
    const nav = useNavigate();

    return (

            <div
                className="hero min-h-16 "
                style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1580193813605-a5c78b4ee01a?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                }}>
                {/* Overlay for better text visibility */}
                <div className="hero-overlay"></div>
                <div className="hero-content text-base-100 text-center">
                    <div>
                        <h1 className="mb-5 text-5xl font-bold">Welcome to Forecast World!</h1>
                        {/* Dynamic message based on user authentication status */}
                        <p className="mb-5">
                            {!user
                                ? "To personalize your weather forecasts, save your favorite locations, and more, please log in."
                                : "Find out your weather in any corner of the world. Simply enter the name of the location you're looking for in the search, and instantly get the current weather and future forecast."
                            }
                        </p>
                        {/* Show login/signup buttons if user is not logged in */}
                        {!user && (
                            <div className="flex gap-2 justify-center">
                                <button className="btn " onClick={() => nav("/login")}>Log In</button>
                                <button className="btn " onClick={() => nav("/registration")}>Sign Up</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

    );
};

export default Header;