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
  faShieldHalved,
  faGlobe,
  faPhone,
  faMapMarkerAlt,
  faLink,
  faFilePdf,
  faTimesCircle,
  faCircleCheck,
  faBriefcase,
  faClock,
  faClipboardList,
  faFileCode
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

const AdminSubmissionDetails = () => {
  const { id } = useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissionDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/submissions/${id}`);
      if (res.data?.success && res.data?.data) {
        setSubmissionData(res.data.data);
      } else {
        throw new Error(res.data?.message || "Failed to fetch submission details");
      }
    } catch (err) {
      console.error("Error fetching submission details:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load submission details. Please check the ID or try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [fetchSubmissionDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getProjectStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "Under Review":
        return "bg-amber-50 text-amber-700 border-amber-200/60 font-semibold";
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

  const getApplicationStatusStyle = (status) => {
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

  const formatBudget = (value) => {
    if (value === undefined || value === null) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const renderSocialIcon = (platform) => {
    switch (platform) {
      case "github":
        return <FontAwesomeIcon icon={faGithub} className="text-gray-700" />;
      case "linkedin":
        return <FontAwesomeIcon icon={faLinkedin} className="text-blue-700" />;
      case "instagram":
        return <FontAwesomeIcon icon={faInstagram} className="text-pink-600" />;
      case "facebook":
        return <FontAwesomeIcon icon={faFacebook} className="text-blue-600" />;
      default:
        return <FontAwesomeIcon icon={faGlobe} className="text-[#0F6B5C]" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-[#D8D2C4]/40 rounded-[4px]" />
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 space-y-4">
          <div className="h-8 w-1/3 bg-[#D8D2C4]/40 rounded" />
          <div className="h-4 w-1/4 bg-[#D8D2C4]/40 rounded" />
          <div className="h-20 bg-[#D8D2C4]/40 rounded" />
        </div>
      </div>
    );
  }

  if (error || !submissionData) {
    return (
      <div className="space-y-6">
        <Link to="/admin/submissions" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F6B5C] hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Submissions</span>
        </Link>
        <div className="p-8 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <FontAwesomeIcon icon={faTimesCircle} className="text-[#B3452F] text-4xl mb-3" />
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">Submission Details Error</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1 max-w-md mx-auto">{error || "Submission details could not be retrieved."}</p>
          <Link
            to="/admin/submissions"
            className="inline-block mt-4 px-4 py-2 bg-[#1B2430] text-white rounded-[4px] text-xs font-semibold shadow-[2px_2px_0px_#0F6B5C]"
          >
            Back to Submissions List
          </Link>
        </div>
      </div>
    );
  }

  const { application, studentProfile, businessOwner, businessProfile } = submissionData;
  const { workSubmission, studentId, projectId, createdAt } = application;

  return (
    <div className="space-y-6 font-['IBM_Plex_Sans'] text-sm text-[#1B2430]">
      {/* Back Button */}
      <div>
        <Link
          to="/admin/submissions"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#FAF8F3] text-xs font-semibold text-[#1B2430] border border-[#D8D2C4] rounded-[4px] transition-colors shadow-[2px_2px_0px_#1B2430]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Submissions</span>
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section (2/3 width) - Work Submission deliverable & related specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Submission Card */}
          <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8D2C4]/60">
              <div className="flex items-center gap-2">
                <span className="font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-wider bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 px-2 py-0.5 rounded-[3px]">
                  Deliverable Info
                </span>
                <h2 className="font-['Space_Grotesk'] font-bold text-xl text-[#1B2430] block">
                  Work Submission
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 rounded-[3px] uppercase tracking-wider">
                <FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" />
                <span>Submitted</span>
              </span>
            </div>

            {/* Submission Date & Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F3] p-4 rounded border border-[#D8D2C4]">
              <div className="sm:col-span-2">
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Submission Web Link</span>
                {workSubmission?.workLink ? (
                  <a href={workSubmission.workLink} target="_blank" rel="noreferrer" className="text-[#0F6B5C] hover:underline font-semibold flex items-center gap-1.5 mt-1 truncate">
                    <FontAwesomeIcon icon={faLink} className="text-xs" />
                    <span className="truncate">{workSubmission.workLink}</span>
                  </a>
                ) : (
                  <span className="text-[#6B6459] italic mt-1 block">Not provided</span>
                )}
              </div>
              <div className="pt-2 sm:col-span-2 border-t border-[#D8D2C4]/50">
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Submitted At</span>
                <span className="font-semibold text-[#1B2430] block mt-1 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCalendar} className="text-xs text-[#6B6459]" />
                  <span>{formatDate(workSubmission?.submittedAt || application.updatedAt)}</span>
                </span>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Remarks Description</span>
              <p className="font-['IBM_Plex_Sans'] text-sm text-[#1B2430] whitespace-pre-line leading-relaxed bg-[#FAF8F3] p-3.5 rounded border border-[#D8D2C4]">
                {workSubmission?.remarks || "Not provided"}
              </p>
            </div>
          </section>

          {/* Project Specs Card */}
          {projectId && (
            <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D2C4]/60">
                <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] flex items-center gap-2">
                  <FontAwesomeIcon icon={faBriefcase} className="text-xs text-[#0F6B5C]" />
                  <span>Project Context</span>
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-[3px] border uppercase tracking-wider ${getProjectStatusStyle(projectId.status)}`}>
                  {projectId.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-[#1B2430] text-base">{projectId.title}</h4>
                  <span className="text-[10px] font-['IBM_Plex_Mono'] text-[#6B6459] block mt-0.5 uppercase">Category: {projectId.category || "Uncategorized"}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF8F3] p-3 rounded border border-[#D8D2C4] text-xs">
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] block uppercase">Budget Amount</span>
                    <span className="font-bold text-[#0F6B5C] text-sm">{formatBudget(projectId.budget)}</span>
                  </div>
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] block uppercase">Target Deadline</span>
                    <span className="font-semibold block mt-0.5">{formatDate(projectId.deadline).split(" at")[0]}</span>
                  </div>
                </div>

                <p className="text-xs text-[#6B6459] leading-relaxed p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4]/60">
                  {projectId.description}
                </p>

                <div className="pt-2 flex justify-between items-center gap-4 flex-wrap">
                  <div className="flex flex-wrap gap-1">
                    {projectId.skillsRequired?.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[10px] font-['IBM_Plex_Mono'] bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 rounded-[2px]">{s}</span>
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

        {/* Right Section (1/3 width) - Student, Business, Application Details */}
        <div className="space-y-6">
          {/* Student Developer Card */}
          <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[4px_4px_0px_#1B2430] space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-md text-[#1B2430] pb-2 border-b border-[#D8D2C4] flex items-center gap-2">
              <FontAwesomeIcon icon={faUserGraduate} className="text-xs text-[#0F6B5C]" />
              <span>Student Developer</span>
            </h3>

            {studentId ? (
              <div className="space-y-3.5 text-xs text-[#1B2430]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center border border-[#F5C445] shrink-0">
                    {studentId.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1B2430] truncate">{studentId.name}</h4>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] block truncate">{studentId.email}</span>
                  </div>
                </div>

                {studentProfile ? (
                  <div className="space-y-3 bg-[#FAF8F3] p-3.5 rounded border border-[#D8D2C4] leading-relaxed">
                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Developer Bio</span>
                      <p className="text-xs text-[#6B6459] mt-0.5 line-clamp-3">{studentProfile.bio || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Skills</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {studentProfile.skills?.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 text-[9px] font-['IBM_Plex_Mono'] bg-[#0F6B5C]/15 text-[#0F6B5C] rounded-[2px]">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2.5 border-t border-[#D8D2C4]/60 flex flex-col gap-1.5 font-semibold">
                      {studentProfile.resume && (
                        <a href={studentProfile.resume} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faFilePdf} className="text-red-700 text-[10px]" />
                          <span>View Resume</span>
                        </a>
                      )}
                      {studentProfile.portfolio && (
                        <a href={studentProfile.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faGlobe} className="text-[10px]" />
                          <span>Portfolio Link</span>
                        </a>
                      )}
                      {studentProfile.github && (
                        <a href={studentProfile.github.startsWith("http") ? studentProfile.github : `https://github.com/${studentProfile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faGithub} className="text-[10px]" />
                          <span>GitHub Profile</span>
                        </a>
                      )}
                      {studentProfile.linkedIn && (
                        <a href={studentProfile.linkedIn.startsWith("http") ? studentProfile.linkedIn : `https://linkedin.com/in/${studentProfile.linkedIn}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faLinkedin} className="text-[10px]" />
                          <span>LinkedIn Connect</span>
                        </a>
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
            <h3 className="font-['Space_Grotesk'] font-bold text-md text-[#1B2430] pb-2 border-b border-[#D8D2C4] flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-xs text-[#0F6B5C]" />
              <span>Business Client</span>
            </h3>

            {businessOwner ? (
              <div className="space-y-3.5 text-xs text-[#1B2430]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center border border-[#F5C445] shrink-0">
                    {businessOwner.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1B2430] truncate">{businessOwner.name}</h4>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] block truncate">{businessOwner.email}</span>
                  </div>
                </div>

                {businessProfile ? (
                  <div className="space-y-3 bg-[#FAF8F3] p-3.5 rounded border border-[#D8D2C4] leading-relaxed">
                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Business Name</span>
                      <span className="font-bold text-[#1B2430]">{businessProfile.businessName || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Category/Type</span>
                      <span>{businessProfile.businessType || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">HQ Address Location</span>
                      <p className="text-xs text-[#6B6459] truncate">{businessProfile.address || "Not provided"}</p>
                    </div>
                    <div className="pt-2.5 border-t border-[#D8D2C4]/60 flex flex-col gap-1.5 font-semibold">
                      {businessProfile.socialLinks?.website && (
                        <a href={businessProfile.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faGlobe} className="text-[10px]" />
                          <span>Website</span>
                        </a>
                      )}
                      {businessProfile.socialLinks?.linkedin && (
                        <a href={businessProfile.socialLinks.linkedin.startsWith("http") ? businessProfile.socialLinks.linkedin : `https://linkedin.com/company/${businessProfile.socialLinks.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                          <FontAwesomeIcon icon={faLinkedin} className="text-[10px]" />
                          <span>LinkedIn company</span>
                        </a>
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

          {/* Application Details Card */}
          <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[4px_4px_0px_#1B2430] space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-md text-[#1B2430] pb-2 border-b border-[#D8D2C4] flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardList} className="text-xs text-[#0F6B5C]" />
              <span>Application Proposal</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">Status:</span>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-[3px] border uppercase tracking-wider ${getApplicationStatusStyle(application.status)}`}>
                  {application.status}
                </span>
              </div>
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Proposal Submission Date</span>
                <span>{formatDate(createdAt)}</span>
              </div>
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Cover Letter Summary</span>
                <p className="text-xs text-[#6B6459] line-clamp-3 leading-relaxed bg-[#FAF8F3] p-2.5 rounded border border-[#D8D2C4]/60 mt-1">{application.coverLetter || "Not provided"}</p>
              </div>

              <div className="pt-3 border-t border-[#D8D2C4]/60 text-right">
                <Link
                  to={`/admin/applications/${application._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#1B2430] hover:text-white border border-[#D8D2C4] rounded-[4px] text-xs font-semibold text-[#1B2430] transition-colors cursor-pointer"
                >
                  <span>View Application</span>
                  <FontAwesomeIcon icon={faArrowLeft} className="rotate-180 text-[10px]" />
                </Link>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default AdminSubmissionDetails;
