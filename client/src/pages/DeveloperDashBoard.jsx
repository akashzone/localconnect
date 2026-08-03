import { useEffect, useState, useContext } from "react";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const statusStyles = {
  pending: "bg-[#FDF3D6] text-[#8A6D1D]",
  accepted: "bg-[#E9F5F1] text-[#0F6B5C]",
  rejected: "bg-[#FBE7E4] text-[#B3452F]",
  withdrawn: "bg-[#EAEAEA] text-[#4A473F]",
};

function DeveloperDashboard() {
  const { isAuthenticated } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get("/dashboard/developer");
        setApplications(res.data.data.applications || []);
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
    totalApplications = 0,
    pendingApplications = 0,
    accepetedApplications = 0, // matches backend's spelling
    rejectedApplications = 0,
    withdrawnApplications = 0,
  } = stats;

  const statCards = [
    { label: "Total", value: totalApplications },
    { label: "Pending", value: pendingApplications, tone: "text-[#8A6D1D]" },
    { label: "Accepted", value: accepetedApplications, tone: "text-[#0F6B5C]" },
    { label: "Rejected", value: rejectedApplications, tone: "text-[#B3452F]" },
    { label: "Withdrawn", value: withdrawnApplications },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
          Overview
        </span>
        <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-10">
          Developer Dashboard
        </h1>

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

        {/* Applications */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 sm:p-8 shadow-[5px_5px_0px_#1B2430]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Space_Grotesk'] font-bold text-xl">
              Recent Applications
            </h2>
            <Link
              to="/my-applications"
              className="font-['IBM_Plex_Mono'] text-xs text-[#0F6B5C] hover:underline"
            >
              View all →
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] text-center py-8">
              No applications yet.
            </p>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] border-b border-[#D8D2C4]">
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    // projectId may be a populated object ({ _id, title }) or a raw id string,
                    // depending on whether your backend .populate()s it — this handles both.
                    const projectTitle =
                      typeof app.projectId === "object"
                        ? app.projectId?.title
                        : app.projectId;

                    return (
                      <tr key={app._id} className="border-b border-dashed border-[#D8D2C4] last:border-0">
                        <td className="py-3.5 font-medium">
                          {projectTitle || "—"}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`font-['IBM_Plex_Mono'] text-[10px] uppercase px-2 py-1 rounded-[3px] ${
                              statusStyles[app.status?.toLowerCase()] || statusStyles.pending
                            }`}
                          >
                            {app.status || "pending"}
                          </span>
                        </td>
                        <td className="py-3.5 text-[#6B6459]">
                          {app.appliedOn || app.createdAt
                            ? new Date(app.appliedOn || app.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeveloperDashboard;