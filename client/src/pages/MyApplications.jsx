import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

const statusConfig = {
  pending: {
    label: "Pending",
    dot: "🟡",
    classes: "bg-[#FDF3D6] text-[#8A6D1D]",
    message: "Waiting for the business owner to review your application.",
    messageClasses: "bg-[#FDF3D6] text-[#8A6D1D]",
  },
  accepted: {
    label: "Accepted",
    dot: "🟢",
    classes: "bg-[#E9F5F1] text-[#0F6B5C]",
    message: "Congratulations! Your application has been accepted.",
    messageClasses: "bg-[#E9F5F1] text-[#0F6B5C]",
  },
  rejected: {
    label: "Rejected",
    dot: "🔴",
    classes: "bg-[#FBE7E4] text-[#B3452F]",
    message: "Your application was not selected.",
    messageClasses: "bg-[#FBE7E4] text-[#B3452F]",
  },
  withdrawn: {
    label: "Withdrawn",
    dot: "⚪",
    classes: "bg-[#EAEAEA] text-[#4A473F]",
    message: "You withdrew this application.",
    messageClasses: "bg-[#EAEAEA] text-[#4A473F]",
  },
};

const filterTabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "withdrawn", label: "Withdrawn" },
];

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function ApplicationCard({ app, onWithdraw }) {
  const [expanded, setExpanded] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const status = app.status?.toLowerCase() || "pending";
  const badge = statusConfig[status] || statusConfig.pending;
  const project = app.projectId || {};

  const coverLetter = app.coverLetter || "";
  const isLong = coverLetter.length > 160;
  const preview = isLong && !expanded ? coverLetter.slice(0, 160).trim() + "…" : coverLetter;

  const handleWithdraw = async () => {
    if (!window.confirm("Withdraw this application? This can't be undone.")) return;
    setWithdrawing(true);
    await onWithdraw(app._id);
    setWithdrawing(false);
  };

  return (
    <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[3px_3px_0px_#D8D2C4]">

      {/* Top: title + status */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-2">
            {project.title || "Untitled project"}
          </h3>
          <span className="inline-block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wide px-2 py-1 border border-[#D8D2C4] rounded-[3px] text-[#4A473F]">
            {project.category || "General"}
          </span>
        </div>

        <span
          className={`shrink-0 font-['IBM_Plex_Mono'] text-[11px] font-medium px-3 py-1.5 rounded-[3px] whitespace-nowrap ${badge.classes}`}
        >
          {badge.dot} {badge.label}
        </span>
      </div>

      {/* Status message */}
      <div className={`font-['IBM_Plex_Sans'] text-[13.5px] font-medium px-4 py-2.5 rounded-[4px] mb-4 ${badge.messageClasses}`}>
        {badge.message}
      </div>

      {/* Project info row */}
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
            Deadline
          </span>
          <span className="font-medium text-sm">{formatDate(project.deadline)}</span>
        </div>

        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            Your Estimated Duration
          </span>
          <span className="font-medium text-sm">{app.estimatedDuration || "—"}</span>
        </div>
      </div>

      {/* Cover letter */}
      {coverLetter && (
        <div className="mb-4">
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1.5">
            Cover Letter
          </span>
          <p className="text-[14px] text-[#4A473F] leading-relaxed">
            {preview}
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-1.5 font-['IBM_Plex_Mono'] text-[12px] text-[#0F6B5C] hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </div>
      )}

      {/* Applied on */}
      <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384] mb-5">
        Applied on {formatDate(app.createdAt)}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-1">
        <Link
          to={`/projects/${project._id}`}
          className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                     hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
        >
          View Project
        </Link>

        {status === "pending" && (
          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#B3452F] text-[#B3452F]
                       hover:bg-[#B3452F] hover:text-white transition-colors duration-150 disabled:opacity-50"
          >
            {withdrawing ? "Withdrawing..." : "Withdraw"}
          </button>
        )}

        {status === "accepted" && (
          <Link
            to={`/assigned-projects/${project._id}`}
            className="font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                       shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-150"
          >
            Go to Assigned Project
          </Link>
        )}
      </div>
    </div>
  );
}

function MyApplications() {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get("/applications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.data || []);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchApplications();
  }, [token]);

  const handleWithdraw = async (applicationId) => {
    try {
      await api.delete(`/applications/${applicationId}/withdraw`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Counts per status, computed off the full list (independent of search/filter)
  const counts = applications.reduce(
    (acc, app) => {
      const status = app.status?.toLowerCase() || "pending";
      acc.all += 1;
      if (acc[status] !== undefined) acc[status] += 1;
      return acc;
    },
    { all: 0, pending: 0, accepted: 0, rejected: 0, withdrawn: 0 }
  );

  // Apply filter + search together
  const visibleApplications = applications.filter((app) => {
    const status = app.status?.toLowerCase() || "pending";
    const matchesFilter = activeFilter === "all" || status === activeFilter;

    const title = app.projectId?.title || "";
    const matchesSearch = title.toLowerCase().includes(searchTerm.trim().toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
          Your history
        </span>
        <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-6">
          My Applications
        </h1>

        {/* Filter bar */}
        {!loading && !error && applications.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`font-['IBM_Plex_Mono'] text-[12px] px-3.5 py-2 rounded-[4px] border transition-colors duration-150 ${
                    activeFilter === tab.key
                      ? "bg-[#1B2430] border-[#1B2430] text-[#FAF8F3]"
                      : "border-[#D8D2C4] text-[#6B6459] hover:border-[#1B2430] hover:text-[#1B2430]"
                  }`}
                >
                  {tab.label} ({counts[tab.key]})
                </button>
              ))}
            </div>

            {/* Search bar */}
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

        {/* True empty state — no applications at all */}
        {!loading && !error && applications.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-[#D8D2C4] rounded-[6px]">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] mb-6">
              You haven't applied to any projects yet.
            </p>
            <Link
              to="/projects"
              className="font-semibold text-sm px-6 py-3 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
            >
              Browse Projects
            </Link>
          </div>
        )}

        {/* No results for current filter/search */}
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