import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFlag,
  faUser,
  faBriefcase,
  faFileSignature,
  faStar,
  faCalendarAlt,
  faShieldHalved,
  faCheckCircle,
  faBan,
  faClock
} from "@fortawesome/free-solid-svg-icons";

const AdminReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/reports/${id}`);
      if (res.data?.success) {
        setReport(res.data.data);
      } else {
        throw new Error(res.data?.message || "Failed to load report details.");
      }
    } catch (err) {
      console.error("Error fetching report details:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load report details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      setSuccessMsg("");
      const res = await api.patch(`/admin/reports/${id}/status`, { status: newStatus });
      if (res.data?.success) {
        setReport(res.data.data);
        setSuccessMsg(`Status updated to "${newStatus}" successfully.`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        throw new Error(res.data?.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || err.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePriority = async (newPriority) => {
    try {
      setUpdating(true);
      setSuccessMsg("");
      const res = await api.patch(`/admin/reports/${id}/status`, { priority: newPriority });
      if (res.data?.success) {
        setReport(res.data.data);
        setSuccessMsg(`Priority updated to "${newPriority}" successfully.`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        throw new Error(res.data?.message || "Failed to update priority.");
      }
    } catch (err) {
      console.error("Error updating priority:", err);
      alert(err.response?.data?.message || err.message || "Failed to update priority.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] animate-pulse">
          Loading report details...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-4 py-8">
        <Link
          to="/admin/reports"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F6B5C] hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Reports</span>
        </Link>
        <div className="bg-[#FBE7E4] border border-[#F5C2B8] text-[#B3452F] p-5 rounded-[6px] text-xs font-['IBM_Plex_Mono']">
          Error: {error || "Report not found"}
        </div>
      </div>
    );
  }

  const isFinalized = report.status === "Resolved" || report.status === "Dismissed";

  const getStatusLabelColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-[#8A6D1D] bg-[#FDF3D6] border-[#F5E2B3]";
      case "Under Review":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "Resolved":
        return "text-[#0F6B5C] bg-[#E9F5F1] border-[#B8E2D8]";
      case "Dismissed":
        return "text-[#4A473F] bg-[#EAEAEA] border-[#D8D2C4]";
      default:
        return "text-gray-800 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back navigation */}
      <div>
        <Link
          to="/admin/reports"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B6459] hover:text-[#1B2430] transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
          <span>Back to Reports List</span>
        </Link>
      </div>

      {/* Main Banner Block */}
      <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-sm space-y-4">
        {successMsg && (
          <div className="bg-[#E9F5F1] text-[#0F6B5C] border border-[#0F6B5C]/25 text-xs font-['IBM_Plex_Mono'] px-3.5 py-2.5 rounded-[4px] font-semibold">
            ✓ {successMsg}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-wider text-[#9B9384]">
              REPORT ID: #{report._id?.slice(-8).toUpperCase()}
            </span>
            <h1 className="font-['Space_Grotesk'] font-bold text-xl sm:text-2xl text-[#1B2430]">
              Report Details
            </h1>
            <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#6B6459] flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-3" />
              <span>Created on: {new Date(report.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}</span>
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 rounded-[3px] border text-[10.5px] font-['IBM_Plex_Mono'] font-bold ${getStatusLabelColor(report.status)}`}>
              STATUS: {report.status?.toUpperCase()}
            </span>
            <span className={`px-2.5 py-1 rounded-[3px] border text-[10.5px] font-['IBM_Plex_Mono'] font-bold ${
              report.priority === "Critical" ? "bg-[#FBE7E4] text-[#B3452F] border-[#F5C2B8]" : "bg-gray-100 text-gray-800 border-gray-200"
            }`}>
              PRIORITY: {report.priority?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Main detail columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core content (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Reason & Description card */}
          <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-sm space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-sm text-[#1B2430] uppercase tracking-wider border-b border-[#FAF8F3] pb-2">
              Report Reason & Details
            </h3>
            <div>
              <span className="inline-block text-xs font-semibold text-[#B3452F] bg-[#FBE7E4]/50 border border-[#B3452F]/25 px-2.5 py-1 rounded-[4px]">
                Reason: {report.reason}
              </span>
            </div>
            <div className="bg-[#FAF8F3] border border-[#D8D2C4]/60 rounded-[4px] p-4 font-['IBM_Plex_Sans'] text-sm text-[#4A473F] leading-relaxed whitespace-pre-wrap italic">
              "{report.description}"
            </div>
          </div>

          {/* Target details */}
          <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-sm space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-sm text-[#1B2430] uppercase tracking-wider border-b border-[#FAF8F3] pb-2">
              Reported Target Information
            </h3>

            {/* If target is User */}
            {report.reportedUserId && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B2430]">
                  <FontAwesomeIcon icon={faUser} className="text-[#0F6B5C]" />
                  <span>Reported Profile / User</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-['IBM_Plex_Sans']">
                  <div>
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Name</span>
                    <span className="font-semibold text-[#1B2430]">{report.reportedUserId?.name || "—"}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Role</span>
                    <span className="font-semibold capitalize text-[#1B2430]">{report.reportedUserId?.role || "—"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Email Address</span>
                    <span className="font-medium text-[#1B2430]">{report.reportedUserId?.email || "—"}</span>
                  </div>
                  {report.reportedUserProfile?.bio && (
                    <div className="col-span-2">
                      <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Biography</span>
                      <p className="text-[#6B6459]">{report.reportedUserProfile.bio}</p>
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <Link
                    to={`/admin/users/${report.reportedUserId?._id}`}
                    className="inline-block text-xs text-[#0F6B5C] font-semibold hover:underline"
                  >
                    View User Detail Profile Page →
                  </Link>
                </div>
              </div>
            )}

            {/* If target is Project */}
            {report.projectId && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B2430]">
                  <FontAwesomeIcon icon={faBriefcase} className="text-[#0F6B5C]" />
                  <span>Reported Project Details</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-['IBM_Plex_Sans']">
                  <div className="col-span-2">
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Project Title</span>
                    <span className="font-bold text-[#1B2430]">{report.projectId?.title || "—"}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Budget</span>
                    <span className="font-semibold text-[#0F6B5C]">₹{report.projectId?.budget?.toLocaleString("en-IN") ?? "—"}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Status</span>
                    <span className="font-semibold text-[#1B2430] capitalize">{report.projectId?.status || "—"}</span>
                  </div>
                  {report.projectId?.description && (
                    <div className="col-span-2">
                      <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Description Summary</span>
                      <p className="text-[#6B6459] truncate max-w-md">{report.projectId.description}</p>
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <Link
                    to={`/admin/projects/${report.projectId?._id}`}
                    className="inline-block text-xs text-[#0F6B5C] font-semibold hover:underline"
                  >
                    View Project Detail Page →
                  </Link>
                </div>
              </div>
            )}

            {/* If target is Application */}
            {report.applicationId && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B2430]">
                  <FontAwesomeIcon icon={faFileSignature} className="text-[#0F6B5C]" />
                  <span>Reported Project Application</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-['IBM_Plex_Sans']">
                  <div className="col-span-2">
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Target Project Title</span>
                    <span className="font-semibold text-[#1B2430]">{report.applicationId?.projectId?.title || "—"}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Proposed Duration</span>
                    <span className="font-semibold text-[#1B2430]">{report.applicationId?.estimatedDuration || "—"}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Application Status</span>
                    <span className="font-semibold text-[#1B2430] capitalize">{report.applicationId?.status || "—"}</span>
                  </div>
                  {report.applicationId?.coverLetter && (
                    <div className="col-span-2">
                      <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Application Cover Letter</span>
                      <p className="text-[#6B6459] text-xs leading-relaxed font-['IBM_Plex_Sans']">"{report.applicationId.coverLetter}"</p>
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <Link
                    to={`/admin/applications/${report.applicationId?._id}`}
                    className="inline-block text-xs text-[#0F6B5C] font-semibold hover:underline"
                  >
                    View Application Detail Page →
                  </Link>
                </div>
              </div>
            )}

            {/* If target is Review */}
            {report.reviewId && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B2430]">
                  <FontAwesomeIcon icon={faStar} className="text-[#0F6B5C]" />
                  <span>Reported Review Details</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-['IBM_Plex_Sans']">
                  <div>
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Stars Rating</span>
                    <span className="font-bold text-[#F5C445]">★ {report.reviewId?.stars || "—"} / 5</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Reviewer Role</span>
                    <span className="font-semibold text-[#1B2430] capitalize">{report.reviewId?.reviewerRole || "—"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Related Project Title</span>
                    <span className="font-medium text-[#1B2430]">{report.reviewId?.projectId?.title || "—"}</span>
                  </div>
                  {report.reviewId?.description && (
                    <div className="col-span-2">
                      <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Comment Text</span>
                      <p className="text-[#6B6459] leading-relaxed italic">"{report.reviewId.description}"</p>
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <Link
                    to={`/admin/reviews/${report.reviewId?._id}`}
                    className="inline-block text-xs text-[#0F6B5C] font-semibold hover:underline"
                  >
                    View Review Detail Page →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Actions Console (1 col) */}
        <div className="space-y-6">
          {/* Moderation Controls Panel */}
          <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-sm space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-xs text-[#1B2430] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#FAF8F3] pb-2">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[#0F6B5C]" />
              <span>Moderation Console</span>
            </h3>

            {/* Change Status Buttons */}
            <div className="space-y-2.5">
              <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-wider text-[#9B9384] font-semibold">
                Status Transitions
              </span>

              {report.status === "Pending" && (
                <button
                  onClick={() => handleUpdateStatus("Under Review")}
                  disabled={updating}
                  className="w-full font-semibold text-xs py-2 px-3 rounded bg-[#FAF8F3] text-blue-700 border border-blue-300 hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FontAwesomeIcon icon={faClock} />
                  <span>Mark Under Review</span>
                </button>
              )}

              {report.status === "Under Review" && (
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleUpdateStatus("Resolved")}
                    disabled={updating}
                    className="w-full font-semibold text-xs py-2 px-3 rounded bg-[#0F6B5C] hover:bg-[#0c574a] text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Resolve Issue</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("Dismissed")}
                    disabled={updating}
                    className="w-full font-semibold text-xs py-2 px-3 rounded bg-white border border-[#B3452F] text-[#B3452F] hover:bg-[#FBE7E4] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FontAwesomeIcon icon={faBan} />
                    <span>Dismiss Report</span>
                  </button>
                </div>
              )}

              {isFinalized && (
                <p className="text-xs text-[#9B9384] italic bg-[#FAF8F3] border border-[#D8D2C4]/40 p-2.5 rounded text-center">
                  This report has been finalized. No further status changes are permitted.
                </p>
              )}
            </div>

            {/* Set Priority Select */}
            <div className="space-y-1.5 pt-2 border-t border-[#D8D2C4]/40">
              <label className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-wider text-[#9B9384] font-semibold">
                Set Report Priority
              </label>
              <select
                value={report.priority || "Medium"}
                onChange={(e) => handleUpdatePriority(e.target.value)}
                disabled={updating || isFinalized}
                className="w-full border border-[#D8D2C4] rounded-[4px] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0F6B5C] bg-[#FAF8F3] text-[#1B2430] disabled:opacity-60 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Reporter details Card */}
          <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-sm space-y-3">
            <h3 className="font-['Space_Grotesk'] font-bold text-xs text-[#1B2430] uppercase tracking-wider border-b border-[#FAF8F3] pb-2">
              Reporter Details
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Name</span>
                <span className="font-bold text-[#1B2430]">{report.reporterId?.name || "System User"}</span>
              </div>
              <div>
                <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Role / Account Type</span>
                <span className="font-semibold capitalize text-[#1B2430]">{report.reporterId?.role || "—"}</span>
              </div>
              <div>
                <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Email Address</span>
                <span className="font-medium text-[#1B2430]">{report.reporterId?.email || "—"}</span>
              </div>
              <div className="pt-2 border-t border-[#D8D2C4]/40">
                <Link
                  to={`/admin/users/${report.reporterId?._id}`}
                  className="text-xs text-[#0F6B5C] font-semibold hover:underline"
                >
                  View Reporter Account Profile Page →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportDetails;
