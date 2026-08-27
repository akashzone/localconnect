import { useState, useEffect, useContext, useCallback } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserGraduate,
  faBuilding,
  faBriefcase,
  faFolderOpen,
  faBolt,
  faCircleCheck,
  faClock,
  faFileSignature,
  faClipboardList,
  faStar,
  faRotateRight,
  faTriangleExclamation,
  faCheckCircle,
  faHourglassHalf,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

// Time formatting helper
const formatRelativeTime = (date) => {
  if (!date) return "—";
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const res = await api.get("/admin/dashboard");
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
      } else {
        throw new Error(res.data?.message || "Failed to fetch admin dashboard data");
      }
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load admin dashboard statistics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-[#D8D2C4]/40 animate-pulse rounded-[4px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-32 bg-white border border-[#D8D2C4] rounded-[6px] p-5 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="h-64 bg-white border border-[#D8D2C4] rounded-[6px] animate-pulse" />
          <div className="h-64 bg-white border border-[#D8D2C4] rounded-[6px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 shadow-[4px_4px_0px_#1B2430] text-center max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-[#B3452F]/10 text-[#B3452F] flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-xl" />
        </div>
        <h3 className="font-['Space_Grotesk'] font-bold text-xl text-[#1B2430] mb-2">
          Unable to Load Admin Dashboard
        </h3>
        <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mb-6">
          {error || "An error occurred while fetching platform statistics."}
        </p>
        <button
          onClick={() => fetchDashboardData()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F6B5C] hover:bg-[#0F6B5C]/90 text-white rounded-[4px] font-['IBM_Plex_Sans'] text-sm font-semibold transition-all shadow-[2px_2px_0px_#1B2430]"
        >
          <FontAwesomeIcon icon={faRotateRight} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const { users, projects, applications, recentActivity = [], pendingActions = [] } = data;

  const summaryCards = [
    {
      title: "Total Users",
      value: users?.total ?? 0,
      icon: faUsers,
      subtext: `${users?.students ?? 0} students, ${users?.businesses ?? 0} businesses`,
      tone: "text-[#1B2430]",
      bgTone: "bg-[#1B2430]/5",
    },
    {
      title: "Total Students",
      value: users?.students ?? 0,
      icon: faUserGraduate,
      subtext: `${users?.total ? Math.round(((users.students || 0) / users.total) * 100) : 0}% of all registered users`,
      tone: "text-[#0F6B5C]",
      bgTone: "bg-[#0F6B5C]/10",
    },
    {
      title: "Total Businesses",
      value: users?.businesses ?? 0,
      icon: faBuilding,
      subtext: `${users?.total ? Math.round(((users.businesses || 0) / users.total) * 100) : 0}% of all registered users`,
      tone: "text-[#8A6D1D]",
      bgTone: "bg-[#F5C445]/15",
    },
    {
      title: "Total Projects",
      value: projects?.total ?? 0,
      icon: faBriefcase,
      subtext: `${projects?.inProgress ?? 0} in progress, ${projects?.completed ?? 0} completed`,
      tone: "text-[#1B2430]",
      bgTone: "bg-[#1B2430]/5",
    },
  ];

  return (
    <div className="space-y-8 font-['IBM_Plex_Sans'] text-[#1B2430]">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D8D2C4]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-['IBM_Plex_Mono'] text-xs font-semibold text-[#0F6B5C] uppercase tracking-widest">
              Overview & Analytics
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-[#1B2430] mt-1">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#6B6459] mt-0.5">
            Platform-wide metrics, project lifecycle statistics, and real-time activity.
          </p>
        </div>

        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF8F3] text-[#1B2430] border border-[#D8D2C4] rounded-[4px] font-['IBM_Plex_Sans'] text-xs font-semibold transition-all shadow-[2px_2px_0px_#1B2430] active:translate-x-[1px] active:translate-y-[1px] self-start sm:self-auto cursor-pointer disabled:opacity-60"
        >
          <FontAwesomeIcon icon={faRotateRight} className={refreshing ? "animate-spin" : ""} />
          <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* 1. Summary Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[3px_3px_0px_#1B2430] flex flex-col justify-between hover:shadow-[4px_4px_0px_#0F6B5C] transition-shadow duration-150"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider text-[#6B6459] font-medium">
                    {card.title}
                  </p>
                  <p className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl text-[#1B2430] mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-[6px] ${card.bgTone} ${card.tone} flex items-center justify-center shrink-0`}>
                  <FontAwesomeIcon icon={card.icon} className="text-base" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D8D2C4]/60">
                <p className="font-['IBM_Plex_Sans'] text-xs text-[#6B6459]">
                  {card.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Project & Application Statistics */}
      <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-[#D8D2C4]">
          <div>
            <h2 className="font-['Space_Grotesk'] font-bold text-xl text-[#1B2430]">
              Project & Work Lifecycle
            </h2>
            <p className="text-xs text-[#6B6459]">
              Aggregated project statuses and developer applications across LocalConnect
            </p>
          </div>
          <span className="font-['IBM_Plex_Mono'] text-xs text-[#0F6B5C] bg-[#E9F5F1] px-2.5 py-1 rounded-[3px] font-medium self-start sm:self-auto">
            {projects?.total ?? 0} Total Listings
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Open */}
          <div className="bg-[#FAF8F3] border border-[#D8D2C4] rounded-[4px] p-4">
            <div className="flex items-center gap-1.5 text-[#0F6B5C] mb-2">
              <FontAwesomeIcon icon={faFolderOpen} className="text-xs" />
              <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-wider">
                Open
              </span>
            </div>
            <p className="font-['Space_Grotesk'] font-bold text-2xl text-[#1B2430]">
              {projects?.open ?? 0}
            </p>
            <p className="text-[11px] text-[#6B6459] mt-1">Accepting proposals</p>
          </div>

          {/* In Progress */}
          <div className="bg-[#FAF8F3] border border-[#D8D2C4] rounded-[4px] p-4">
            <div className="flex items-center gap-1.5 text-[#8A6D1D] mb-2">
              <FontAwesomeIcon icon={faBolt} className="text-xs" />
              <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-wider">
                In Progress
              </span>
            </div>
            <p className="font-['Space_Grotesk'] font-bold text-2xl text-[#1B2430]">
              {projects?.inProgress ?? 0}
            </p>
            <p className="text-[11px] text-[#6B6459] mt-1">Active student work</p>
          </div>

          {/* Under Review */}
          <div className="bg-[#FAF8F3] border border-[#D8D2C4] rounded-[4px] p-4">
            <div className="flex items-center gap-1.5 text-[#0F6B5C] mb-2">
              <FontAwesomeIcon icon={faHourglassHalf} className="text-xs" />
              <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-wider">
                Under Review
              </span>
            </div>
            <p className="font-['Space_Grotesk'] font-bold text-2xl text-[#1B2430]">
              {projects?.underReview ?? 0}
            </p>
            <p className="text-[11px] text-[#6B6459] mt-1">Submitted work</p>
          </div>

          {/* Changes Requested */}
          <div className="bg-[#FAF8F3] border border-[#D8D2C4] rounded-[4px] p-4">
            <div className="flex items-center gap-1.5 text-[#8A6D1D] mb-2">
              <FontAwesomeIcon icon={faArrowsRotate} className="text-xs" />
              <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-wider">
                Revisions
              </span>
            </div>
            <p className="font-['Space_Grotesk'] font-bold text-2xl text-[#1B2430]">
              {projects?.changesRequested ?? 0}
            </p>
            <p className="text-[11px] text-[#6B6459] mt-1">Feedback requested</p>
          </div>

          {/* Completed */}
          <div className="bg-[#FAF8F3] border border-[#D8D2C4] rounded-[4px] p-4">
            <div className="flex items-center gap-1.5 text-[#0F6B5C] mb-2">
              <FontAwesomeIcon icon={faCircleCheck} className="text-xs" />
              <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-wider">
                Completed
              </span>
            </div>
            <p className="font-['Space_Grotesk'] font-bold text-2xl text-[#1B2430]">
              {projects?.completed ?? 0}
            </p>
            <p className="text-[11px] text-[#6B6459] mt-1">Finished & reviewed</p>
          </div>

          {/* Total Applications */}
          <div className="bg-[#FAF8F3] border border-[#D8D2C4] rounded-[4px] p-4">
            <div className="flex items-center gap-1.5 text-[#1B2430] mb-2">
              <FontAwesomeIcon icon={faClipboardList} className="text-xs text-[#0F6B5C]" />
              <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-wider">
                Applications
              </span>
            </div>
            <p className="font-['Space_Grotesk'] font-bold text-2xl text-[#1B2430]">
              {applications?.total ?? 0}
            </p>
            <p className="text-[11px] text-[#6B6459] mt-1">
              {applications?.pending ?? 0} pending review
            </p>
          </div>
        </div>
      </section>

      {/* 3. Bottom Grid: Recent Activity & Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Section */}
        <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D8D2C4]">
              <div>
                <h2 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">
                  Recent Activity
                </h2>
                <p className="text-xs text-[#6B6459]">
                  Latest registrations, project creation, applications, and reviews
                </p>
              </div>
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#6B6459] bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#D8D2C4]">
                Realtime
              </span>
            </div>

            {recentActivity.length === 0 ? (
              <div className="py-12 text-center">
                <FontAwesomeIcon icon={faClock} className="text-2xl text-[#6B6459]/40 mb-2" />
                <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459]">
                  No recent activity recorded yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#D8D2C4]/60">
                {recentActivity.map((activity) => {
                  let icon = faClock;
                  let iconBg = "bg-[#FAF8F3] text-[#1B2430]";

                  if (activity.type === "user") {
                    icon = faUsers;
                    iconBg = "bg-[#0F6B5C]/10 text-[#0F6B5C]";
                  } else if (activity.type === "project") {
                    icon = faBriefcase;
                    iconBg = "bg-[#F5C445]/20 text-[#8A6D1D]";
                  } else if (activity.type === "application") {
                    icon = faFileSignature;
                    iconBg = "bg-[#0F6B5C]/10 text-[#0F6B5C]";
                  } else if (activity.type === "review") {
                    icon = faStar;
                    iconBg = "bg-[#F5C445]/25 text-[#8A6D1D]";
                  }

                  return (
                    <div
                      key={activity.id}
                      className="py-3.5 flex items-start gap-3.5 hover:bg-[#FAF8F3]/60 px-2 rounded transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-[4px] ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <FontAwesomeIcon icon={icon} className="text-xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-['IBM_Plex_Sans'] text-sm font-semibold text-[#1B2430] truncate">
                            {activity.title}
                          </p>
                          <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#6B6459] shrink-0 whitespace-nowrap">
                            {formatRelativeTime(activity.createdAt)}
                          </span>
                        </div>
                        <p className="font-['IBM_Plex_Sans'] text-xs text-[#6B6459] truncate mt-0.5">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-[#D8D2C4]/60 flex items-center justify-between text-xs text-[#6B6459]">
            <span className="font-['IBM_Plex_Mono'] text-[11px]">
              Showing {recentActivity.length} recent platform events
            </span>
          </div>
        </section>

        {/* Pending Actions Section */}
        <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D8D2C4]">
              <div>
                <h2 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">
                  Pending Actions
                </h2>
                <p className="text-xs text-[#6B6459]">
                  Items requiring administrative review, moderation, or intervention
                </p>
              </div>
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#0F6B5C] bg-[#E9F5F1] px-2 py-0.5 rounded border border-[#B8E2D8]">
                {pendingActions.length} Pending
              </span>
            </div>

            {pendingActions.length === 0 ? (
              <div className="py-12 px-4 text-center border-2 border-dashed border-[#D8D2C4] rounded-[6px] bg-[#FAF8F3]/50 my-2">
                <div className="w-12 h-12 rounded-full bg-[#0F6B5C]/10 text-[#0F6B5C] flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-[#1B2430] mb-1">
                  No Pending Actions
                </h3>
                <p className="font-['IBM_Plex_Sans'] text-xs text-[#6B6459] max-w-sm mx-auto">
                  All platform listings, submissions, and moderation queues are up to date. No administrative intervention is currently required.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#D8D2C4]/60">
                {pendingActions.map((action, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#1B2430]">{action.title}</p>
                      <p className="text-xs text-[#6B6459]">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-[#D8D2C4]/60 flex items-center justify-between text-xs text-[#6B6459]">
            <span className="font-['IBM_Plex_Mono'] text-[11px]">
              Moderation status: Normal
            </span>
            <span className="inline-flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[11px] text-[#0F6B5C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F6B5C]" />
              Queue Clear
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;