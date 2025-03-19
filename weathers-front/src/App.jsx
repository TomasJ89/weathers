import {Route, Routes, useNavigate} from "react-router-dom";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import Toolbar from "./components/Toolbar.jsx";
import Footer from "./components/Footer.jsx";
import mainStore from "./store/mainStore.jsx";
import {useEffect} from "react";
import axios from "axios";
function App() {
    const {setUser,setLoading} = mainStore()
    const nav = useNavigate()

    useEffect(() => {
        const checkAutoLogin = async () => {
            const autoLogin = localStorage.getItem("autologin");
            const token = localStorage.getItem("token");
            if (!token) return;
            if (autoLogin) {
                setLoading(true);
                try {
                    const res = await axios.post("http://localhost:2000/auto-login", {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        setUser(res.data.data);
                        nav("/");
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
     <div className="min-h-screen">
         <Toolbar/>
         <div className="container mx-auto bg-[#F8FAFC] min-h-screen">
             <Routes>
                 <Route path="/" element={<Index/>}/>
                 <Route path="/registration" element={<Registration/>}/>
                 <Route path="/login" element={<Login/>}/>
                 {/*<Route path="*" element={<NotFound/>}/>*/}
             </Routes>
         </div>

         <Footer/>
     </div>
    </>
  )
}

export default App
