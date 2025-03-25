import React, { useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import mainStore from "../store/mainStore.jsx";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function Login() {
    const nav = useNavigate()
    const [error, setError] = useState(null);
    const [passHide, setPassHide] = useState(true);
    const [remember,setRemember] = useState(false);
    const {setUser} = mainStore()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        const requiredFields = Object.entries(formData).filter(([_, value]) => !value);
        if (requiredFields.length > 0) {
            console.error("Validation Error: Missing fields", requiredFields);
            return setError("Please fill in all fields.");
        }
        try {
            const {...userData } = formData;
            const res = await axios.post(`https://myweather-backend.1tggzg5ms3kd.eu-de.codeengine.appdomain.cloud/login`, userData);
            if(res.data.success) {
                setUser(res.data.data)
                localStorage.setItem("token", res.data.token);
                if (remember) {
                    localStorage.setItem("autologin", "true");
                } else {
                    localStorage.removeItem("autologin");
                }
                nav("/");
            } else {
                setError(res?.data?.message)
            }
        } catch (err) {
            console.error("API request failed:", err);
            setError(err.res?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div>
            <form
                className="relative flex flex-col items-center justify-center h-[80vh] overflow-hidden mx-5"
                id="form"
            >
                <div className="w-80 p-6 bg-white border-t-4 border-gray-600 rounded-md shadow-md border-top lg:max-w-lg">
                    <h1 className="text-3xl font-semibold text-center text-gray-700">
                        Log in to My Weather
                    </h1>
                    <div className="space-y-4">
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
                        <div>
                            <label className="label">
                                <span className="text-base label-text">Password</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
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
                                            stroke="currentColor"
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
                                            stroke="currentColor"
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

                                <input
                                    type={passHide ? "password" : "text"}
                                    className="grow"
                                    name="password"
                                    placeholder="Enter password"
                                    maxLength="20"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>
                        <label className="fieldset-label">
                            <input type="checkbox"  className="checkbox w-4 h-4" checked={remember}
                                   onChange={(e) => setRemember(e.target.checked)} />
                            Remember me
                        </label>
                        {error && <p className="text-sm text-red-500 ">{error}</p>}
                        <div className="flex flex-col justify-center">
                            <button className="btn btn-sm shadow" onClick={handleLogin}>
                                Log in
                            </button>
                            <span
                                className="text-center mt-2 text-sm hover:underline cursor-pointer"
                                onClick={() => nav("/registration")}
                            >
                  Sign up. It's free and takes five seconds.
                </span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;