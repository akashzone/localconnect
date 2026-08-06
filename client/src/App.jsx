
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
import Profile from "./pages/Profile";
import DeveloperProfile from "./pages/DeveloperProfile";

//componentes
import Navbar from "./components/Navbar"
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";

//developer components 
import DeveloperDashboard from "./pages/DeveloperDashboard";

//business components
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessApplications from "./pages/BusinessApplications";
import MyProjects from "./pages/MyProjects";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
            // anyone can access logged in or new user
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

            //if logged in as developer
        <Route
          path="/dashboard/developer"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

            //if logged in as businessOwner
        <Route
          path="/dashboard/business"
          element={
            <ProtectedRoute allowedRoles={["business"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-projects"
          element={
            <ProtectedRoute allowedRoles={["business"]}>
              <MyProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/developer/:developerId"
          element={
            <ProtectedRoute allowedRoles={["business"]}>
              <DeveloperProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/business"
          element={
            <ProtectedRoute allowedRoles={["business"]}>
              <BusinessApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute allowedRoles={["business"]}>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:id/edit-project"
          element={
            <ProtectedRoute allowedRoles={["business"]}>
              <EditProject />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>

  );
}

export default App;