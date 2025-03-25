import React from 'react';
import mainStore from "../store/mainStore.jsx";
import {useNavigate} from "react-router-dom";

function Toolbar() {
    const {user,setUser} = mainStore()
    const nav = useNavigate()

// Function to log out the user
    function handleLogout() {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('autologin');
        nav("/");
    }

    return (
            <div className="navbar bg-gray-300 shadow-sm">
                <div className="flex-1">
                    {/* Logo / Home navigation */}
                    <a className="btn btn-ghost text-xl" onClick={()=>nav("/")}>My Weather</a>
                </div>
                {/* If user is logged in, show profile dropdown */}
                {user? <div className="flex gap-2">
                    <div className="dropdown dropdown-end">
                        {/* Profile avatar button */}
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt={`${user.username} profile photo`}
                                    src={user.image}/>
                            </div>
                        </div>
                        {/* Dropdown menu for profile options */}
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>

                            <li onClick={handleLogout}><a>Logout</a></li>


                        </ul>
                    </div>
                </div>:
                    // If user is not logged in, show login and sign-up buttons
                    <div className="flex gap-2">
                    <button className="btn" onClick={()=>nav("/login")}>Log in</button>
                    <button className="btn" onClick={()=>nav("/registration")}>Sign up</button>
                </div>}

            </div>
    );
}

export default Toolbar;