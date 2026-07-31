import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";
import ProjectForm from "../components/project/ProjectForm";

function CreateProject() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Guard: only business owners can access this page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/create-project" } });
    } else if (user?.role !== "business") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (formValues) => {
    setErrorMsg("");

    const { title, description, budget, deadline, category, skillsRequired } = formValues;

    if (!title || !description || !budget || !deadline || !category) {
      return setErrorMsg("All fields are required");
    }
    if (Number(budget) <= 0) {
      return setErrorMsg("Budget must be greater than 0");
    }
    if (skillsRequired.length === 0) {
      return setErrorMsg("Add at least one required skill");
    }

    try {
      setSubmitting(true);
      const res = await api.post("/projects", {
        title,
        description,
        budget: Number(budget),
        deadline,
        category,
        skillsRequired,
      });

      const newProjectId = res.data?.data?._id;
      navigate(newProjectId ? `/projects/${newProjectId}` : "/my-projects");
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
          New posting
        </span>
        <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-8">
          Create a Project
        </h1>

        <ProjectForm
          onSubmit={handleSubmit}
          submitting={submitting}
          errorMsg={errorMsg}
          cancelTo="/my-projects"
          submitLabel="Post Project"
        />
      </div>
    </div>
  );
}

export default CreateProject;