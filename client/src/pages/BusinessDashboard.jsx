import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";

const statusStyles = {
  open: "bg-[#E9F5F1] text-[#0F6B5C]",
  "in progress": "bg-[#FDF3D6] text-[#8A6D1D]",
  completed: "bg-[#EAEAEA] text-[#4A473F]",
  closed: "bg-[#FBE7E4] text-[#B3452F]",
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function BusinessDashboard() {
  const { isAuthenticated } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get("/dashboard/business");
        setProjects(res.data.data.projects || []);
        setStats(res.data.data.dashboard || null);
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
    { label: "Total Projects", value: totalProjects },
    { label: "Open", value: openProjects, tone: "text-[#0F6B5C]" },
    { label: "In Progress", value: inProgressProjects, tone: "text-[#8A6D1D]" },
    { label: "Completed", value: completedProjects },
    { label: "Applications", value: totalApplications },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
              Overview
            </span>
            <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2">
              Business Dashboard
            </h1>
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

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5 mb-12">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[3px_3px_0px_#D8D2C4]"
            >
              <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384]">
                {s.label}
              </span>
              <p className={`font-['Space_Grotesk'] font-bold text-2xl mt-1 ${s.tone || "text-[#1B2430]"}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 sm:p-8 shadow-[5px_5px_0px_#1B2430]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Space_Grotesk'] font-bold text-xl">
              Your Projects
            </h2>
            <Link
              to="/my-projects"
              className="font-['IBM_Plex_Mono'] text-xs text-[#0F6B5C] hover:underline"
            >
              View all →
            </Link>
          </div>

          {projects.length === 0 ? (
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
                    <th className="pb-3 font-medium">Applications</th>
                    <th className="pb-3 font-medium">Budget</th>
                    <th className="pb-3 font-medium">Deadline</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p._id} className="border-b border-dashed border-[#D8D2C4] last:border-0">
                      <td className="py-3.5 font-medium">{p.title}</td>
                      <td className="py-3.5">
                        <span
                          className={`font-['IBM_Plex_Mono'] text-[10px] uppercase px-2 py-1 rounded-[3px] ${
                            statusStyles[p.status?.toLowerCase()] || statusStyles.open
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-[#6B6459]">{p.applicationsCount ?? 0}</td>
                      <td className="py-3.5 font-['Space_Grotesk'] font-bold text-[#0F6B5C]">
                        ₹{p.budget?.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 text-[#6B6459]">{formatDate(p.deadline)}</td>
                      <td className="py-3.5">
                        <Link
                          to={`/projects/${p._id}`}
                          className="font-['IBM_Plex_Mono'] text-xs text-[#0F6B5C] hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusinessDashboard;