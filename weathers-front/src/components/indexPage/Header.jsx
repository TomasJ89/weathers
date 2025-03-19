import React from 'react';
import mainStore from "../../store/mainStore.jsx";

const Header = () => {
    const {user} = mainStore()
    return (
        <div>
            <div
                className="hero min-h-16"
                style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1580193813605-a5c78b4ee01a?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                }}>
                <div className="hero-overlay"></div>
                <div className="hero-content text-base-100 text-center">
                    <div >
                        <h1 className="mb-5 text-5xl font-bold">Welcome to forecast world!</h1>
                        <p className="mb-5">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                        {!user &&
                            <div className="flex gap-2 justify-center ">
                                <button className="btn btn-primary">Log In</button>
                                <button className="btn btn-secondary">Sign Up</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;