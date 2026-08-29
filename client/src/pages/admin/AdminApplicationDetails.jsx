import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faCalendar,
  faBuilding,
  faUserGraduate,
  faGlobe,
  faPhone,
  faMapMarkerAlt,
  faLink,
  faFilePdf,
  faTimesCircle,
  faCircleCheck,
  faBriefcase,
  faClock,
  faPaperclip,
  faArrowUpRightFromSquare,
  faCircleInfo
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

const AdminApplicationDetails = () => {
  const { id } = useParams();
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplicationDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/applications/${id}`);
      if (res.data?.success && res.data?.data) {
        setApplicationData(res.data.data);
      } else {
        throw new Error(res.data?.message || "Failed to fetch application details");
      }
    } catch (err) {
      console.error("Error fetching application details:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load application details. Please check the ID or try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200/60";
      case "Withdrawn":
        return "bg-gray-50 text-gray-500 border-gray-200/60";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200/60";
    }
  };

  const getProjectStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "Under Review":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Changes Requested":
        return "bg-orange-50 text-orange-700 border-orange-200/60";
      case "Completed":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      case "Cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200/60";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200/60";
    }
  };

  const formatBudget = (value) => {
    if (value === undefined || value === null) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-6 w-36 bg-[#D8D2C4]/40 rounded-[4px]" />
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 space-y-4">
          <div className="h-8 w-1/3 bg-[#D8D2C4]/40 rounded" />
          <div className="h-4 w-1/4 bg-[#D8D2C4]/40 rounded" />
          <div className="h-24 bg-[#D8D2C4]/40 rounded" />
        </div>
      </div>
    );
  }

  if (error || !applicationData) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Link to="/admin/applications" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F6B5C] hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Applications</span>
        </Link>
        <div className="p-8 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <FontAwesomeIcon icon={faTimesCircle} className="text-[#B3452F] text-4xl mb-3" />
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">Application Details Error</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1 max-w-md mx-auto">{error || "Application details could not be retrieved."}</p>
          <Link
            to="/admin/applications"
            className="inline-block mt-4 px-4 py-2 bg-[#1B2430] text-white rounded-[4px] text-xs font-semibold shadow-[2px_2px_0px_#0F6B5C]"
          >
            Back to Applications List
          </Link>
        </div>
      </div>
    );
  }

  const { application, studentProfile, businessOwner, businessProfile } = applicationData;
  const { coverLetter, estimatedDuration, status, studentId, projectId, workSubmission, createdAt } = application;
  
  const studentName = studentId?.name || "Not provided";
  const studentEmail = studentId?.email || "Not provided";
  const projectTitle = projectId?.title || "Not provided";
  const clientName = businessProfile?.businessName || businessOwner?.name || "Not provided";
  const statusStyle = getStatusBadgeStyle(status);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-['IBM_Plex_Sans'] text-sm text-[#1B2430]">
      
      {/* Page Header Area */}
      <div className="flex flex-col gap-4 pb-4 border-b border-[#D8D2C4]">
        <div>
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#FAF8F3] text-xs font-semibold text-[#1B2430] border border-[#D8D2C4] rounded-[4px] transition-colors shadow-[2px_2px_0px_#1B2430] mb-3"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Applications</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-[#1B2430]">
              Application Details
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6459] mt-0.5">
              Review the application, proposal, project, student, and business information.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] font-medium hidden sm:inline">
              STATUS:
            </span>
            <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-[3px] border uppercase tracking-wider text-[10px] sm:text-[11px] ${statusStyle}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1 — APPLICATION OVERVIEW (wide single card) */}
      <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 sm:p-6 shadow-[4px_4px_0px_#1B2430] space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#D8D2C4]/60">
          <h2 className="font-['Space_Grotesk'] font-bold text-sm tracking-wider text-[#6B6459] uppercase">
            Application Overview
          </h2>
          <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459]">
            ID: <span className="font-semibold">{id}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 text-sm">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase font-semibold block">Student Developer</span>
            <span className="font-bold text-[#1B2430] block mt-1 truncate">{studentName}</span>
          </div>
          <div className="lg:col-span-2">
            <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase font-semibold block">Project Target</span>
            <span className="font-bold text-[#1B2430] block mt-1 truncate" title={projectTitle}>{projectTitle}</span>
          </div>
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase font-semibold block">Business Client</span>
            <span className="font-bold text-[#1B2430] block mt-1 truncate">{clientName}</span>
          </div>
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase font-semibold block">Submitted On</span>
            <span className="font-semibold text-[#1B2430] block mt-1 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendar} className="text-xs text-[#6B6459]" />
              <span>{formatDate(createdAt)}</span>
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: Proposal + Project */}
        <div className="space-y-6">
          
          {/* Proposal Details Card */}
          <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 sm:p-6 shadow-[4px_4px_0px_#1B2430] space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-base text-[#1B2430] pb-2 border-b border-[#D8D2C4]/60 flex items-center gap-2">
              <FontAwesomeIcon icon={faPaperclip} className="text-xs text-[#0F6B5C]" />
              <span>Proposal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#FAF8F3] p-3 rounded border border-[#D8D2C4] text-xs">
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase font-semibold block">Estimated Duration</span>
                <span className="font-bold text-[#1B2430] block mt-0.5">{estimatedDuration || "Not provided"}</span>
              </div>
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase font-semibold block">Submitted Date</span>
                <span className="font-bold text-[#1B2430] block mt-0.5">{formatDate(createdAt)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase font-semibold block">Cover Letter Text</span>
              <p className="font-['IBM_Plex_Sans'] text-sm text-[#1B2430] whitespace-pre-line leading-relaxed bg-[#FAF8F3] p-3.5 rounded border border-[#D8D2C4] max-h-80 overflow-y-auto">
                {coverLetter || "Not provided"}
              </p>
            </div>

            {/* Work Submission Info (if exists) */}
            {workSubmission && workSubmission.workLink && (
              <div className="space-y-3 p-4 bg-emerald-50 border border-emerald-200/80 rounded-[4px]">
                <h4 className="font-bold text-[#0F6B5C] flex items-center gap-1.5 uppercase text-xs font-['IBM_Plex_Mono'] tracking-wider">
                  <FontAwesomeIcon icon={faCircleCheck} />
                  <span>Work Deliverable Submitted</span>
                </h4>
                <div>
                  <span className="text-[10px] text-[#6B6459] font-['IBM_Plex_Mono'] uppercase font-semibold block">Submission Web Link</span>
                  <a
                    href={workSubmission.workLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0F6B5C] hover:underline font-semibold flex items-center gap-1 mt-0.5 truncate"
                  >
                    <FontAwesomeIcon icon={faLink} className="text-xs" />
                    <span>{workSubmission.workLink}</span>
                  </a>
                </div>
                {workSubmission.remarks && (
                  <div>
                    <span className="text-[10px] text-[#6B6459] font-['IBM_Plex_Mono'] uppercase font-semibold block">Remarks Description</span>
                    <p className="text-xs text-[#6B6459] mt-0.5 whitespace-pre-line bg-white/70 p-2.5 rounded border border-[#D8D2C4]/40">{workSubmission.remarks}</p>
                  </div>
                )}
                {workSubmission.submittedAt && (
                  <span className="text-[9px] text-[#6B6459] font-['IBM_Plex_Mono'] block">Date: {formatDate(workSubmission.submittedAt)}</span>
                )}
              </div>
            )}
          </section>

          {/* Project Specifications Card */}
          {projectId && (
            <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 sm:p-6 shadow-[4px_4px_0px_#1B2430] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#D8D2C4]/60">
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-[#1B2430] flex items-center gap-2">
                  <FontAwesomeIcon icon={faBriefcase} className="text-xs text-[#0F6B5C]" />
                  <span>Project Specifications</span>
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-[3px] border uppercase tracking-wider ${getProjectStatusStyle(projectId.status)}`}>
                  {projectId.status}
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <h4 className="font-bold text-[#1B2430] text-base">{projectId.title}</h4>
                  <span className="text-[9px] font-['IBM_Plex_Mono'] text-[#6B6459] block mt-0.5 uppercase tracking-wider font-semibold">
                    Category: {projectId.category || "Uncategorized"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF8F3] p-3 rounded border border-[#D8D2C4] text-xs">
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] block uppercase font-semibold">Budget Amount</span>
                    <span className="font-bold text-[#0F6B5C] text-sm">{formatBudget(projectId.budget)}</span>
                  </div>
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] block uppercase font-semibold">Target Deadline</span>
                    <span className="font-bold block mt-0.5 text-[#1B2430]">{formatDate(projectId.deadline)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase font-semibold block">Description</span>
                  <p className="text-xs text-[#6B6459] leading-relaxed p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4]/60 max-h-48 overflow-y-auto">
                    {projectId.description}
                  </p>
                </div>

                <div className="pt-2 flex justify-between items-center gap-4 flex-wrap">
                  <div className="flex flex-wrap gap-1">
                    {projectId.skillsRequired?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[9px] font-['IBM_Plex_Mono'] bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 rounded-[2px]">{s}</span>
                    ))}
                  </div>

                  <Link
                    to={`/admin/projects/${projectId._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#1B2430] hover:text-white border border-[#D8D2C4] rounded-[4px] text-xs font-semibold text-[#1B2430] transition-colors cursor-pointer"
                  >
                    <span>View Project</span>
                    <FontAwesomeIcon icon={faArrowLeft} className="rotate-180 text-[10px]" />
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Student + Business */}
        <div className="space-y-6">
          
          {/* Student Developer Card */}
          <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[4px_4px_0px_#1B2430] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#D8D2C4]">
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-[#1B2430] flex items-center gap-2">
                <FontAwesomeIcon icon={faUserGraduate} className="text-xs text-[#0F6B5C]" />
                <span>Student Developer</span>
              </h3>
              {studentId && (
                <Link
                  to={`/admin/users/${studentId._id}`}
                  className="text-xs text-[#0F6B5C] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View Student</span>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                </Link>
              )}
            </div>

            {studentId ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center border border-[#F5C445] shrink-0">
                    {studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#1B2430] truncate">{studentName}</h4>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] block truncate">{studentEmail}</span>
                  </div>
                </div>

                {studentProfile ? (
                  <div className="space-y-3.5 bg-[#FAF8F3] p-4 rounded border border-[#D8D2C4] leading-relaxed">
                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase block font-semibold">Developer Bio</span>
                      <p className="text-xs text-[#6B6459] mt-1 max-h-32 overflow-y-auto">{studentProfile.bio || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase block font-semibold">Skills Expertise</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {studentProfile.skills?.length > 0 ? (
                          studentProfile.skills.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 text-[9px] font-['IBM_Plex_Mono'] bg-[#0F6B5C]/15 text-[#0F6B5C] rounded-[2px]">{s}</span>
                          ))
                        ) : (
                          <span className="text-[#6B6459] italic text-[11px]">Not provided</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Socials / Links */}
                    <div className="pt-3 border-t border-[#D8D2C4]/60 grid grid-cols-1 sm:grid-cols-2 gap-2 font-semibold">
                      {studentProfile.resume ? (
                        <a href={studentProfile.resume} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faFilePdf} className="text-red-700 text-xs shrink-0" />
                          <span className="truncate">View Resume</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#6B6459]/50">
                          <FontAwesomeIcon icon={faFilePdf} className="text-xs shrink-0" />
                          <span>Resume: Not provided</span>
                        </div>
                      )}
                      
                      {studentProfile.portfolio ? (
                        <a href={studentProfile.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faGlobe} className="text-xs shrink-0" />
                          <span className="truncate">Portfolio website</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#6B6459]/50">
                          <FontAwesomeIcon icon={faGlobe} className="text-xs shrink-0" />
                          <span>Portfolio: Not provided</span>
                        </div>
                      )}
                      
                      {studentProfile.github ? (
                        <a href={studentProfile.github.startsWith("http") ? studentProfile.github : `https://github.com/${studentProfile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faGithub} className="text-xs shrink-0" />
                          <span className="truncate">GitHub Profile</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#6B6459]/50">
                          <FontAwesomeIcon icon={faGithub} className="text-xs shrink-0" />
                          <span>GitHub: Not provided</span>
                        </div>
                      )}
                      
                      {studentProfile.linkedIn ? (
                        <a href={studentProfile.linkedIn.startsWith("http") ? studentProfile.linkedIn : `https://linkedin.com/in/${studentProfile.linkedIn}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faLinkedin} className="text-xs shrink-0" />
                          <span className="truncate">LinkedIn Profile</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#6B6459]/50">
                          <FontAwesomeIcon icon={faLinkedin} className="text-xs shrink-0" />
                          <span>LinkedIn: Not provided</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#6B6459] italic p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4]">No developer profile details registered.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#6B6459] italic">Applicant developer details are missing.</p>
            )}
          </section>

          {/* Business Owner Client Card */}
          <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[4px_4px_0px_#1B2430] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#D8D2C4]">
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-[#1B2430] flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-xs text-[#0F6B5C]" />
                <span>Business Owner</span>
              </h3>
              {businessOwner && (
                <Link
                  to={`/admin/users/${businessOwner._id}`}
                  className="text-xs text-[#0F6B5C] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View Owner</span>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                </Link>
              )}
            </div>

            {businessOwner ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center border border-[#F5C445] shrink-0">
                    {clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#1B2430] truncate">{clientName}</h4>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] block truncate">
                      Owner: {businessOwner.name} ({businessOwner.email})
                    </span>
                  </div>
                </div>

                {businessProfile ? (
                  <div className="space-y-3.5 bg-[#FAF8F3] p-4 rounded border border-[#D8D2C4] leading-relaxed">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-b border-[#D8D2C4]/40 pb-3">
                      <div>
                        <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase block font-semibold">Business Type</span>
                        <span className="font-semibold text-[#1B2430]">{businessProfile.businessType || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase block font-semibold">Phone Contact</span>
                        <span className="font-semibold text-[#1B2430] flex items-center gap-1 mt-0.5">
                          <FontAwesomeIcon icon={faPhone} className="text-[10px] text-[#6B6459]" />
                          <span>{businessProfile.phone || "Not provided"}</span>
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase block font-semibold">HQ Location</span>
                        <span className="font-semibold text-[#1B2430] flex items-center gap-1 mt-0.5">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[10px] text-[#6B6459]" />
                          <span>{businessProfile.address || "Not provided"}</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase block font-semibold">Company Overview</span>
                      <p className="text-xs text-[#6B6459] mt-1 max-h-32 overflow-y-auto">{businessProfile.description || "Not provided"}</p>
                    </div>

                    {/* Business Social links */}
                    <div className="pt-3 border-t border-[#D8D2C4]/60 grid grid-cols-1 sm:grid-cols-2 gap-2 font-semibold">
                      {businessProfile.socialLinks?.website ? (
                        <a href={businessProfile.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faGlobe} className="text-xs shrink-0" />
                          <span className="truncate">Website url</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#6B6459]/50">
                          <FontAwesomeIcon icon={faGlobe} className="text-xs shrink-0" />
                          <span>Website: Not provided</span>
                        </div>
                      )}

                      {businessProfile.socialLinks?.linkedin ? (
                        <a href={businessProfile.socialLinks.linkedin.startsWith("http") ? businessProfile.socialLinks.linkedin : `https://linkedin.com/company/${businessProfile.socialLinks.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faLinkedin} className="text-xs shrink-0" />
                          <span className="truncate">LinkedIn Page</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#6B6459]/50">
                          <FontAwesomeIcon icon={faLinkedin} className="text-xs shrink-0" />
                          <span>LinkedIn: Not provided</span>
                        </div>
                      )}

                      {businessProfile.socialLinks?.instagram ? (
                        <a href={businessProfile.socialLinks.instagram.startsWith("http") ? businessProfile.socialLinks.instagram : `https://instagram.com/${businessProfile.socialLinks.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faInstagram} className="text-xs shrink-0" />
                          <span className="truncate">Instagram url</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#6B6459]/50">
                          <FontAwesomeIcon icon={faInstagram} className="text-xs shrink-0" />
                          <span>Instagram: Not provided</span>
                        </div>
                      )}

                      {businessProfile.socialLinks?.facebook ? (
                        <a href={businessProfile.socialLinks.facebook.startsWith("http") ? businessProfile.socialLinks.facebook : `https://facebook.com/${businessProfile.socialLinks.facebook}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faFacebook} className="text-xs shrink-0" />
                          <span className="truncate">Facebook Page</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#6B6459]/50">
                          <FontAwesomeIcon icon={faFacebook} className="text-xs shrink-0" />
                          <span>Facebook: Not provided</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#6B6459] italic p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4]">No business profile details registered.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#6B6459] italic">Business owner client details are missing.</p>
            )}
          </section>
        </div>

      </div>
    </div>
  );
};

export default AdminApplicationDetails;
