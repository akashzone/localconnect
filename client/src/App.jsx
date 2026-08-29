
//imports of required packages...
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

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
import StudentProfile from "./pages/StudentProfile";
import PageNotFound from "./pages/PageNotFound";
import OAuthSuccess from "./pages/OAuthSuccess";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";

//componentes
import Navbar from "./components/Navbar"
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import AdminLayout from "./components/AdminLayout";

//student components 
import StudentDashboard from "./pages/StudentDashboard";

//business components
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessApplications from "./pages/BusinessApplications";
import MyProjects from "./pages/MyProjects";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";


function App() {

  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
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
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Dashboard layout wrapping all workspace routes */}
        <Route element={<DashboardLayout />}>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
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

          {/* if logged in as student */}
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
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

          {/* if logged in as businessOwner */}
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
              <ProtectedRoute allowedRoles={["business", "student"]}>
                <MyProjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/student/:studentId"
            element={
              <ProtectedRoute allowedRoles={["business"]}>
                <StudentProfile />
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
            path="/chat/:applicationId"
            element={
              <ProtectedRoute allowedRoles={["student", "business"]}>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={["student", "business"]}>
                <Messages />
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
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>

  );
}

export default App;