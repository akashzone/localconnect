import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";

const statusConfig = {
  pending: { label: "Pending", dot: "🟡", classes: "bg-[#FDF3D6] text-[#8A6D1D]" },
  accepted: { label: "Accepted", dot: "🟢", classes: "bg-[#E9F5F1] text-[#0F6B5C]" },
  rejected: { label: "Rejected", dot: "🔴", classes: "bg-[#FBE7E4] text-[#B3452F]" },
  withdrawn: { label: "Withdrawn", dot: "⚪", classes: "bg-[#EAEAEA] text-[#4A473F]" },
};

const filterTabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "withdrawn", label: "Withdrawn" },
];

function ApplicationCard({ app, onWithdraw }) {
  const status = app.status?.toLowerCase() || "pending";
  const badge = statusConfig[status] || statusConfig.pending;
  const project = app.projectId || {};

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[3px_3px_0px_#D8D2C4]">
      {/* Project details */}
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-1">
            {project.title || "Unknown Project"}
          </h3>
          {project.category && (
            <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384] uppercase tracking-wider">
              {project.category}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 font-['IBM_Plex_Mono'] text-[11px] font-medium px-3 py-1.5 rounded-[3px] whitespace-nowrap ${badge.classes}`}
        >
          {badge.dot} {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-dashed border-[#D8D2C4] py-4 mb-4">
        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            Budget
          </span>
          <span className="font-['Space_Grotesk'] font-bold text-[#0F6B5C]">
            ₹{project.budget?.toLocaleString("en-IN") ?? "—"}
          </span>
        </div>

        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            Proposed Duration
          </span>
          <span className="font-medium text-sm">{app.estimatedDuration || "—"}</span>
        </div>

        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            Applied Date
          </span>
          <span className="font-medium text-sm">
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

      {app.coverLetter && (
        <div className="mb-5">
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1.5">
            Cover Letter
          </span>
          <p className="text-[14px] text-[#4A473F] leading-relaxed">
            {app.coverLetter}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link
          to={`/projects/${project._id}`}
          className="inline-block font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                     hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
        >
          View Project Details
        </Link>

        {status === "pending" && (
          <div>
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#B3452F] text-[#B3452F]
                           hover:bg-[#B3452F] hover:text-white transition-colors duration-150"
              >
                Withdraw Application
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-['IBM_Plex_Mono'] text-[#B3452F] mr-1">Are you sure?</span>
                <button
                  onClick={() => onWithdraw(app._id)}
                  className="font-semibold text-xs px-3 py-2 rounded-[4px] bg-[#B3452F] text-white hover:bg-[#963725] transition-colors"
                >
                  Yes, Withdraw
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="font-semibold text-xs px-3 py-2 rounded-[4px] border border-[#D8D2C4] text-[#6B6459] hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.get("/applications/my");
      setApplications(res.data.data || []);
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

  const counts = applications.reduce(
    (acc, app) => {
      const status = app.status?.toLowerCase() || "pending";
      acc.all += 1;
      if (acc[status] !== undefined) acc[status] += 1;
      return acc;
    },
    { all: 0, pending: 0, accepted: 0, rejected: 0, withdrawn: 0 }
  );

  const visibleApplications = applications.filter((app) => {
    const status = app.status?.toLowerCase() || "pending";
    const matchesFilter = activeFilter === "all" || status === activeFilter;

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      app.projectId?.title?.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

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
                🔍
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
              <ApplicationCard key={app._id} app={app} onWithdraw={handleWithdraw} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;