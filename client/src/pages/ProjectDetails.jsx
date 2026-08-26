import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";
import ApplicationForm from "../components/application/ApplicationForm";
import AcceptRejectModal from "../components/application/AcceptRejectModal";
import SubmitWorkModal from "../components/application/SubmitWorkModal";
import ReviewModal from "../components/review/ReviewModal";

const statusStyles = {
  open: "bg-[#E9F5F1] text-[#0F6B5C]",
  "in progress": "bg-[#FDF3D6] text-[#8A6D1D]",
  "under review": "bg-[#E9F5F1] text-[#0F6B5C]",
  "changes requested": "bg-[#FBE7E4] text-[#B3452F]",
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
  
  const [myApplication, setMyApplication] = useState(null);
  const latestChangeRequest = myApplication?.changeRequests && myApplication.changeRequests.length > 0
    ? myApplication.changeRequests[myApplication.changeRequests.length - 1]
    : null;
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittingWork, setSubmittingWork] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [justApplied, setJustApplied] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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

        const matchedApp = myApplications.find((app) => {
          const appProjectId =
            typeof app.projectId === "object" ? app.projectId?._id : app.projectId;
          return appProjectId === id;
        });

        setMyApplication(matchedApp || null);
        setAlreadyApplied(!!matchedApp);
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

  useEffect(() => {
    const checkReviewed = async () => {
      if (isAuthenticated && user?.role === "student" && project?.status === "Completed") {
        try {
          const res = await api.get("/review/written");
          const alreadyReviewed = res.data.reviews.some(r => r.projectId === id);
          setHasReviewed(alreadyReviewed);
        } catch (err) {
          console.error("Failed to check review status:", err);
        }
      }
    };
    checkReviewed();
  }, [id, isAuthenticated, user, project]);

  const handleApplicationSuccess = () => {
    setShowForm(false);
    setAlreadyApplied(true);
    setJustApplied(true);
  };

  const handleSubmitWork = async ({ workLink, remarks }) => {
    try {
      setSubmittingWork(true);
      const res = await api.put(`/applications/${myApplication._id}/submit-work`, { workLink, remarks });
      setMyApplication(res.data.data);
      
      // Refresh project details
      const projRes = await api.get(`/projects/${id}`);
      setProject(projRes.data.data);
      
      setShowSubmitModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit work.");
    } finally {
      setSubmittingWork(false);
    }
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
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl leading-tight mb-3">
            {title}
          </h1>

          {/* Business Info Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-6 text-xs font-['IBM_Plex_Mono'] text-[#6B6459]">
            <p>
              Business: <span className="text-[#1B2430] font-semibold">{project.businessProfile?.businessName || project.businessOwnerId?.name || "Local Business"}</span>
            </p>
            {project.businessProfile?.businessType && (
              <p>
                Business Type: <span className="text-[#1B2430] font-medium">{project.businessProfile.businessType}</span>
              </p>
            )}
          </div>

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

          {myApplication?.status === "Accepted" ? (
            <div className="space-y-8 mt-8 border-t border-[#D8D2C4] pt-8">
              
              {/* Business Owner Section */}
              <div className="bg-[#FAF8F3] border border-[#D8D2C4] rounded-[6px] p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">
                      {project.businessProfile?.businessName || project.businessOwnerId?.name || "Local Business Owner"}
                    </h3>
                    {project.businessProfile?.businessType && (
                      <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#0F6B5C] bg-[#E9F5F1] px-2 py-0.5 rounded border border-[#0F6B5C]/15 inline-block mt-1">
                        {project.businessProfile.businessType}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowBusinessModal(true)}
                    className="font-medium text-xs px-3.5 py-2 rounded-[4px] bg-white border border-[#D8D2C4] text-[#1B2430] hover:border-[#1B2430] hover:bg-[#FAF8F3] transition-colors cursor-pointer"
                  >
                    View Business Profile
                  </button>
                </div>
                {project.businessProfile?.description && (
                  <p className="text-[13.5px] text-[#6B6459] leading-relaxed mt-2.5">
                    {project.businessProfile.description}
                  </p>
                )}
              </div>

              {/* YOUR WORK / WORKSPACE Section */}
              <div className="border border-[#D8D2C4] rounded-[6px] p-6 bg-white shadow-[4px_4px_0px_#1B2430]">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <h3 className="font-['Space_Grotesk'] font-bold text-xl text-[#1B2430]">
                    Your Work
                  </h3>
                  <span className={`font-['IBM_Plex_Mono'] text-[10.5px] font-semibold px-2.5 py-1 rounded-[3px] uppercase tracking-wide ${statusClass}`}>
                    Status: {status}
                  </span>
                </div>

                <div className="bg-[#FAF8F3] border border-dashed border-[#D8D2C4] rounded-[4px] p-4 mb-6">
                  {status?.toLowerCase() === "in progress" && latestChangeRequest && latestChangeRequest.status === "Pending" && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[#B3452F] mb-1">
                        Changes Requested
                      </p>
                      <p className="text-[13px] text-[#6B6459] leading-relaxed">
                        The business owner reviewed your work and requested some modifications.
                      </p>
                      <div className="bg-[#FBE7E4] border border-[#F5C2B8] rounded-[4px] p-3 mt-2">
                        <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#B3452F] mb-1 font-semibold">
                          Business Feedback
                        </span>
                        <p className="text-[13px] text-[#B3452F] whitespace-pre-wrap font-medium">
                          {latestChangeRequest.message}
                        </p>
                        <span className="block text-[10.5px] text-[#9B9384] font-['IBM_Plex_Mono'] mt-1">
                          Requested on: {new Date(latestChangeRequest.requestedAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  {status?.toLowerCase() === "in progress" && (!latestChangeRequest || latestChangeRequest.status !== "Pending") && (
                    <>
                      <p className="text-sm font-semibold text-[#1B2430] mb-1">
                        Application Accepted
                      </p>
                      <p className="text-[13px] text-[#6B6459] leading-relaxed">
                        You have been accepted for this project. Start working and submit your work when it is ready.
                      </p>
                    </>
                  )}

                  {status?.toLowerCase() === "under review" && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[#0F6B5C] mb-1">
                        Work Submitted
                      </p>
                      <p className="text-[13px] text-[#6B6459] leading-relaxed">
                        Your work has been submitted and is currently under review by the business owner.
                      </p>
                      {myApplication.workSubmission?.submittedAt && (
                        <p className="text-xs text-[#9B9384] font-['IBM_Plex_Mono']">
                          Submitted on: {new Date(myApplication.workSubmission.submittedAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      )}
                      {myApplication.workSubmission?.remarks && (
                        <div className="border-t border-dashed border-[#D8D2C4] pt-2 mt-2">
                          <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-1">
                            Your Remarks
                          </span>
                          <p className="text-[13px] text-[#4A473F] whitespace-pre-wrap italic">
                            "{myApplication.workSubmission.remarks}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {status?.toLowerCase() === "completed" && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[#0F6B5C] mb-1">
                        Project Completed
                      </p>
                      <p className="text-[13px] text-[#6B6459] leading-relaxed">
                        Your work has been approved by the business.
                      </p>
                      {myApplication.workSubmission?.submittedAt && (
                        <p className="text-xs text-[#9B9384] font-['IBM_Plex_Mono']">
                          Completed on: {new Date(project.updatedAt || myApplication.updatedAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      )}
                      {myApplication.workSubmission?.remarks && (
                        <div className="border-t border-dashed border-[#D8D2C4] pt-2 mt-2">
                          <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-1">
                            Your Remarks
                          </span>
                          <p className="text-[13px] text-[#4A473F] whitespace-pre-wrap italic">
                            "{myApplication.workSubmission.remarks}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  {status?.toLowerCase() === "in progress" && (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className={`w-full font-semibold text-sm px-6 py-2.5 rounded-[4px] text-white transition-colors duration-150 text-center shadow-sm cursor-pointer ${
                        latestChangeRequest && latestChangeRequest.status === "Pending" ? "bg-[#B3452F] hover:bg-[#963725]" : "bg-[#0F6B5C] hover:bg-[#0C564A]"
                      }`}
                    >
                      {latestChangeRequest && latestChangeRequest.status === "Pending" ? "Edit & Resubmit Work" : "Submit Work"}
                    </button>
                  )}

                  {status?.toLowerCase() === "under review" && myApplication.workSubmission?.workLink && (
                    <a
                      href={myApplication.workSubmission.workLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full font-semibold text-sm px-6 py-2.5 rounded-[4px] border border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 text-center block"
                    >
                      View Submission
                    </a>
                  )}

                  {status?.toLowerCase() === "completed" && myApplication.workSubmission?.workLink && (
                    <a
                      href={myApplication.workSubmission.workLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full font-semibold text-sm px-6 py-2.5 rounded-[4px] border border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 text-center block"
                    >
                      View Final Submission
                    </a>
                  )}

                  {status?.toLowerCase() === "completed" && isAuthenticated && user?.role === "student" && (
                    hasReviewed ? (
                      <span className="w-full font-semibold text-xs px-6 py-2.5 rounded-[4px] bg-[#E9F5F1] text-[#0F6B5C] border border-[#0F6B5C]/15 text-center block font-['IBM_Plex_Mono']">
                        ✓ Reviewed Business
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="w-full font-semibold text-sm px-6 py-2.5 rounded-[4px] bg-[#0F6B5C] text-white hover:bg-[#0C564A] transition-colors duration-150 text-center block cursor-pointer shadow-sm"
                      >
                        Review Business
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Project Information / Timeline Section */}
              <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-sm">
                <h3 className="font-['Space_Grotesk'] font-bold text-base mb-3 text-[#1B2430]">
                  Project Timeline
                </h3>
                <div className="space-y-2.5 text-xs font-['IBM_Plex_Mono'] text-[#6B6459]">
                  <div className="flex justify-between border-b border-dashed border-[#D8D2C4] pb-2">
                    <span>PROJECT CREATED</span>
                    <span className="font-semibold text-[#1B2430]">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-[#D8D2C4] pb-2">
                    <span>DEADLINE</span>
                    <span className="font-semibold text-[#1B2430]">{formattedDeadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CURRENT STATUS</span>
                    <span className="font-semibold uppercase text-[#0F6B5C]">{status}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            isBusiness ? (
              isOwner && (
                <div className="flex gap-3">
                  <Link
                    to={`/${project._id}/edit-project`}
                    state={{ from: location.state?.from }}
                    className="flex-1 text-center font-medium text-sm px-4 py-2.5 rounded-[4px] border border-[#1B2430] text-[#1B2430]
                               hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex-1 font-medium text-sm px-4 py-2.5 rounded-[4px] border border-[#B3452F] text-[#B3452F]
                               hover:bg-[#B3452F] hover:text-white transition-colors duration-150 cursor-pointer"
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
                className="w-full font-semibold cursor-pointer px-6 py-3 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                           hover:bg-[#2B3848] transition-colors duration-150 shadow-sm"
              >
                {isAuthenticated ? "Apply to this project" : "Log in to apply"}
              </button>
            )
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

      {showSubmitModal && (
        <SubmitWorkModal
          mode={latestChangeRequest && latestChangeRequest.status === "Pending" ? "edit" : "submit"}
          feedback={latestChangeRequest && latestChangeRequest.status === "Pending" ? latestChangeRequest.message : ""}
          initialLink={myApplication?.workSubmission?.workLink || ""}
          initialRemarks={myApplication?.workSubmission?.remarks || ""}
          onConfirm={handleSubmitWork}
          onCancel={() => setShowSubmitModal(false)}
          submitting={submittingWork}
        />
      )}

      {showBusinessModal && (
        <div className="fixed inset-0 bg-[#1B2430]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#D8D2C4] rounded-[6px] shadow-[6px_6px_0px_#1B2430] w-full max-w-md p-6 relative">
            <h3 className="font-['Space_Grotesk'] font-bold text-xl mb-4 text-[#1B2430]">
              Business Owner Profile
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5 font-semibold">
                  Business Name
                </span>
                <span className="font-semibold text-[#1B2430] text-[15px]">
                  {project.businessProfile?.businessName || "Local Business Owner"}
                </span>
              </div>
              {project.businessProfile?.businessType && (
                <div>
                  <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5 font-semibold">
                    Business Type
                  </span>
                  <span className="text-[#4A473F]">
                    {project.businessProfile.businessType}
                  </span>
                </div>
              )}
              {project.businessProfile?.description && (
                <div>
                  <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5 font-semibold">
                    About
                  </span>
                  <span className="text-[#4A473F] leading-relaxed block whitespace-pre-line">
                    {project.businessProfile.description}
                  </span>
                </div>
              )}
              {project.businessProfile?.address && (
                <div>
                  <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5 font-semibold">
                    Address
                  </span>
                  <span className="text-[#4A473F]">
                    {project.businessProfile.address}
                  </span>
                </div>
              )}
              {project.businessProfile?.phone && (
                <div>
                  <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5 font-semibold">
                    Contact Phone
                  </span>
                  <span className="text-[#4A473F]">
                    {project.businessProfile.phone}
                  </span>
                </div>
              )}
              {project.businessProfile?.socialLinks && (
                <div>
                  <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-1 font-semibold">
                    Social Links
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {Object.entries(project.businessProfile.socialLinks).map(([platform, link]) => {
                      if (!link) return null;
                      return (
                        <a
                          key={platform}
                          href={link.startsWith("http") ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#0F6B5C] font-semibold hover:underline capitalize"
                        >
                          {platform}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowBusinessModal(false)}
              className="w-full mt-6 font-semibold text-xs py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => setHasReviewed(true)}
          targetName={project?.businessProfile?.businessName || "Business Owner"}
          projectName={project?.title || "Software Project"}
          businessOwnerId={project?.businessOwnerId?._id || project?.businessOwnerId}
          projectId={project?._id}
          reviewerRole="student"
        />
      )}
    </div>
  );
}

export default ProjectDetails;