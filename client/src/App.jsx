
//imports of required packages...
import { Routes, Route } from "react-router-dom";

//pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";

//components 
import Navbar from "./components/Navbar"
import DeveloperDashboard from "./pages/DeveloperDashBoard";

function App() {
    return (
      <>
      <Navbar />
       <Routes>
            // anyone can access logged in or new user
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects/:id" element={<ProjectDetails/>} />

            //if logged in as developer
            <Route path="/dashboard/developer" element={<DeveloperDashboard />} />


            
        </Routes>
      </>
       
    );
}

export default App;