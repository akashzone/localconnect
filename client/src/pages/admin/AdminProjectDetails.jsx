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
  faIndianRupeeSign,
  faBriefcase,
  faClipboardList,
  faCircleInfo,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

const AdminProjectDetails = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/projects/${id}`);
      if (res.data?.success && res.data?.data) {
        setProjectData(res.data.data);
      } else {
        throw new Error(res.data?.message || "Failed to fetch project details");
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load project details. Please check the ID or try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

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

  const getStatusBadgeStyle = (status) => {
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
          <div className="h-8 w-1/2 bg-[#D8D2C4]/40 rounded" />
          <div className="h-4 w-1/4 bg-[#D8D2C4]/40 rounded" />
          <div className="h-20 bg-[#D8D2C4]/40 rounded" />
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="space-y-6">
        <Link to="/admin/projects" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F6B5C] hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Projects</span>
        </Link>
        <div className="p-8 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <FontAwesomeIcon icon={faTimesCircle} className="text-[#B3452F] text-4xl mb-3" />
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">Project Details Error</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1 max-w-md mx-auto">{error || "Project data could not be retrieved."}</p>
          <Link
            to="/admin/projects"
            className="inline-block mt-4 px-4 py-2 bg-[#1B2430] text-white rounded-[4px] text-xs font-semibold shadow-[2px_2px_0px_#0F6B5C]"
          >
            Back to Projects List
          </Link>
        </div>
      </div>
    );
  }

  const { title, description, budget, deadline, category, skillsRequired, status, createdAt, updatedAt, businessOwner, businessProfile, student, studentProfile, applications, applicationsCount } = projectData;
  const statusStyle = getStatusBadgeStyle(status);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#FAF8F3] text-xs font-semibold text-[#1B2430] border border-[#D8D2C4] rounded-[4px] transition-colors shadow-[2px_2px_0px_#1B2430]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Core Project Card */}
      <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-[#D8D2C4]/60">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 rounded-[3px] uppercase tracking-wider">
              {category || "Uncategorized"}
            </span>
            <h2 className="font-['Space_Grotesk'] font-bold text-xl sm:text-2xl text-[#1B2430] mt-1.5">
              {title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B6459] mt-2">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="text-[11px]" />
                <span>Posted: {formatDate(createdAt)}</span>
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="text-[11px]" />
                <span>Last updated: {formatDate(updatedAt)}</span>
              </span>
            </div>
          </div>

          <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-[3px] border uppercase tracking-wider text-[10.5px] ${statusStyle}`}>
            {status}
          </span>
        </div>

        {/* Budget & Deadline Subcard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F3] p-4 rounded border border-[#D8D2C4]">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Budget</span>
            <p className="font-['Space_Grotesk'] font-bold text-xl text-[#0F6B5C] mt-1">
              {formatBudget(budget)}
            </p>
          </div>
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Deadline</span>
            <p className="font-['Space_Grotesk'] font-bold text-md text-[#1B2430] mt-1.5 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendar} className="text-xs text-[#6B6459]" />
              <span>{formatDate(deadline).split(" at")[0]}</span>
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Description</span>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#1B2430] whitespace-pre-line leading-relaxed bg-[#FAF8F3] p-3.5 rounded border border-[#D8D2C4]">
            {description}
          </p>
        </div>

        {/* Skills Required */}
        <div className="space-y-1.5">
          <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Skills Required</span>
          <div className="flex flex-wrap gap-1.5 bg-[#FAF8F3] p-3 rounded border border-[#D8D2C4]">
            {skillsRequired && skillsRequired.length > 0 ? (
              skillsRequired.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-['IBM_Plex_Mono'] font-medium bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 rounded-[3px]"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#6B6459] italic">None specified</span>
            )}
          </div>
        </div>
      </section>

      {/* Stakeholders Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Owner Stakeholder */}
        <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] space-y-4">
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] pb-2 border-b border-[#D8D2C4] flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} className="text-xs text-[#0F6B5C]" />
            <span>Business Client</span>
          </h3>

          {businessOwner ? (
            <div className="space-y-4 text-sm font-['IBM_Plex_Sans'] text-[#1B2430]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center border-2 border-[#F5C445] shrink-0">
                  {businessOwner.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-[#1B2430]">{businessOwner.name}</h4>
                  <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] block">{businessOwner.email}</span>
                </div>
              </div>

              {businessProfile ? (
                <div className="space-y-3.5 bg-[#FAF8F3] p-4 rounded border border-[#D8D2C4]">
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Business Name</span>
                    <span className="font-semibold block">{businessProfile.businessName || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Category/Type</span>
                    <span>{businessProfile.businessType || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Contact Phone</span>
                    <span>{businessProfile.phone || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Location Address</span>
                    <span>{businessProfile.address || "Not provided"}</span>
                  </div>
                  <div className="pt-2 border-t border-[#D8D2C4]/60 flex flex-wrap gap-x-4 gap-y-2">
                    {businessProfile.socialLinks?.website && (
                      <a href={businessProfile.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#0F6B5C] hover:underline font-semibold">
                        <FontAwesomeIcon icon={faGlobe} className="text-[10px]" />
                        <span>Website</span>
                      </a>
                    )}
                    {businessProfile.socialLinks?.linkedin && (
                      <a href={businessProfile.socialLinks.linkedin.startsWith("http") ? businessProfile.socialLinks.linkedin : `https://linkedin.com/company/${businessProfile.socialLinks.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#0F6B5C] hover:underline font-semibold">
                        <FontAwesomeIcon icon={faLinkedin} className="text-[10px]" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#6B6459] italic p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4]">No business profile details created yet.</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#6B6459] italic">Owner client details are missing.</p>
          )}
        </section>

        {/* Selected Developer Student */}
        <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] space-y-4">
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] pb-2 border-b border-[#D8D2C4] flex items-center gap-2">
            <FontAwesomeIcon icon={faUserGraduate} className="text-xs text-[#0F6B5C]" />
            <span>Assigned Developer</span>
          </h3>

          {student ? (
            <div className="space-y-4 text-sm font-['IBM_Plex_Sans'] text-[#1B2430]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center border-2 border-[#F5C445] shrink-0">
                  {student.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-[#1B2430]">{student.name}</h4>
                  <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] block">{student.email}</span>
                </div>
              </div>

              {studentProfile ? (
                <div className="space-y-3.5 bg-[#FAF8F3] p-4 rounded border border-[#D8D2C4]">
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Developer Bio</span>
                    <p className="text-xs text-[#6B6459] mt-0.5 line-clamp-3 leading-relaxed">{studentProfile.bio || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Skills</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {studentProfile.skills && studentProfile.skills.length > 0 ? (
                        studentProfile.skills.slice(0, 4).map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 text-[10px] font-['IBM_Plex_Mono'] font-medium bg-[#0F6B5C]/15 text-[#0F6B5C] rounded-[2px]">{s}</span>
                        ))
                      ) : (
                        <span className="text-xs text-[#6B6459] italic">Not provided</span>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#D8D2C4]/60 flex flex-wrap gap-x-4 gap-y-2">
                    {studentProfile.portfolio && (
                      <a href={studentProfile.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#0F6B5C] hover:underline font-semibold">
                        <FontAwesomeIcon icon={faGlobe} className="text-[10px]" />
                        <span>Portfolio</span>
                      </a>
                    )}
                    {studentProfile.github && (
                      <a href={studentProfile.github.startsWith("http") ? studentProfile.github : `https://github.com/${studentProfile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#0F6B5C] hover:underline font-semibold">
                        <FontAwesomeIcon icon={faGithub} className="text-[10px]" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {studentProfile.linkedIn && (
                      <a href={studentProfile.linkedIn.startsWith("http") ? studentProfile.linkedIn : `https://linkedin.com/in/${studentProfile.linkedIn}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#0F6B5C] hover:underline font-semibold">
                        <FontAwesomeIcon icon={faLinkedin} className="text-[10px]" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#6B6459] italic p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4]">No student profile details available.</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#6B6459] italic p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4] text-center">
              No developer assigned. The project status is currently <span className="font-semibold">{status}</span>.
            </p>
          )}
        </section>
      </div>

      {/* Applications Section */}
      <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#D8D2C4]">
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] flex items-center gap-2">
            <FontAwesomeIcon icon={faClipboardList} className="text-xs text-[#0F6B5C]" />
            <span>Developer Applications</span>
          </h3>
          <span className="font-['IBM_Plex_Mono'] text-xs font-semibold bg-[#FAF8F3] border border-[#D8D2C4] text-[#1B2430] px-2 py-0.5 rounded-[3px]">
            {applicationsCount} Total Applications
          </span>
        </div>

        {applications && applications.length > 0 ? (
          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 no-scrollbar">
            {applications.map((app) => {
              const appStatusStyle = getApplicationStatusStyle(app.status);
              return (
                <div key={app._id} className="border border-[#D8D2C4] rounded-[4px] p-4 space-y-3 hover:bg-[#FAF8F3]/40 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-[#D8D2C4]/40">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-[10px] flex items-center justify-center border border-[#F5C445]">
                        {app.studentId?.name?.charAt(0).toUpperCase() || "S"}
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-[#1B2430]">{app.studentId?.name || "Student"}</span>
                        <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#6B6459] ml-2">({app.studentId?.email})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#6B6459] font-['IBM_Plex_Mono']">
                        Applied: {formatDate(app.createdAt).split(" at")[0]}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-[3px] border uppercase tracking-wider ${appStatusStyle}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-['IBM_Plex_Sans'] text-[#1B2430]">
                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider font-semibold block">Estimated Duration</span>
                      <span className="font-medium">{app.estimatedDuration || "Not provided"}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider font-semibold block">Cover Letter Proposal</span>
                      <p className="p-2.5 bg-[#FAF8F3] rounded border border-[#D8D2C4]/80 text-[#6B6459] whitespace-pre-line leading-relaxed mt-1">
                        {app.coverLetter || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#6B6459] italic p-6 bg-[#FAF8F3] rounded border border-[#D8D2C4] text-center">
            No developer has applied for this project yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default AdminProjectDetails;
