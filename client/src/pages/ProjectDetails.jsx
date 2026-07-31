import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";
import ApplicationForm from "../components/application/ApplicationForm";

const statusStyles = {
  open: "bg-[#E9F5F1] text-[#0F6B5C]",
  "in progress": "bg-[#FDF3D6] text-[#8A6D1D]",
  completed: "bg-[#EAEAEA] text-[#4A473F]",
  closed: "bg-[#FBE7E4] text-[#B3452F]",
};

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  // Fetch the project itself
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get(`/projects/${id}`);
        setProject(res.data.data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Check if the current developer already applied to this project
  useEffect(() => {
    const checkApplied = async () => {
      // Only developers can apply, so only bother checking for that role
      if (!isAuthenticated || user?.role !== "student") {
        setCheckingApplication(false);
        return;
      }

      try {
        setCheckingApplication(true);
        const res = await api.get("/applications/my");
        const myApplications = res.data.data || [];

        const hasApplied = myApplications.some((app) => {
          const appProjectId =
            typeof app.projectId === "object" ? app.projectId?._id : app.projectId;
          return appProjectId === id;
        });

        setAlreadyApplied(hasApplied);
      } catch (err) {
        console.log(err);
        // Fail quietly here — worst case the Apply button shows when it
        // maybe shouldn't, and the backend still rejects a duplicate on submit.
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplied();
  }, [id, isAuthenticated, user]);

  const handleApplicationSuccess = () => {
    setShowForm(false);
    setAlreadyApplied(true);
    setJustApplied(true);
  };

  // Guests get redirected to login, with the current page remembered
  // so Login.jsx can send them back here after signing in.
  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/projects/${id}` } });
      return;
    }
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
          Loading project...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F]">
          Failed to fetch project.
        </p>
      </div>
    );
  }

  const {
    title,
    description,
    budget,
    deadline,
    skills = [],
    status = "open",
  } = project;

  const statusClass = statusStyles[status?.toLowerCase()] || statusStyles.open;
  const isOpen = status?.toLowerCase() === "open";
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "—";

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] px-4 py-16">
      <div className="max-w-3xl mx-auto">

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C] hover:underline mb-8"
        >
          ← Back to projects
        </Link>

        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[6px_6px_0px_#1B2430]">

          {/* Top row */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384]">
              POSTING #{id?.slice(-4).toUpperCase()}
            </span>
            <span
              className={`font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-[3px] ${statusClass}`}
            >
              {status}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl leading-tight mb-6">
            {title}
          </h1>

          {/* Budget / deadline row */}
          <div className="flex flex-wrap gap-8 border-y border-dashed border-[#D8D2C4] py-5 mb-8">
            <div>
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                Budget
              </span>
              <span className="font-['Space_Grotesk'] font-bold text-xl text-[#0F6B5C]">
                ₹{budget}
              </span>
            </div>

            <div>
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                Deadline
              </span>
              <span className="font-['Space_Grotesk'] font-bold text-xl">
                {formattedDeadline}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2">
              Description
            </span>
            <p className="text-[15px] text-[#4A473F] leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-9">
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2">
                Required skills
              </span>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-['IBM_Plex_Mono'] text-[12px] px-2.5 py-1.5 border border-[#D8D2C4] rounded-[3px] text-[#4A473F]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isOpen ? (
            <div className="w-full text-center font-['IBM_Plex_Mono'] text-[13px] text-[#6B6459] border border-dashed border-[#D8D2C4] rounded-[4px] py-3.5">
              This project is {status?.toLowerCase()} and no longer accepting applications.
            </div>
          ) : checkingApplication ? (
            <div className="w-full text-center font-['IBM_Plex_Mono'] text-[13px] text-[#9B9384] py-3.5">
              Checking application status...
            </div>
          ) : alreadyApplied ? (
            <div className="w-full text-center font-['IBM_Plex_Mono'] text-[13px] text-[#0F6B5C] border border-dashed border-[#0F6B5C]/40 bg-[#E9F5F1] rounded-[4px] py-3.5">
              {justApplied
                ? "✓ Application submitted successfully"
                : "✓ You've already applied to this project"}
            </div>
          ) : (
            <button
              onClick={handleApplyClick}
              className="w-full font-semibold cursor-pointer px-6 py-3.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[4px_4px_0px_#F5C445] hover:shadow-[2px_2px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
            >
              {isAuthenticated ? "Apply to this project" : "Log in to apply"}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <ApplicationForm
          projectId={id}
          projectTitle={title}
          onClose={() => setShowForm(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
}

export default ProjectDetails;