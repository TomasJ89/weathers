import {Route, Routes,} from "react-router-dom";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import Toolbar from "./components/Toolbar.jsx";
import Footer from "./components/Footer.jsx";
import City from "./pages/City.jsx"
import mainStore from "./store/mainStore.jsx";
import {useEffect} from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://myweather-backend.1tggzg5ms3kd.eu-de.codeengine.appdomain.cloud";
function App() {
    // Access state management functions and loading state from the store
    const {setUser,setLoading,loading} = mainStore()

    useEffect(() => {
        // Auto-login effect that runs once when the app loads
        const checkAutoLogin = async () => {
            const autoLogin = localStorage.getItem("autologin");
            const token = localStorage.getItem("token");
            if (!token) return;
            if (autoLogin) {
                setLoading(true);
                try {
                    const res = await axios.post(`${BACKEND_URL}/auto-login`, {}, {
                        headers: { Authorization: `Bearer ${token}` } // Send token in headers
                    });
                    if (res.data.success) {
                        setUser(res.data.data); // Update user state on success
                        setLoading(false);
                    }
                } catch (err) {
                    console.error("Auto-login failed:", err);
                    localStorage.removeItem("token");
                    setLoading(false);
                }
            }
        };
        checkAutoLogin();
    }, []);
  

  return (
    <>
        {/* Main layout container */}
     <div className="min-h-screen">
         <Toolbar/>  {/* Top navigation bar */}
         {/* Main content area */}
         <div className="container mx-auto bg-[#F8FAFC] min-h-screen">
             {loading ? (
                 <div className="flex items-center justify-center">
                     <span className="loading loading-ring loading-xl"></span>
                 </div>

             ) : (
                 // Render routes when loading is complete
                 <Routes>
                     <Route path="/" element={<Index />} />
                     <Route path="/registration" element={<Registration />} />
                     <Route path="/login" element={<Login />} />
                     <Route path="/city/:name" element={<City />} />
                     {/*<Route path="*" element={<NotFound/>}/>*/}
                 </Routes>
             )}
         </div>

         <Footer/>  {/* Bottom footer */}
     </div>
    </>
  )
}

export default App
