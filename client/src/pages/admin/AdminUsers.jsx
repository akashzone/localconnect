import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUsers,
  faBuilding,
  faUserGraduate,
  faShieldHalved,
  faChevronLeft,
  faChevronRight,
  faRotateRight,
  faCircleCheck,
  faEnvelope,
  faCalendarDays,
  faArrowRotateRight
} from "@fortawesome/free-solid-svg-icons";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/admin/users?page=${page}&limit=${limit}`;
      if (debouncedSearch.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }
      if (selectedRole !== "all") {
        url += `&role=${selectedRole}`;
      }

      const res = await api.get(url);
      if (res.data?.success) {
        setUsers(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
          setTotalUsers(res.data.pagination.total);
        }
      } else {
        throw new Error(res.data?.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load users list. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset filters helper
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setPage(1);
  };

  const getRoleIconAndClass = (role) => {
    switch (role) {
      case "student":
        return {
          icon: faUserGraduate,
          text: "Student",
          badgeClass: "bg-[#0F6B5C]/10 text-[#0F6B5C] border-[#0F6B5C]/20",
          iconClass: "text-[#0F6B5C]"
        };
      case "business":
        return {
          icon: faBuilding,
          text: "Business",
          badgeClass: "bg-[#F5C445]/10 text-[#7C5A0B] border-[#F5C445]/30",
          iconClass: "text-[#7C5A0B]"
        };
      case "admin":
        return {
          icon: faShieldHalved,
          text: "Admin",
          badgeClass: "bg-[#1B2430]/10 text-[#1B2430] border-[#1B2430]/20",
          iconClass: "text-[#1B2430]"
        };
      default:
        return {
          icon: faUsers,
          text: role,
          badgeClass: "bg-[#6B6459]/10 text-[#6B6459] border-[#6B6459]/20",
          iconClass: "text-[#6B6459]"
        };
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
            Users Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6459] mt-0.5">
            Monitor, inspect, and manage developer students, business owners, and administrative staff accounts.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF8F3] text-[#1B2430] border border-[#D8D2C4] rounded-[4px] font-['IBM_Plex_Sans'] text-xs font-semibold transition-all shadow-[2px_2px_0px_#1B2430] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowRotateRight} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border border-[#D8D2C4] rounded-[6px] shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6459]/60">
            <FontAwesomeIcon icon={faSearch} className="text-xs" />
          </span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#D8D2C4] rounded-[4px] font-['IBM_Plex_Sans'] text-sm focus:outline-none focus:border-[#0F6B5C] bg-[#FAF8F3] text-[#1B2430] placeholder-[#6B6459]/60"
          />
        </div>

        {/* Role Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#6B6459] font-semibold">
            Role:
          </span>
          <div className="flex gap-1 bg-[#FAF8F3] border border-[#D8D2C4] p-1 rounded-[4px]">
            {["all", "student", "business", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRole(r);
                  setPage(1);
                }}
                className={`px-3 py-1 text-xs font-['IBM_Plex_Sans'] font-medium rounded-[3px] transition-all cursor-pointer uppercase tracking-wide ${
                  selectedRole === r
                    ? "bg-[#0F6B5C] text-white shadow-xs font-semibold"
                    : "text-[#6B6459] hover:text-[#1B2430]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading && users.length === 0 ? (
        // Loading skeleton
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430] overflow-hidden">
          <div className="h-12 bg-[#FAF8F3] border-b border-[#D8D2C4]" />
          <div className="p-4 space-y-3.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between py-2 border-b border-[#D8D2C4]/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D8D2C4]/40 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-[#D8D2C4]/40 animate-pulse rounded" />
                    <div className="h-3 w-48 bg-[#D8D2C4]/40 animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-[#D8D2C4]/40 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        // Error state
        <div className="p-8 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <div className="text-[#B3452F] text-3xl mb-3">⚠️</div>
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">Unable to load users</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-[#1B2430] text-white rounded-[4px] text-xs font-semibold hover:bg-[#1B2430]/90 shadow-[2px_2px_0px_#0F6B5C] active:translate-y-[1px] transition-all cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : users.length === 0 ? (
        // Empty state
        <div className="p-12 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <div className="text-[#6B6459]/40 text-4xl mb-3">🔍</div>
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">No users found</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1">
            There are no users matching search criteria or role filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 border border-[#D8D2C4] text-[#1B2430] rounded-[4px] text-xs font-semibold hover:bg-[#FAF8F3] transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        // User List Table
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#D8D2C4] text-[10px] sm:text-xs font-['IBM_Plex_Mono'] text-[#6B6459] uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D2C4]/60 font-['IBM_Plex_Sans'] text-sm text-[#1B2430]">
                {users.map((item) => {
                  const roleStyle = getRoleIconAndClass(item.role);
                  return (
                    <tr key={item._id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                      {/* Name Card */}
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center border border-[#F5C445] shrink-0">
                            {item.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-[#1B2430] hover:text-[#0F6B5C] block">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-xs font-['IBM_Plex_Mono'] text-[#6B6459] truncate max-w-[200px]">
                        {item.email}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border ${roleStyle.badgeClass}`}>
                          <FontAwesomeIcon icon={roleStyle.icon} className="text-[10px]" />
                          <span>{roleStyle.text}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-xs text-[#6B6459] whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/users/${item._id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#1B2430] hover:text-white border border-[#D8D2C4] rounded-[4px] text-xs font-semibold text-[#1B2430] transition-colors cursor-pointer"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-[#FAF8F3] border-t border-[#D8D2C4] flex items-center justify-between flex-wrap gap-4">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
                Showing page <strong className="text-[#1B2430]">{page}</strong> of <strong className="text-[#1B2430]">{totalPages}</strong> ({totalUsers} total users)
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

export default AdminUsers;
