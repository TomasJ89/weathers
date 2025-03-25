import React, { useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://myweather-backend.1tggzg5ms3kd.eu-de.codeengine.appdomain.cloud";
function Registration() {
    const nav = useNavigate()
    const [error, setError] = useState(null);
    const [passHide, setPassHide] = useState(true);

    // Form data state
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        // city: "",
        password: "",
        confirmPassword: "",
    });
    // Handles form input changes and updates state accordingly.
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    // Validates email format using regex.
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Validates input fields before making an API request.
    const handleRegistration = async (e) => {
        e.preventDefault();
        setError("");

        // Check for missing fields
        const requiredFields = Object.entries(formData).filter(([_, value]) => !value);
        if (requiredFields.length > 0) {
            console.error("Validation Error: Missing fields", requiredFields);
            return setError("Please fill in all fields.");
        }
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            console.error("Validation Error: Passwords do not match");
            return setError("Passwords do not match.");
        }
        // Check password length
        if (formData.password.length < 6) {
            console.error("Validation Error: Password too short");
            return setError("Password must be at least 6 characters long.");
        }

        // Validate email format
        if (!validateEmail(formData.email)) {
            console.error("Validation Error: Wrong email format");
            return setError("Invalid email format.");
        }

        try {

            // Exclude confirmPassword before sending data to the backend
            const { confirmPassword, ...userData } = formData;
            const res = await axios.post(`${BACKEND_URL}/register`, userData);
            if(res.data.success) {
                nav("/login");
            } else {
                setError(res?.data?.message)
            }
        } catch (err) {
            console.error("API request failed:", err);
            setError(err.res?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div>
            <form
                className="relative flex flex-col items-center justify-center h-[80vh] overflow-hidden mx-5"
                id="form"
            >
                <div
                    className="w-80 p-6 bg-white border-t-4 border-gray-600 rounded-md shadow-md border-top lg:max-w-lg">
                    <h1 className="text-3xl font-semibold text-center text-gray-700">
                        Create your account
                    </h1>
                    <div className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="label">
                                <span className="text-base label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                className="w-full input input-bordered"
                                maxLength="20"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        {/* Email Input */}
                        <div>
                            <label className="label">
                                <span className="text-base label-text">Email</span>
                            </label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full input input-bordered"
                                maxLength="30"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        {/* Password Input */}
                        <div>
                            <label className="label flex justify-between">
                                <span className="text-base label-text">Password</span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPassHide(!passHide);
                                    }}
                                >
                                    {passHide ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="black"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="black"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </label>

                            <input
                                type={passHide ? "password" : "text"}
                                className="input input-bordered"
                                name="password"
                                placeholder="Enter password"
                                maxLength="20"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <input
                                type={passHide ? "password" : "text"}
                                className="input input-bordered mt-1"
                                name="confirmPassword"
                                placeholder="Repeat password"
                                maxLength="20"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />

                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <div className="flex flex-col justify-center">
                            <button className="btn btn-sm shadow" onClick={handleRegistration}>
                                Create Account
                            </button>
                            <span
                                className="text-center mt-2 text-sm hover:underline cursor-pointer"
                                onClick={() => nav("/login")}
                            >
                 Already a user?
                </span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Registration;