
//imports of required packages...
import { Routes, Route } from "react-router-dom";

//pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Projects from "./pages/Projects";

//components 
import Navbar from "./components/Navbar"

function App() {
    return (
      <>
      <Navbar />
       <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
      </>
       
    );
}

export default App;