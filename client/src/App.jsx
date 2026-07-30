
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
import MyApplications from "./pages/MyApplications";

//componentes
import Navbar from "./components/Navbar"

//developer components 
import DeveloperDashboard from "./pages/DeveloperDashBoard";

//business components
import BusinessDashboard from "./pages/BusinessDashboard";
import MyProjects from "./pages/MyProjects";

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
        <Route path="/projects/:id" element={<ProjectDetails />} />

            //if logged in as developer
        <Route path="/dashboard/developer" element={<DeveloperDashboard />} />
        <Route path="/my-applications" element={<MyApplications />} />

            //if logged in as businessOwner
        <Route path="/dashboard/business" element={<BusinessDashboard />} />
        <Route path="/my-projects" element={<MyProjects />} />
        
      </Routes>
    </>

  );
}

export default App;