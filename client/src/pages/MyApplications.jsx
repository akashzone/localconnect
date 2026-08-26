import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import api from "../api/api.js";
import SubmitWorkModal from "../components/application/SubmitWorkModal";
import ReviewModal from "../components/review/ReviewModal";

const statusConfig = {
  pending: { label: "Pending", dot: "🟡", classes: "bg-[#FDF3D6] text-[#8A6D1D] border-[#F5E2B3]" },
  accepted: { label: "Accepted", dot: "🟢", classes: "bg-[#E9F5F1] text-[#0F6B5C] border-[#B8E2D8]" },
  rejected: { label: "Rejected", dot: "🔴", classes: "bg-[#FBE7E4] text-[#B3452F] border-[#F5C2B8]" },
  withdrawn: { label: "Withdrawn", dot: "⚪", classes: "bg-[#EAEAEA] text-[#4A473F] border-[#D8D2C4]" },
};

const filterTabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "withdrawn", label: "Withdrawn" },
];

function ApplicationCard({ app, onWithdraw, onSubmitWork, reviewedProjectIds, onReviewSuccess }) {
  const status = app.status?.toLowerCase() || "pending";
  const badge = statusConfig[status] || statusConfig.pending;
  const project = app.projectId || {};
  const businessName = project.businessProfile?.businessName || project.businessOwnerId?.name || "Local Business";
  const businessType = project.businessProfile?.businessType || "";

  const latestChangeRequest = app.changeRequests && app.changeRequests.length > 0
    ? app.changeRequests[app.changeRequests.length - 1]
    : null;

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleSubmitWork = async ({ workLink, remarks }) => {
    try {
      setSubmitting(true);
      await onSubmitWork(app._id, { workLink, remarks });
      setShowSubmitModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit work.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* 1. Project Title, 2. Business info, 3. Status */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] leading-snug">
              {project.title || "Project Application"}
            </h3>
            {project.category && (
              <span className="font-['IBM_Plex_Mono'] text-[10.5px] text-[#9B9384] uppercase tracking-wider bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#D8D2C4]/60">
                {project.category}
              </span>
            )}
          </div>

          <div className="space-y-0.5 mb-3">
            <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
              Business: <span className="text-[#1B2430] font-semibold">{businessName}</span>
            </p>
            {businessType && (
              <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
                Business Type: <span className="text-[#1B2430] font-medium">{businessType}</span>
              </p>
            )}
          </div>

          <div className="pt-0.5">
            <span
              className={`inline-flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[11px] font-medium px-2.5 py-1 rounded-[4px] border ${badge.classes}`}
            >
              <span className="text-[10px]">{badge.dot}</span>
              <span>{badge.label}</span>
            </span>
          </div>
        </div>

        {/* Budget / Duration / Applied Date */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-dashed border-[#D8D2C4] py-3.5 mb-4">
          <div>
            <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5">
              Budget
            </span>
            <span className="font-['Space_Grotesk'] font-bold text-[#0F6B5C] text-[15px]">
              ₹{project.budget?.toLocaleString("en-IN") ?? "—"}
            </span>
          </div>

          <div>
            <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5">
              Proposed Duration
            </span>
            <span className="font-semibold text-xs text-[#1B2430]">{app.estimatedDuration || "—"}</span>
          </div>

          <div>
            <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5">
              Applied Date
            </span>
            <span className="font-semibold text-xs text-[#1B2430]">
              {app.createdAt
                ? new Date(app.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "—"}
            </span>
          </div>
        </div>

        {/* Cover Letter */}
        {app.coverLetter && (
          <div className="mb-4">
            <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-1 font-semibold">
              Cover Letter
            </span>
            <p className="text-[13.5px] text-[#4A473F] leading-relaxed">
              {app.coverLetter}
            </p>
          </div>
        )}

        {/* Submitted Work */}
        {app.workSubmission?.workLink && (
          <div className="mb-4 bg-[#FAF8F3] border border-[#D8D2C4] rounded-[6px] p-4 shadow-sm">
            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#0F6B5C] mb-1.5 font-bold">
              Submitted Work
            </span>
            <p className="text-[13.5px] text-[#0F6B5C] font-semibold mb-2 flex items-center gap-1.5">
              <span>🔗</span>
              <a
                href={app.workSubmission.workLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline break-all"
              >
                {app.workSubmission.workLink}
              </a>
            </p>
            {app.workSubmission.remarks && (
              <div className="text-[13px] text-[#6B6459] bg-white border border-[#E8E2D5] px-3 py-2 rounded font-medium leading-relaxed">
                <span className="text-[#9B9384] font-['IBM_Plex_Mono'] text-[9px] uppercase block tracking-wider mb-0.5">Developer Remarks</span>
                {app.workSubmission.remarks}
              </div>
            )}
            <span className="block text-[10.5px] text-[#9B9384] mt-2 font-['IBM_Plex_Mono']">
              Submitted on {new Date(app.workSubmission.submittedAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>
        )}

        {/* Changes Requested Notification */}
        {latestChangeRequest && latestChangeRequest.status === "Pending" && (
          <div className="mb-4 bg-[#FBE7E4] border border-[#B3452F]/25 rounded-[6px] p-4 text-left shadow-sm">
            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#B3452F] mb-1.5 font-bold">
              Changes Requested
            </span>
            <p className="text-[13.5px] text-[#4A473F] leading-relaxed mb-2.5">
              The Business Owner has requested changes to your submitted work:
            </p>
            <div className="text-[13px] text-[#B3452F] bg-white border border-[#B3452F]/15 px-3 py-2 rounded font-medium leading-relaxed mb-2">
              "{latestChangeRequest.message}"
            </div>
            <span className="block text-[10.5px] text-[#9B9384] font-['IBM_Plex_Mono']">
              Requested on {new Date(latestChangeRequest.requestedAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons: Primary (Submit Work), Secondary (Open Chat), Tertiary (View Project) */}
      <div className="pt-3 border-t border-[#D8D2C4]/50 mt-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Action */}
          {status === "accepted" && project.status?.toLowerCase() === "in progress" && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className={`inline-flex items-center justify-center font-semibold text-sm px-4 py-2 rounded-[4px] text-white transition-colors duration-150 shadow-sm cursor-pointer ${
                latestChangeRequest && latestChangeRequest.status === "Pending"
                  ? "bg-[#B3452F] hover:bg-[#963725]"
                  : "bg-[#0F6B5C] hover:bg-[#0C564A]"
              }`}
            >
              {latestChangeRequest && latestChangeRequest.status === "Pending" 
                ? "Edit & Resubmit Work" 
                : "Submit Work"}
            </button>
          )}

          {/* Secondary Action: Open Chat */}
          {status === "accepted" && (
            <Link
              to={`/chat/${app._id}`}
              className="inline-flex items-center justify-center font-medium text-sm px-4 py-2 rounded-[4px] bg-transparent text-[#0F6B5C] border border-[#0F6B5C] hover:bg-[#E9F5F1] transition-colors duration-150"
            >
              Open Chat
            </Link>
          )}

          {/* Tertiary Action: View Project */}
          <Link
            to={`/projects/${project._id}`}
            className="inline-flex items-center justify-center font-medium text-sm px-3.5 py-2 rounded-[4px] bg-white text-[#4A473F] border border-[#D8D2C4] hover:text-[#1B2430] hover:border-[#9B9384] hover:bg-[#FAF8F3] transition-colors duration-150"
          >
            View Project
          </Link>

          {/* Status notices & review button for completed/under review */}
          {status === "accepted" && project.status?.toLowerCase() === "under review" && (
            <span className="font-['IBM_Plex_Mono'] text-xs font-semibold text-[#0F6B5C] bg-[#E9F5F1] px-3 py-1.5 rounded border border-[#0F6B5C]/15 inline-flex items-center gap-1.5">
              🟡 Under Review
            </span>
          )}

          {status === "accepted" && project.status?.toLowerCase() === "completed" && (
            <div className="flex items-center gap-2">
              <span className="font-['IBM_Plex_Mono'] text-xs font-semibold text-[#0F6B5C] bg-[#E9F5F1] px-3 py-1.5 rounded border border-[#0F6B5C]/15 inline-flex items-center gap-1.5">
                🟢 Completed
              </span>
              {reviewedProjectIds.has(project._id) ? (
                <span className="font-['IBM_Plex_Mono'] text-xs font-semibold text-[#0F6B5C] bg-[#E9F5F1] px-2.5 py-1.5 rounded border border-[#0F6B5C]/15">
                  ✓ Reviewed
                </span>
              ) : (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="font-medium text-xs px-3 py-1.5 rounded-[4px] bg-[#0F6B5C] text-white hover:bg-[#0C564A] transition-colors duration-150 cursor-pointer shadow-sm"
                >
                  Review Business
                </button>
              )}
            </div>
          )}

          {/* Withdraw Application for Pending status */}
          {status === "pending" && (
            <div className="ml-auto">
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="font-medium text-xs px-3 py-1.5 rounded-[4px] border border-[#B3452F] text-[#B3452F] hover:bg-[#FBE7E4] transition-colors duration-150 cursor-pointer"
                >
                  Withdraw Application
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-['IBM_Plex_Mono'] text-[#B3452F]">Are you sure?</span>
                  <button
                    onClick={() => onWithdraw(app._id)}
                    className="font-medium text-xs px-2.5 py-1 rounded-[4px] bg-[#B3452F] text-white hover:bg-[#963725] transition-colors"
                  >
                    Yes, Withdraw
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="font-medium text-xs px-2.5 py-1 rounded-[4px] border border-[#D8D2C4] text-[#6B6459] hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showSubmitModal && (
        <SubmitWorkModal
          mode={latestChangeRequest && latestChangeRequest.status === "Pending" ? "edit" : "submit"}
          feedback={latestChangeRequest && latestChangeRequest.status === "Pending" ? latestChangeRequest.message : ""}
          initialLink={app.workSubmission?.workLink || ""}
          initialRemarks={app.workSubmission?.remarks || ""}
          onConfirm={handleSubmitWork}
          onCancel={() => setShowSubmitModal(false)}
          submitting={submitting}
        />
      )}
      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => onReviewSuccess(project._id)}
          targetName={project.businessProfile?.businessName || "Business Owner"}
          projectName={project.title || "Software Project"}
          businessOwnerId={project.businessOwnerId?._id || project.businessOwnerId}
          projectId={project._id}
          reviewerRole="student"
        />
      )}
    </div>
  );
}

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewedProjectIds, setReviewedProjectIds] = useState(new Set());

  useEffect(() => {
    const fetchWrittenReviews = async () => {
      try {
        const res = await api.get("/review/written");
        const ids = res.data.reviews.map((r) => r.projectId);
        setReviewedProjectIds(new Set(ids));
      } catch (err) {
        console.error("Failed to fetch written reviews:", err);
      }
    };

    fetchWrittenReviews();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.get("/applications/my");
      const validApps = (res.data.data || []).filter(app => app.projectId);
      setApplications(validApps);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    try {
      await api.delete(`/applications/${applicationId}/withdraw`);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: "Withdrawn" } : app
        )
      );
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to withdraw application");
    }
  };

  const handleSubmitWork = async (applicationId, { workLink, remarks }) => {
    const res = await api.put(`/applications/${applicationId}/submit-work`, { workLink, remarks });
    setApplications((prev) =>
      prev.map((app) =>
        app._id === applicationId ? res.data.data : app
      )
    );
  };

  const counts = applications.reduce(
    (acc, app) => {
      const status = app.status?.toLowerCase() || "pending";
      acc.all += 1;
      if (acc[status] !== undefined) acc[status] += 1;
      return acc;
    },
    { all: 0, pending: 0, accepted: 0, rejected: 0, withdrawn: 0 }
  );

  const visibleApplications = applications
    .filter((app) => {
      const status = app.status?.toLowerCase() || "pending";
      const matchesFilter = activeFilter === "all" || status === activeFilter;

      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        app.projectId?.title?.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
          Your Project Applications
        </span>
        <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-6">
          My Applications
        </h1>

        {!loading && !error && applications.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`font-['IBM_Plex_Mono'] text-[12px] px-3.5 py-2 rounded-[4px] border transition-colors duration-150 ${activeFilter === tab.key
                    ? "bg-[#1B2430] border-[#1B2430] text-[#FAF8F3]"
                    : "border-[#D8D2C4] text-[#6B6459] hover:border-[#1B2430] hover:text-[#1B2430]"
                    }`}
                >
                  {tab.label} ({counts[tab.key]})
                </button>
              ))}
            </div>

            <div className="relative mb-10">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B9384] text-sm pointer-events-none">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by project title..."
                className="w-full border border-[#D8D2C4] rounded-[4px] pl-10 pr-3.5 py-2.5 text-[14.5px]
                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                           transition-colors"
              />
            </div>
          </>
        )}

        {loading && (
          <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] text-center py-16">
            Loading applications...
          </p>
        )}

        {!loading && error && (
          <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F] text-center py-16">
            Failed to fetch applications.
          </p>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-[#D8D2C4] rounded-[6px]">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] mb-1">
              You haven't applied to any projects yet.
            </p>
            <Link
              to="/projects"
              className="mt-4 inline-block font-semibold text-sm px-5 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[4px_4px_0px_#F5C445] hover:shadow-[2px_2px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
            >
              Browse Projects
            </Link>
          </div>
        )}

        {!loading && !error && applications.length > 0 && visibleApplications.length === 0 && (
          <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] text-center py-16">
            No applications match your filters.
          </p>
        )}

        {!loading && !error && visibleApplications.length > 0 && (
          <div className="space-y-5">
            {visibleApplications.map((app) => (
              <ApplicationCard
                key={app._id}
                app={app}
                onWithdraw={handleWithdraw}
                onSubmitWork={handleSubmitWork}
                reviewedProjectIds={reviewedProjectIds}
                onReviewSuccess={(projId) => {
                  setReviewedProjectIds((prev) => {
                    const next = new Set(prev);
                    next.add(projId);
                    return next;
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;