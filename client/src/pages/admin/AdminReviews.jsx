import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faStar,
  faBuilding,
  faUserGraduate,
  faTriangleExclamation,
  faChevronLeft,
  faChevronRight,
  faArrowRotateRight,
  faQuoteLeft,
  faBriefcase
} from "@fortawesome/free-solid-svg-icons";

const AdminReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/admin/reviews?page=${page}&limit=${limit}`;
      if (debouncedSearch.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }
      if (ratingFilter) {
        url += `&rating=${ratingFilter}`;
      }
      if (roleFilter) {
        url += `&reviewerRole=${roleFilter}`;
      }

      const res = await api.get(url);
      if (res.data?.success) {
        setReviews(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
          setTotalReviews(res.data.pagination.total);
        }
      } else {
        throw new Error(res.data?.message || "Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load reviews list. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, ratingFilter, roleFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setRatingFilter("");
    setRoleFilter("");
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

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5 text-[#F5C445]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-sm font-semibold">
            {i < rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
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
            Reviews & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6459] mt-0.5">
            Monitor feedback, ratings, and comments submitted between students and business clients on LocalConnect.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF8F3] text-[#1B2430] border border-[#D8D2C4] rounded-[4px] font-['IBM_Plex_Sans'] text-xs font-semibold transition-all shadow-[2px_2px_0px_#1B2430] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowRotateRight} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border border-[#D8D2C4] rounded-[6px] shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6459]/60">
            <FontAwesomeIcon icon={faSearch} className="text-xs" />
          </span>
          <input
            type="text"
            placeholder="Search by reviewer name, project title, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#D8D2C4] rounded-[4px] font-['IBM_Plex_Sans'] text-sm focus:outline-none focus:border-[#0F6B5C] bg-[#FAF8F3] text-[#1B2430] placeholder-[#6B6459]/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Rating Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B6459] w-full sm:w-auto">
            <span>Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1.5 border border-[#D8D2C4] rounded-[4px] bg-[#FAF8F3] text-sm text-[#1B2430] focus:outline-none focus:border-[#0F6B5C] w-full sm:w-auto"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B6459] w-full sm:w-auto">
            <span>Reviewer:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1.5 border border-[#D8D2C4] rounded-[4px] bg-[#FAF8F3] text-sm text-[#1B2430] focus:outline-none focus:border-[#0F6B5C] w-full sm:w-auto"
            >
              <option value="">All Roles</option>
              <option value="student">Student → Business</option>
              <option value="business">Business → Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading && reviews.length === 0 ? (
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
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">Unable to load reviews</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchReviews}
            className="mt-4 px-4 py-2 bg-[#1B2430] text-white rounded-[4px] text-xs font-semibold hover:bg-[#1B2430]/90 shadow-[2px_2px_0px_#0F6B5C] active:translate-y-[1px] cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <FontAwesomeIcon icon={faStar} className="text-[#6B6459]/40 text-4xl mb-3" />
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">No reviews found</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1">
            There are no user reviews matching search or filter criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 border border-[#D8D2C4] text-[#1B2430] rounded-[4px] text-xs font-semibold hover:bg-[#FAF8F3] transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#D8D2C4] text-[10px] sm:text-xs font-['IBM_Plex_Mono'] text-[#6B6459] uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Reviewer</th>
                  <th className="px-6 py-4 font-semibold">Reviewed User</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Comment Preview</th>
                  <th className="px-6 py-4 font-semibold">Project Title</th>
                  <th className="px-6 py-4 font-semibold">Created Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D2C4]/60 font-['IBM_Plex_Sans'] text-sm text-[#1B2430]">
                {reviews.map((item) => {
                  const isStudentReviewer = item.reviewerRole === "student";
                  
                  const reviewerName = isStudentReviewer
                    ? item.studentId?.name
                    : item.businessOwnerId?.name;
                  const reviewerEmail = isStudentReviewer
                    ? item.studentId?.email
                    : item.businessOwnerId?.email;
                  const reviewerRoleLabel = isStudentReviewer ? "Student" : "Business";

                  const reviewedName = isStudentReviewer
                    ? item.businessOwnerId?.name
                    : item.studentId?.name;
                  const reviewedEmail = isStudentReviewer
                    ? item.businessOwnerId?.email
                    : item.studentId?.email;

                  const projectTitle = item.projectId?.title || "Not provided";
                  const commentPreview = item.description 
                    ? item.description.length > 60 
                      ? `${item.description.slice(0, 57)}...` 
                      : item.description 
                    : "—";

                  return (
                    <tr key={item._id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                      {/* Reviewer */}
                      <td className="px-6 py-4 font-medium max-w-[200px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center border border-[#F5C445] shrink-0">
                            {reviewerName ? reviewerName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-[#1B2430] block">{reviewerName || "Not provided"}</span>
                            <span className="text-[10px] font-['IBM_Plex_Mono'] text-[#6B6459] block mt-0.5 uppercase tracking-wide">
                              {reviewerRoleLabel}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Reviewed User */}
                      <td className="px-6 py-4 max-w-[200px] truncate">
                        <span className="font-semibold text-[#1B2430] block">{reviewedName || "Not provided"}</span>
                        {reviewedEmail && (
                          <span className="text-[10px] font-['IBM_Plex_Mono'] text-[#6B6459] block mt-0.5 truncate">
                            {reviewedEmail}
                          </span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(item.stars)}
                      </td>

                      {/* Comment Preview */}
                      <td className="px-6 py-4 max-w-[220px] truncate text-[#6B6459]">
                        <div className="flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faQuoteLeft} className="text-[#D8D2C4] text-xs shrink-0" />
                          <span className="truncate" title={item.description}>{commentPreview}</span>
                        </div>
                      </td>

                      {/* Project Title */}
                      <td className="px-6 py-4 max-w-[180px] truncate">
                        <div className="flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faBriefcase} className="text-[#6B6459] text-xs shrink-0" />
                          <span className="truncate text-[#1B2430] font-medium" title={projectTitle}>{projectTitle}</span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 text-xs text-[#6B6459] whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/reviews/${item._id}`}
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
                Showing page <strong className="text-[#1B2430]">{page}</strong> of <strong className="text-[#1B2430]">{totalPages}</strong> ({totalReviews} total reviews)
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

export default AdminReviews;
