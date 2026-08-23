import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import BusinessProjects from "./MyBusinesssProjects";
import StudentProjects from "./StudentProjects";

function MyProjects() {
  const { user } = useContext(AuthContext);

  if (user?.role === "student") {
    return <StudentProjects />;
  }

  // Otherwise render the existing business projects dashboard view
  return <BusinessProjects />;
}

export default MyProjects;
