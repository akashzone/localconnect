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

const filterTabs = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "closed", label: "Closed" },
];

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function ProjectRow({ project, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const status = project.status?.toLowerCase() || "open";
  const statusClass = statusStyles[status] || statusStyles.open;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    setDeleting(true);
    await onDelete(project._id);
    setDeleting(false);
  };

  return (
    <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[3px_3px_0px_#D8D2C4]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-1.5">
            {project.title}
          </h3>
          <span className="inline-block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wide px-2 py-1 border border-[#D8D2C4] rounded-[3px] text-[#4A473F]">
            {project.category || "General"}
          </span>
        </div>

        <span
          className={`shrink-0 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wide px-2.5 py-1.5 rounded-[3px] whitespace-nowrap ${statusClass}`}
        >
          {project.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-dashed border-[#D8D2C4] py-4 mb-5">
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
            Applications
          </span>
          <span className="font-medium text-sm">{project.applicationsCount ?? 0}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/projects/${project._id}`}
          className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                     hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
        >
          View
        </Link>

        <Link
          to={`/projects/${project._id}/edit`}
          className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#D8D2C4] text-[#4A473F]
                     hover:border-[#0F6B5C] hover:text-[#0F6B5C] transition-colors duration-150"
        >
          Edit
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#B3452F] text-[#B3452F]
                     hover:bg-[#B3452F] hover:text-white transition-colors duration-150 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

function MyProjects() {
  const { token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get("/projects/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data.data || []);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProjects();
  }, [token]);

  const handleDelete = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  const counts = projects.reduce(
    (acc, p) => {
      const status = p.status?.toLowerCase() || "open";
      acc.all += 1;
      if (acc[status] !== undefined) acc[status] += 1;
      return acc;
    },
    { all: 0, open: 0, "in progress": 0, completed: 0, closed: 0 }
  );

  const visibleProjects = projects.filter((p) => {
    const status = p.status?.toLowerCase() || "open";
    const matchesFilter = activeFilter === "all" || status === activeFilter;
    const matchesSearch = (p.title || "")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-5xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
              Your postings
            </span>
            <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2">
              My Projects
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

        {/* Filter + search */}
        {!loading && !error && projects.length > 0 && (
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
            Loading your projects...
          </p>
        )}

        {!loading && error && (
          <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F] text-center py-16">
            Failed to fetch your projects.
          </p>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-[#D8D2C4] rounded-[6px]">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] mb-6">
              You haven't posted any projects yet.
            </p>
            <Link
              to="/create-project"
              className="font-semibold text-sm px-6 py-3 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
            >
              Create your first project
            </Link>
          </div>
        )}

        {!loading && !error && projects.length > 0 && visibleProjects.length === 0 && (
          <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] text-center py-16">
            No projects match your filters.
          </p>
        )}

        {!loading && !error && visibleProjects.length > 0 && (
          <div className="space-y-5">
            {visibleProjects.map((project) => (
              <ProjectRow key={project._id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;