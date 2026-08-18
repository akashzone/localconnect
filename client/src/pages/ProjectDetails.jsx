import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";
import ApplicationForm from "../components/application/ApplicationForm";
import AcceptRejectModal from "../components/application/AcceptRejectModal";

const statusStyles = {
  open: "bg-[#E9F5F1] text-[#0F6B5C]",
  "in progress": "bg-[#FDF3D6] text-[#8A6D1D]",
  completed: "bg-[#EAEAEA] text-[#4A473F]",
  closed: "bg-[#FBE7E4] text-[#B3452F]",
};

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);

  const handleBack = (e) => {
    e.preventDefault();
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/projects");
      }
    }
  };

  const getBackLabel = () => {
    const fromPath = location.state?.from?.pathname || location.state?.from;
    if (fromPath === "/my-projects") return "← Back to My Projects";
    if (fromPath === "/projects") return "← Back to projects";
    return "← Back";
  };

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  const isBusiness = user?.role === "business";
  const isOwner = isAuthenticated && isBusiness && project && (project.businessOwnerId === user?._id || project.businessOwnerId?._id === user?._id);

  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Which application's Accept/Reject modal is currently open
  const [modalTarget, setModalTarget] = useState(null); // { app, action }
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Fetch applications for the project if user is owner
  useEffect(() => {
    const fetchApplications = async () => {
      if (!isOwner) return;
      try {
        setLoadingApps(true);
        const res = await api.get(`/applications/project/${id}`);
        setApplications(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoadingApps(false);
      }
    };

    if (project) {
      fetchApplications();
    }
  }, [id, isOwner, project]);

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

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/projects/${id}` } });
      return;
    }
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    try {
      await api.delete(`/projects/${project._id}`);
      navigate("/my-projects");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  const confirmStatusUpdate = async () => {
    if (!modalTarget) return;
    const { app, action } = modalTarget;

    setSubmittingStatus(true);
    try {
      await api.put(`/applications/${app._id}/status`, { status: action });
      // Refresh applications and project details
      const appRes = await api.get(`/applications/project/${id}`);
      setApplications(appRes.data.data || []);
      const projRes = await api.get(`/projects/${id}`);
      setProject(projRes.data.data);
      setModalTarget(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setSubmittingStatus(false);
    }
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
    skillsRequired = [],
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

        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C] hover:underline mb-8 cursor-pointer border-0 bg-transparent p-0"
        >
          {getBackLabel()}
        </button>

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
          {skillsRequired.length > 0 && (
            <div className="mb-9">
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2">
                Required skills
              </span>
              <div className="flex flex-wrap gap-2">
                {skillsRequired.map((skill) => (
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

          {isBusiness ? (
            isOwner && (
              <div className="flex gap-3">
                <Link
                  to={`/${project._id}/edit-project`}
                  state={{ from: location.state?.from }}
                  className="flex-1 text-center font-semibold text-sm px-4 py-3 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                             hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 font-semibold text-sm px-4 py-3 rounded-[4px] border-2 border-[#B3452F] text-[#B3452F]
                             hover:bg-[#B3452F] hover:text-white transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
            )
          ) : !isOpen ? (
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

          {/* Applications list for project owner */}
          {isOwner && (
            <div className="mt-10 border-t border-[#D8D2C4] pt-8">
              <h2 className="font-['Space_Grotesk'] font-bold text-2xl mb-6">
                Applications ({applications.length})
              </h2>

              {loadingApps ? (
                <p className="font-['IBM_Plex_Mono'] text-xs text-[#9B9384]">Loading applications...</p>
              ) : applications.length === 0 ? (
                <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] italic">
                  No applications received yet for this project.
                </p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[3px_3px_0px_#D8D2C4]"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                        <div>
                          <h4 className="font-semibold text-base">{app.studentId?.name || "Student"}</h4>
                          <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384]">
                            {app.studentId?.email}
                          </span>
                        </div>
                        <span
                          className={`font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-[3px] ${app.status === "Accepted"
                              ? "bg-[#E9F5F1] text-[#0F6B5C]"
                              : app.status === "Rejected"
                                ? "bg-[#FBE7E4] text-[#B3452F]"
                                : "bg-[#FDF3D6] text-[#8A6D1D]"
                            }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="text-[13.5px] text-[#4A473F] space-y-2.5">
                        <div>
                          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                            Estimated Duration
                          </span>
                          <p>{app.estimatedDuration}</p>
                        </div>
                        <div>
                          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                            Cover Letter
                          </span>
                          <p className="whitespace-pre-line leading-relaxed">{app.coverLetter}</p>
                        </div>
                      </div>

                      {app.status === "Pending" && isOpen && (
                        <div className="flex gap-2.5 mt-4 pt-3 border-t border-dashed border-[#D8D2C4]">
                          <button
                            onClick={() => setModalTarget({ app, action: "Accepted" })}
                            className="font-semibold text-xs px-3.5 py-2 rounded-[4px] bg-[#0F6B5C] text-white hover:bg-[#0C5449] cursor-pointer transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => setModalTarget({ app, action: "Rejected" })}
                            className="font-semibold text-xs px-3.5 py-2 rounded-[4px] border border-[#B3452F] text-[#B3452F] hover:bg-[#FBE7E4] cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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

      {modalTarget && (
        <AcceptRejectModal
          applicationName={modalTarget.app.studentId?.name || "This student"}
          action={modalTarget.action}
          onConfirm={confirmStatusUpdate}
          onCancel={() => setModalTarget(null)}
          submitting={submittingStatus}
        />
      )}
    </div>
  );
}

export default ProjectDetails;