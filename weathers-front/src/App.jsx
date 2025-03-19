import {Route, Routes} from "react-router-dom";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import Toolbar from "./components/Toolbar.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  

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
