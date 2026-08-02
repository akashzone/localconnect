import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";

const statusConfig = {
  open: { label: "Open", dot: "🟢", classes: "bg-[#E9F5F1] text-[#0F6B5C]" },
  "in progress": { label: "In Progress", dot: "🟡", classes: "bg-[#FDF3D6] text-[#8A6D1D]" },
  completed: { label: "Completed", dot: "🔵", classes: "bg-[#EAEAEA] text-[#4A473F]" },
  cancelled: { label: "Cancelled", dot: "🔴", classes: "bg-[#FBE7E4] text-[#B3452F]" },
};

const applicationStatusStyles = {
  pending: "bg-[#FDF3D6] text-[#8A6D1D]",
  accepted: "bg-[#E9F5F1] text-[#0F6B5C]",
  rejected: "bg-[#FBE7E4] text-[#B3452F]",
  withdrawn: "bg-[#EAEAEA] text-[#4A473F]",
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "—";

const formatRelativeTime = (date) => {
  if (!date) return "—";
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
};

const daysUntil = (date) => {
  if (!date) return null;
  const diffMs = new Date(date).getTime() - Date.now();
  return Math.ceil(diffMs / 86400000);
};

function BusinessDashboard() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get("/dashboard/business");
        const fetchedProjects = res.data.data.projects || [];
        const initialStats = res.data.data.dashboard || null;

        // Fetch applications for each project — keep the full list, not just the count,
        // so we can flatten everything for "Recent Applications" below.
        let flatApplications = [];
        const projectsWithApplications = await Promise.all(
          fetchedProjects.map(async (project) => {
            try {
              const appRes = await api.get(`/applications/project/${project._id}`);
              const projectApps = appRes.data.data || [];
              flatApplications = flatApplications.concat(
                projectApps.map((app) => ({ ...app, projectTitle: project.title, projectId: project._id }))
              );
              return { ...project, applicationsCount: projectApps.length };
            } catch (err) {
              console.error(`Failed to fetch applications for project ${project._id}`, err);
              return { ...project, applicationsCount: 0 };
            }
          })
        );

        setProjects(projectsWithApplications);
        setAllApplications(flatApplications);
        setStats(
          initialStats
            ? { ...initialStats, totalApplications: flatApplications.length }
            : null
        );
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchDashboard();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F]">Failed to load dashboard.</p>
      </div>
    );
  }

  const {
    totalProjects = 0,
    openProjects = 0,
    inProgressProjects = 0,
    completedProjects = 0,
    totalApplications = 0,
  } = stats;

  const statCards = [
    { icon: "📁", label: "Total Projects", value: totalProjects },
    { icon: "🟢", label: "Open Projects", value: openProjects, tone: "text-[#0F6B5C]" },
    { icon: "⚡", label: "In Progress", value: inProgressProjects, tone: "text-[#8A6D1D]" },
    { icon: "✅", label: "Completed", value: completedProjects },
    { icon: "👨‍💻", label: "Applications", value: totalApplications },
  ];

  // Recent projects — newest 5, by createdAt if present, else just the first 5 as returned
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Recent applications — flattened across all projects, newest first, top 5
  const recentApplications = [...allApplications]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Upcoming deadlines — open/in-progress projects with a future deadline, soonest first, top 5
  const upcomingDeadlines = projects
    .filter((p) => {
      const status = p.status?.toLowerCase();
      return (status === "open" || status === "in progress") && p.deadline && daysUntil(p.deadline) >= 0;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-14">

        {/* Welcome header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="font-['Space_Grotesk'] font-bold text-2xl md:text-[28px]">
              Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-[14.5px] text-[#6B6459] mt-1">
              Manage your projects and hire developers.
            </p>
          </div>

          <Link
            to="/create-project"
            className="font-semibold px-5 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3] text-sm
                       shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-150"
          >
            + Create Project
          </Link>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { label: "+ Create Project", to: "/create-project" },
            { label: "Manage Projects", to: "/my-projects" },
            { label: "View Applications", to: "/applications/business" },
            { label: "Edit Profile", to: "/profile" },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="font-['IBM_Plex_Mono'] text-[11px] px-3.5 py-2 rounded-[4px] border border-[#D8D2C4] text-[#4A473F]
                         hover:border-[#1B2430] hover:text-[#1B2430] transition-colors duration-150"
            >
              {action.label}
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5 mb-8">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[3px_3px_0px_#D8D2C4]"
            >
              <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384]">
                {s.icon} {s.label}
              </span>
              <p className={`font-['Space_Grotesk'] font-bold text-2xl mt-1 ${s.tone || "text-[#1B2430]"}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 sm:p-8 shadow-[5px_5px_0px_#1B2430] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Space_Grotesk'] font-bold text-xl">
              Recent Projects
            </h2>
            <Link
              to="/my-projects"
              className="font-['IBM_Plex_Mono'] text-xs text-[#0F6B5C] hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] mb-5">
                You haven't posted any projects yet.
              </p>
              <Link
                to="/create-project"
                className="font-semibold text-sm px-5 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                           shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-150"
              >
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] border-b border-[#D8D2C4]">
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Deadline</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((p) => {
                    const statusInfo = statusConfig[p.status?.toLowerCase()] || statusConfig.open;
                    return (
                      <tr key={p._id} className="border-b border-dashed border-[#D8D2C4] last:border-0">
                        <td className="py-3.5 font-medium">{p.title}</td>
                        <td className="py-3.5">
                          <span
                            className={`font-['IBM_Plex_Mono'] text-[10px] uppercase px-2 py-1 rounded-[3px] whitespace-nowrap ${statusInfo.classes}`}
                          >
                            {statusInfo.dot} {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3.5 text-[#6B6459]">{formatDate(p.deadline)}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-4 justify-end">
                            <Link
                              to={`/projects/${p._id}`}
                              className="font-['IBM_Plex_Mono'] text-xs text-[#0F6B5C] hover:underline whitespace-nowrap"
                            >
                              View Details
                            </Link>
                            <Link
                              to={`/${p._id}/edit-project`}
                              className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] hover:text-[#1B2430] hover:underline whitespace-nowrap"
                            >
                              Edit
                            </Link>
                            <Link
                              to={`/projects/${p._id}`}
                              className={`font-['IBM_Plex_Mono'] text-xs whitespace-nowrap ${p.applicationsCount > 0 ? "text-[#0F6B5C] font-semibold" : "text-[#9B9384]"
                                } hover:underline`}
                            >
                              Applications ({p.applicationsCount ?? 0})
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 sm:p-8 shadow-[5px_5px_0px_#1B2430] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Space_Grotesk'] font-bold text-xl">
              Recent Applications
            </h2>
            <Link
              to="/my-projects"
              className="font-['IBM_Plex_Mono'] text-xs text-[#0F6B5C] hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] mb-1">
                No applications yet.
              </p>
              <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#9B9384]">
                Share your project or wait for developers to apply.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => {
                const appStatus = app.status?.toLowerCase() || "pending";
                const developerName =
                  app.developerId?.name ||
                  app.developerId?.userId?.name ||
                  "A developer";

                return (
                  <div
                    key={app._id}
                    className="flex items-center justify-between gap-4 border border-[#D8D2C4] rounded-[6px] p-4 flex-wrap"
                  >
                    <div>
                      <p className="font-['Space_Grotesk'] font-bold text-[15px] mb-0.5">
                        {developerName}
                      </p>
                      <p className="text-[13.5px] text-[#4A473F]">
                        Applied to {app.projectTitle}
                      </p>
                      <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384] mt-1">
                        {formatRelativeTime(app.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-['IBM_Plex_Mono'] text-[10px] uppercase px-2 py-1 rounded-[3px] whitespace-nowrap ${applicationStatusStyles[appStatus] || applicationStatusStyles.pending
                          }`}
                      >
                        {app.status}
                      </span>
                      <Link
                        to={`/projects/${app.projectId}`}
                        className="font-semibold text-xs px-3.5 py-2 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                                   hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 sm:p-8 shadow-[5px_5px_0px_#1B2430]">
          <h2 className="font-['Space_Grotesk'] font-bold text-xl mb-6">
            Upcoming Deadlines
          </h2>

          {upcomingDeadlines.length === 0 ? (
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] text-center py-8">
              No upcoming deadlines.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((p) => {
                const days = daysUntil(p.deadline);
                return (
                  <div
                    key={p._id}
                    className="flex items-center justify-between border-b border-dashed border-[#D8D2C4] last:border-0 pb-3 last:pb-0"
                  >
                    <Link
                      to={`/projects/${p._id}`}
                      className="font-medium text-[14.5px] hover:text-[#0F6B5C] transition-colors"
                    >
                      {p.title}
                    </Link>
                    <span
                      className={`font-['IBM_Plex_Mono'] text-[12px] whitespace-nowrap ${days <= 3 ? "text-[#B3452F] font-semibold" : "text-[#6B6459]"
                        }`}
                    >
                      {days === 0 ? "Due today" : `${days} day${days === 1 ? "" : "s"} left`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusinessDashboard;