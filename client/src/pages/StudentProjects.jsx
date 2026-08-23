import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBriefcase, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import SubmitWorkModal from "../components/application/SubmitWorkModal.jsx";

const statusConfig = {
  "in progress": { label: "In Progress", dot: "🟡", classes: "bg-[#FDF3D6] text-[#8A6D1D]" },
  "under review": { label: "Under Review", dot: "🔵", classes: "bg-[#E9F5F1] text-[#0F6B5C]" },
  "changes requested": { label: "Changes Requested", dot: "🔴", classes: "bg-[#FBE7E4] text-[#B3452F]" },
  completed: { label: "Completed", dot: "🟢", classes: "bg-[#E9F5F1] text-[#0F6B5C]" },
  cancelled: { label: "Cancelled", dot: "🔴", classes: "bg-[#FBE7E4] text-[#B3452F]" }
};

const filterTabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "submitted", label: "Submitted" },
  { key: "completed", label: "Completed" }
];

function ProjectCard({ project, applications = [], onSubmitClick }) {
  const location = useLocation();
  const status = project.status?.toLowerCase() || "in progress";
  const badge = statusConfig[status] || statusConfig["in progress"];
  const businessName = project.businessOwnerId?.companyName || project.businessOwnerId?.name || "Local Business";

  const app = applications.find(
    (a) => (a.projectId?._id || a.projectId) === project._id
  );

  // Actions based on status
  const getButtonContent = () => {
    switch (status) {
      case "in progress":
        return { text: "Open Project", isPrimary: true };
      case "under review":
        return { text: "View Submission", isPrimary: false };
      case "completed":
        return { text: "View Project", isPrimary: false };
      case "cancelled":
        return { text: "View Project", isPrimary: false };
      default:
        return { text: "Open Project", isPrimary: true };
    }
  };

  const btn = getButtonContent();

  return (
    <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[3px_3px_0px_#D8D2C4] flex flex-col justify-between">
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
          <div>
            <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-1">
              {project.title}
            </h3>
            <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384]">
              Business: <span className="text-[#1B2430] font-semibold">{businessName}</span>
            </p>
          </div>

          <span
            className={`shrink-0 font-['IBM_Plex_Mono'] text-[10.5px] font-medium px-2.5 py-1.5 rounded-[3px] whitespace-nowrap ${badge.classes}`}
          >
            {badge.dot} {badge.label}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-[13.5px] text-[#4A473F] leading-relaxed mb-4 line-clamp-3">
          {project.description || "No description provided."}
        </p>

        {/* Budget / Deadline */}
        <div className="grid grid-cols-2 gap-4 border-y border-dashed border-[#D8D2C4] py-3.5 mb-4">
          <div>
            <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5">
              Budget
            </span>
            <span className="font-['Space_Grotesk'] font-bold text-[#0F6B5C] text-[15px]">
              ₹{project.budget?.toLocaleString("en-IN") ?? "—"}
            </span>
          </div>

          <div>
            <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#9B9384] mb-0.5">
              Deadline
            </span>
            <span className="font-semibold text-xs text-[#1B2430]">
              {project.deadline
                ? new Date(project.deadline).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "—"}
            </span>
          </div>
        </div>

        {/* Skills */}
        {project.skillsRequired && project.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.skillsRequired.map((skill) => (
              <span
                key={skill}
                className="font-['IBM_Plex_Mono'] text-[10px] px-2 py-0.5 border border-[#D8D2C4]/70 rounded-[3px] text-[#6B6459] bg-[#FAF8F3]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Primary Card Action */}
      <div className="pt-2 border-t border-[#D8D2C4]/40 mt-auto flex gap-3">
        <Link
          to={`/projects/${project._id}`}
          state={{ from: location }}
          className="flex-1 font-semibold text-sm py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] text-center inline-block transition-all duration-150"
        >
          Open Project
        </Link>
        {(status === "in progress" || status === "changes requested") && app && (
          <button
            onClick={() => onSubmitClick(project)}
            className="flex-1 font-semibold text-sm py-2.5 rounded-[4px] bg-[#0F6B5C] text-white shadow-[3px_3px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 text-center"
          >
            {status === "changes requested" ? "Resubmit" : "Submit Work"}
          </button>
        )}
      </div>
    </div>
  );
}

function StudentProjects() {
  const { isAuthenticated } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProjectForSubmit, setSelectedProjectForSubmit] = useState(null);
  const [submittingWork, setSubmittingWork] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const [projRes, appRes] = await Promise.all([
        api.get("/projects/assigned"),
        api.get("/applications/my")
      ]);
      
      setProjects(projRes.data.data || []);
      setApplications(appRes.data.data || []);
    } catch (err) {
      console.log("assigned projects api error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const handleSubmitWork = async ({ workLink, remarks }) => {
    if (!selectedProjectForSubmit) return;
    const matchedApp = applications.find(
      (a) => (a.projectId?._id || a.projectId) === selectedProjectForSubmit._id
    );
    if (!matchedApp) return;

    try {
      setSubmittingWork(true);
      const res = await api.put(`/applications/${matchedApp._id}/submit-work`, { workLink, remarks });
      
      // Update applications state
      setApplications((prev) =>
        prev.map((a) => (a._id === matchedApp._id ? res.data.data : a))
      );
      
      // Re-fetch projects to refresh status on the card
      const projRes = await api.get("/projects/assigned");
      setProjects(projRes.data.data || []);
      
      setSelectedProjectForSubmit(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit work.");
    } finally {
      setSubmittingWork(false);
    }
  };

  // Compute counts for UI status tabs
  const counts = projects.reduce(
    (acc, p) => {
      const status = p.status?.toLowerCase() || "";
      acc.all += 1;
      if (status === "in progress") acc.active += 1;
      if (status === "under review") acc.submitted += 1;
      if (status === "completed") acc.completed += 1;
      return acc;
    },
    { all: 0, active: 0, submitted: 0, completed: 0 }
  );

  // Filter projects list
  const visibleProjects = projects.filter((p) => {
    const status = p.status?.toLowerCase() || "";
    let matchesFilter = false;

    if (activeFilter === "all") {
      matchesFilter = true;
    } else if (activeFilter === "active" && status === "in progress") {
      matchesFilter = true;
    } else if (activeFilter === "submitted" && status === "under review") {
      matchesFilter = true;
    } else if (activeFilter === "completed" && status === "completed") {
      matchesFilter = true;
    }

    const matchesSearch = (p.title || "")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-5xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-6">
          <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
            Manage your assignments
          </span>
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-2">
            My Projects
          </h1>
          <p className="text-sm text-[#6B6459] font-medium">
            Manage the projects you've been selected to work on.
          </p>
        </div>

        {/* Filter tabs and search */}
        {!loading && !error && projects.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`font-['IBM_Plex_Mono'] text-[12px] px-3.5 py-2 rounded-[4px] border transition-colors duration-150 ${activeFilter === tab.key
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
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by project title..."
                className="w-full border border-[#D8D2C4] rounded-[4px] pl-10 pr-3.5 py-2.5 text-[14.5px]
                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                           transition-colors bg-white"
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
          <div className="text-center py-16">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F] mb-4">
              Unable to load your projects.
            </p>
            <button
              onClick={fetchProjects}
              className="font-semibold text-xs px-4 py-2 rounded-[4px] border border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-[#D8D2C4] rounded-[6px]">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] mb-1">
              You don't have any active projects yet.
            </p>
            <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384] mb-6">
              Once a business owner accepts your application, the project will appear here.
            </p>
            <Link
              to="/projects"
              className="font-semibold text-sm px-6 py-3 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[4px_4px_0px_#F5C445] hover:shadow-[2px_2px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
            >
              Browse Projects
            </Link>
          </div>
        )}

        {!loading && !error && projects.length > 0 && visibleProjects.length === 0 && (
          <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] text-center py-16">
            No projects match your filters.
          </p>
        )}

        {!loading && !error && visibleProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                applications={applications}
                onSubmitClick={setSelectedProjectForSubmit}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProjectForSubmit && (
        <SubmitWorkModal
          initialLink={
            applications.find(
              (a) => (a.projectId?._id || a.projectId) === selectedProjectForSubmit._id
            )?.workSubmission?.workLink || ""
          }
          initialRemarks={
            applications.find(
              (a) => (a.projectId?._id || a.projectId) === selectedProjectForSubmit._id
            )?.workSubmission?.remarks || ""
          }
          onConfirm={handleSubmitWork}
          onCancel={() => setSelectedProjectForSubmit(null)}
          submitting={submittingWork}
        />
      )}
    </div>
  );
}

export default StudentProjects;
