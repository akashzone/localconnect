import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTriangleExclamation,
  faChevronLeft,
  faChevronRight,
  faArrowRotateRight,
  faFlag,
  faUser,
  faBriefcase,
  faFileSignature,
  faStar
} from "@fortawesome/free-solid-svg-icons";

const AdminReports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    resolved: 0,
    dismissed: 0,
    reasons: {}
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await api.get("/admin/reports/stats");
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching report stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/admin/reports?page=${page}&limit=${limit}`;
      if (debouncedSearch.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      if (priorityFilter) {
        url += `&priority=${priorityFilter}`;
      }

      const res = await api.get(url);
      if (res.data?.success) {
        setReports(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
          setTotalReports(res.data.pagination.total);
        }
      } else {
        throw new Error(res.data?.message || "Failed to fetch reports");
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load reports list. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPriorityFilter("");
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#FDF3D6] text-[#8A6D1D] border-[#F5E2B3]";
      case "Under Review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Resolved":
        return "bg-[#E9F5F1] text-[#0F6B5C] border-[#B8E2D8]";
      case "Dismissed":
        return "bg-[#EAEAEA] text-[#4A473F] border-[#D8D2C4]";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Medium":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "High":
        return "bg-[#FDF3D6] text-[#8A6D1D] border-[#F5E2B3]";
      case "Critical":
        return "bg-[#FBE7E4] text-[#B3452F] border-[#F5C2B8]";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTargetSummary = (report) => {
    if (report.reportedUserId) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-[#1B2430] font-medium">
          <FontAwesomeIcon icon={faUser} className="text-[#6B6459] w-3 text-center" />
          User: {report.reportedUserId?.name || "Unknown User"}
        </span>
      );
    }
    if (report.projectId) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-[#1B2430] font-medium">
          <FontAwesomeIcon icon={faBriefcase} className="text-[#6B6459] w-3 text-center" />
          Project: {report.projectId?.title || "Unknown Project"}
        </span>
      );
    }
    if (report.applicationId) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-[#1B2430] font-medium">
          <FontAwesomeIcon icon={faFileSignature} className="text-[#6B6459] w-3 text-center" />
          App: #{report.applicationId?._id?.slice(-6).toUpperCase()}
        </span>
      );
    }
    if (report.reviewId) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-[#1B2430] font-medium">
          <FontAwesomeIcon icon={faStar} className="text-[#6B6459] w-3 text-center" />
          Review: #{report.reviewId?._id?.slice(-6).toUpperCase()}
        </span>
      );
    }
    return <span className="text-xs text-[#9B9384]">No Target</span>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D2C4]">
        <div>
          <span className="font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-wider bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 px-2 py-0.5 rounded-[3px]">
            System Moderation
          </span>
          <h1 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-[#1B2430] mt-1.5">
            User Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6459] mt-0.5">
            Review and manage issues, scams, disputes, and inappropriate activities reported by LocalConnect users.
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            fetchReports();
          }}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF8F3] text-[#1B2430] border border-[#D8D2C4] rounded-[4px] font-['IBM_Plex_Sans'] text-xs font-semibold transition-all shadow-[2px_2px_0px_#1B2430] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowRotateRight} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Analytics Overview Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Counters */}
        <div className="lg:col-span-2 bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-sm space-y-4">
          <h3 className="font-['Space_Grotesk'] font-bold text-sm text-[#1B2430] uppercase tracking-wide">
            Reports Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-3 bg-[#FAF8F3] border border-[#D8D2C4]/60 rounded-[4px] text-center">
              <span className="block text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Total</span>
              <span className="font-['Space_Grotesk'] font-bold text-2xl text-[#1B2430] mt-1 block">
                {statsLoading ? "—" : stats.total}
              </span>
            </div>
            <div className="p-3 bg-[#FAF8F3] border border-[#D8D2C4]/60 rounded-[4px] text-center">
              <span className="block text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#8A6D1D]">Pending</span>
              <span className="font-['Space_Grotesk'] font-bold text-2xl text-[#8A6D1D] mt-1 block">
                {statsLoading ? "—" : stats.pending}
              </span>
            </div>
            <div className="p-3 bg-[#FAF8F3] border border-[#D8D2C4]/60 rounded-[4px] text-center">
              <span className="block text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-blue-600">Reviewing</span>
              <span className="font-['Space_Grotesk'] font-bold text-2xl text-blue-600 mt-1 block">
                {statsLoading ? "—" : stats.underReview}
              </span>
            </div>
            <div className="p-3 bg-[#FAF8F3] border border-[#D8D2C4]/60 rounded-[4px] text-center">
              <span className="block text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#0F6B5C]">Resolved</span>
              <span className="font-['Space_Grotesk'] font-bold text-2xl text-[#0F6B5C] mt-1 block">
                {statsLoading ? "—" : stats.resolved}
              </span>
            </div>
            <div className="p-3 bg-[#FAF8F3] border border-[#D8D2C4]/60 rounded-[4px] text-center col-span-2 sm:col-span-1">
              <span className="block text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#6B6459]">Dismissed</span>
              <span className="font-['Space_Grotesk'] font-bold text-2xl text-[#6B6459] mt-1 block">
                {statsLoading ? "—" : stats.dismissed}
              </span>
            </div>
          </div>
        </div>

        {/* Reason Distribution (Platform Level Analytics) */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-sm flex flex-col justify-between">
          <h3 className="font-['Space_Grotesk'] font-bold text-sm text-[#1B2430] uppercase tracking-wide mb-3">
            Reports By Reason
          </h3>
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[110px] pr-1">
            {statsLoading ? (
              <p className="text-xs text-[#9B9384] italic">Loading analytics...</p>
            ) : Object.keys(stats.reasons || {}).length === 0 ? (
              <p className="text-xs text-[#9B9384] italic">No data available</p>
            ) : (
              Object.entries(stats.reasons).map(([reason, count]) => (
                <div key={reason} className="flex justify-between items-center text-xs">
                  <span className="text-[#6B6459] font-medium truncate max-w-[200px]">{reason}</span>
                  <span className="font-['IBM_Plex_Mono'] font-bold text-[#1B2430] bg-[#FAF8F3] px-2 py-0.5 border border-[#D8D2C4]/40 rounded">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white border border-[#D8D2C4] rounded-[6px] shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6459]/60">
            <FontAwesomeIcon icon={faSearch} className="text-xs" />
          </span>
          <input
            type="text"
            placeholder="Search by reporter, reported target, reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#D8D2C4] rounded-[4px] font-['IBM_Plex_Sans'] text-sm focus:outline-none focus:border-[#0F6B5C] bg-[#FAF8F3] text-[#1B2430] placeholder-[#6B6459]/60"
          />
        </div>

        {/* Select Filters */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#6B6459] w-full sm:w-auto">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 border border-[#D8D2C4] rounded-[4px] bg-[#FAF8F3] text-sm text-[#1B2430] focus:outline-none focus:border-[#0F6B5C] w-full sm:w-auto cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#6B6459] w-full sm:w-auto">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 border border-[#D8D2C4] rounded-[4px] bg-[#FAF8F3] text-sm text-[#1B2430] focus:outline-none focus:border-[#0F6B5C] w-full sm:w-auto cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {(searchTerm || statusFilter || priorityFilter) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#B3452F] hover:underline font-semibold cursor-pointer w-full sm:w-auto text-left sm:text-center mt-1 sm:mt-0"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Reports Table / List */}
      <div className="bg-white border border-[#D8D2C4] rounded-[6px] overflow-hidden shadow-sm">
        {loading ? (
          <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] text-center py-16">
            Loading reports list...
          </p>
        ) : error ? (
          <p className="font-['IBM_Plex_Mono'] text-xs text-[#B3452F] text-center py-16">
            Error: {error}
          </p>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 text-[#6B6459] space-y-2">
            <FontAwesomeIcon icon={faFlag} className="text-3xl text-[#D8D2C4] mb-2" />
            <p className="font-['IBM_Plex_Mono'] text-xs font-semibold">No Reports Found</p>
            <p className="text-xs text-[#9B9384] max-w-xs mx-auto">
              No reported violations match your query or have been submitted by users yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F3] border-b border-[#D8D2C4] text-[10.5px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384] font-bold">
                    <th className="py-3.5 px-6">Reporter</th>
                    <th className="py-3.5 px-6">Reported Target</th>
                    <th className="py-3.5 px-6">Reason</th>
                    <th className="py-3.5 px-6 text-center">Priority</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6">Submitted Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D2C4]/40 font-['IBM_Plex_Sans'] text-sm text-[#1B2430]">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-[#FAF8F3]/30 transition-colors">
                      <td className="py-3.5 px-6">
                        <div>
                          <p className="font-semibold text-xs text-[#1B2430]">
                            {report.reporterId?.name || "System User"}
                          </p>
                          <p className="font-['IBM_Plex_Mono'] text-[9.5px] text-[#6B6459] mt-0.5">
                            {report.reporterId?.email || "—"} ({report.reporterId?.role || "—"})
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        {getTargetSummary(report)}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="font-semibold text-xs bg-gray-50 border border-gray-200/60 px-2 py-0.5 rounded text-[#1B2430]">
                          {report.reason}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className={`inline-block font-['IBM_Plex_Mono'] text-[9.5px] font-semibold px-2 py-0.5 rounded border ${getPriorityBadge(report.priority)}`}>
                          {report.priority || "Medium"}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className={`inline-block font-['IBM_Plex_Mono'] text-[9.5px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-[#6B6459]">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          to={`/admin/reports/${report._id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-[#1B2430] hover:bg-[#0F6B5C] text-[#FAF8F3] rounded-[4px] text-xs font-semibold transition-colors shadow-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards List View */}
            <div className="md:hidden divide-y divide-[#D8D2C4]/40 p-4 space-y-4">
              {reports.map((report) => (
                <div key={report._id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-xs text-[#1B2430]">
                        Reporter: {report.reporterId?.name || "System User"}
                      </p>
                      <p className="text-[10px] text-[#6B6459]">{report.reporterId?.email}</p>
                    </div>
                    <span className={`font-['IBM_Plex_Mono'] text-[9px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Target</span>
                      {getTargetSummary(report)}
                    </div>
                    <div>
                      <span className="block text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#9B9384]">Priority</span>
                      <span className={`inline-block font-['IBM_Plex_Mono'] text-[9px] font-semibold px-1.5 py-0.5 rounded border ${getPriorityBadge(report.priority)}`}>
                        {report.priority || "Medium"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#D8D2C4]/40">
                    <span className="font-semibold text-xs text-[#1B2430]">
                      Reason: {report.reason}
                    </span>
                    <Link
                      to={`/admin/reports/${report._id}`}
                      className="text-xs text-[#0F6B5C] font-semibold hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Panel */}
            <div className="flex items-center justify-between border-t border-[#D8D2C4] px-6 py-4 bg-[#FAF8F3]/50">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
                Showing {reports.length} of {totalReports} reports
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-full border border-[#D8D2C4] hover:bg-white text-xs font-semibold text-[#1B2430] flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#1B2430] font-bold">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-full border border-[#D8D2C4] hover:bg-white text-xs font-semibold text-[#1B2430] flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
