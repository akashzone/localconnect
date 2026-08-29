import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFileCode,
  faBuilding,
  faUserGraduate,
  faCircleCheck,
  faClock,
  faTriangleExclamation,
  faChevronLeft,
  faChevronRight,
  faArrowRotateRight,
  faCalendarDays
} from "@fortawesome/free-solid-svg-icons";

const AdminSubmissions = () => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/admin/submissions?page=${page}&limit=${limit}`;
      if (debouncedSearch.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }

      const res = await api.get(url);
      if (res.data?.success) {
        setSubmissions(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
          setTotalSubmissions(res.data.pagination.total);
        }
      } else {
        throw new Error(res.data?.message || "Failed to fetch submissions");
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load submissions list. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setPage(1);
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

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D2C4]">
        <div>
          <span className="font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-wider bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 px-2 py-0.5 rounded-[3px]">
            System Portal
          </span>
          <h1 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-[#1B2430] mt-1.5">
            Work Submissions
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6459] mt-0.5">
            Monitor and inspect student deliverables, source code repositories, and demo urls submitted for completed review.
          </p>
        </div>

        <button
          onClick={fetchSubmissions}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF8F3] text-[#1B2430] border border-[#D8D2C4] rounded-[4px] font-['IBM_Plex_Sans'] text-xs font-semibold transition-all shadow-[2px_2px_0px_#1B2430] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowRotateRight} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Input Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border border-[#D8D2C4] rounded-[6px] shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6459]/60">
            <FontAwesomeIcon icon={faSearch} className="text-xs" />
          </span>
          <input
            type="text"
            placeholder="Search by student, project title, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#D8D2C4] rounded-[4px] font-['IBM_Plex_Sans'] text-sm focus:outline-none focus:border-[#0F6B5C] bg-[#FAF8F3] text-[#1B2430] placeholder-[#6B6459]/60"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading && submissions.length === 0 ? (
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430] overflow-hidden">
          <div className="h-12 bg-[#FAF8F3] border-b border-[#D8D2C4]" />
          <div className="p-4 space-y-3.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between py-2 border-b border-[#D8D2C4]/30">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-[#D8D2C4]/40 animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-[#D8D2C4]/40 animate-pulse rounded" />
                </div>
                <div className="h-6 w-20 bg-[#D8D2C4]/40 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-[#B3452F] text-3xl mb-3" />
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">Unable to load submissions</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="mt-4 px-4 py-2 bg-[#1B2430] text-white rounded-[4px] text-xs font-semibold hover:bg-[#1B2430]/90 shadow-[2px_2px_0px_#0F6B5C] active:translate-y-[1px] cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <FontAwesomeIcon icon={faFileCode} className="text-[#6B6459]/40 text-4xl mb-3" />
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">No submissions found</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1">
            There are no student submissions matching search criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 border border-[#D8D2C4] text-[#1B2430] rounded-[4px] text-xs font-semibold hover:bg-[#FAF8F3] transition-all cursor-pointer"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#D8D2C4] text-[10px] sm:text-xs font-['IBM_Plex_Mono'] text-[#6B6459] uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Student Developer</th>
                  <th className="px-6 py-4 font-semibold">Project Title</th>
                  <th className="px-6 py-4 font-semibold">Business Client</th>
                  <th className="px-6 py-4 font-semibold">Submitted Date</th>
                  <th className="px-6 py-4 font-semibold">Project Review Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D2C4]/60 font-['IBM_Plex_Sans'] text-sm text-[#1B2430]">
                {submissions.map((item) => {
                  const studentName = item.studentId?.name || "Not provided";
                  const studentEmail = item.studentId?.email || "—";
                  const projectTitle = item.projectId?.title || "Not provided";
                  const clientName = item.projectId?.businessProfile?.businessName || item.projectId?.businessOwner?.name || "Not provided";
                  const reviewStatus = item.projectId?.status || "—";
                  const submittedDate = item.workSubmission?.submittedAt || item.updatedAt;

                  return (
                    <tr key={item._id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                      {/* Student Developer */}
                      <td className="px-6 py-4 font-medium max-w-[200px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center border border-[#F5C445] shrink-0">
                            {studentName.charAt(0).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-[#1B2430] block">{studentName}</span>
                            <span className="text-[10px] font-['IBM_Plex_Mono'] text-[#6B6459] block mt-0.5">{studentEmail}</span>
                          </div>
                        </div>
                      </td>

                      {/* Project Title */}
                      <td className="px-6 py-4 truncate max-w-[200px]">
                        <span className="font-medium text-[#1B2430] block truncate" title={projectTitle}>
                          {projectTitle}
                        </span>
                      </td>

                      {/* Business Client */}
                      <td className="px-6 py-4 truncate max-w-[160px]">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faBuilding} className="text-[#6B6459] text-xs" />
                          <span className="text-[#1B2430] font-medium">{clientName}</span>
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="px-6 py-4 text-xs text-[#6B6459] whitespace-nowrap">
                        {formatDate(submittedDate)}
                      </td>

                      {/* Project Review Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-[3px] border uppercase tracking-wider text-[9.5px] ${getProjectStatusStyle(reviewStatus)}`}>
                          {reviewStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/submissions/${item._id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#1B2430] hover:text-white border border-[#D8D2C4] rounded-[4px] text-xs font-semibold text-[#1B2430] transition-colors cursor-pointer"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-[#FAF8F3] border-t border-[#D8D2C4] flex items-center justify-between flex-wrap gap-4">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
                Showing page <strong className="text-[#1B2430]">{page}</strong> of <strong className="text-[#1B2430]">{totalPages}</strong> ({totalSubmissions} total submissions)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 border border-[#D8D2C4] rounded-[4px] hover:bg-[#1B2430] hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit cursor-pointer"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-xs px-0.5" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-7 h-7 flex items-center justify-center border text-xs font-medium rounded-[4px] transition-all cursor-pointer ${
                        page === pNum
                          ? "bg-[#0F6B5C] border-[#0F6B5C] text-white font-bold"
                          : "bg-white border-[#D8D2C4] text-[#1B2430] hover:bg-[#FAF8F3]"
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-1.5 border border-[#D8D2C4] rounded-[4px] hover:bg-[#1B2430] hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit cursor-pointer"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-xs px-0.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
