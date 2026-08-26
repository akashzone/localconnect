import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBriefcase, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import SubmitWorkModal from "../components/application/SubmitWorkModal.jsx";

const statusConfig = {
  "in progress": { label: "In Progress", dot: "🟡", classes: "bg-[#FDF3D6] text-[#8A6D1D] border-[#F5E2B3]" },
  "under review": { label: "Under Review", dot: "🔵", classes: "bg-[#E9F5F1] text-[#0F6B5C] border-[#B8E2D8]" },
  "changes requested": { label: "Changes Requested", dot: "🔴", classes: "bg-[#FBE7E4] text-[#B3452F] border-[#F5C2B8]" },
  completed: { label: "Completed", dot: "🟢", classes: "bg-[#E9F5F1] text-[#0F6B5C] border-[#B8E2D8]" },
  cancelled: { label: "Cancelled", dot: "⚪", classes: "bg-[#EAEAEA] text-[#4A473F] border-[#D8D2C4]" }
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
  const businessName = project.businessProfile?.businessName || project.businessOwnerId?.name || "Local Business";
  const businessType = project.businessProfile?.businessType || "";

  const app = applications.find(
    (a) => (a.projectId?._id || a.projectId) === project._id
  );

  const latestChangeRequest = app?.changeRequests && app.changeRequests.length > 0
    ? app.changeRequests[app.changeRequests.length - 1]
    : null;

  return (
    <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* 1. Project Title, 2. Business info, 3. Status */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] leading-snug">
              {project.title}
            </h3>
            {project.category && (
              <span className="font-['IBM_Plex_Mono'] text-[10.5px] text-[#9B9384] uppercase tracking-wider bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#D8D2C4]/60">
                {project.category}
              </span>
            )}
          </div>

          <div className="space-y-0.5 mb-3">
            <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
              Business: <span className="text-[#1B2430] font-semibold">{businessName}</span>
            </p>
            {businessType && (
              <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
                Business Type: <span className="text-[#1B2430] font-medium">{businessType}</span>
              </p>
            )}
          </div>

          <div className="pt-0.5">
            <span
              className={`inline-flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[11px] font-medium px-2.5 py-1 rounded-[4px] border ${badge.classes}`}
            >
              <span className="text-[10px]">{badge.dot}</span>
              <span>{badge.label}</span>
            </span>
          </div>
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
          <div className="flex flex-wrap gap-1.5 mb-4">
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

      {status === "in progress" && latestChangeRequest && latestChangeRequest.status === "Pending" && (
        <div className="mb-4 bg-[#FBE7E4] border border-[#B3452F]/25 rounded-[6px] p-3.5 text-left shadow-sm">
          <span className="block font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-widest text-[#B3452F] mb-1 font-bold">
            Changes Requested
          </span>
          <p className="text-[13px] text-[#4A473F] leading-relaxed mb-2">
            The Business Owner requested modifications:
          </p>
          <div className="text-[12.5px] text-[#B3452F] bg-white border border-[#B3452F]/15 px-2.5 py-1.5 rounded font-medium leading-relaxed mb-1.5">
            "{latestChangeRequest.message}"
          </div>
          <span className="block text-[10px] text-[#9B9384] font-['IBM_Plex_Mono']">
            {new Date(latestChangeRequest.requestedAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>
      )}

      {/* Action Buttons: Primary (Submit Work), Secondary (Open Project) */}
      <div className="pt-3 border-t border-[#D8D2C4]/50 mt-auto flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Action: Submit Work */}
          {status === "in progress" && app && (
            <button
              onClick={() => onSubmitClick(project)}
              className={`flex-1 min-w-[130px] inline-flex items-center justify-center font-semibold text-sm py-2 px-4 rounded-[4px] text-white transition-colors duration-150 shadow-sm cursor-pointer ${
                latestChangeRequest && latestChangeRequest.status === "Pending"
                  ? "bg-[#B3452F] hover:bg-[#963725]"
                  : "bg-[#0F6B5C] hover:bg-[#0C564A]"
              }`}
            >
              {latestChangeRequest && latestChangeRequest.status === "Pending" 
                ? "Edit & Resubmit" 
                : "Submit Work"}
            </button>
          )}

          {/* Secondary Action: Open Project */}
          <Link
            to={`/projects/${project._id}`}
            state={{ from: location }}
            className={`flex-1 min-w-[120px] inline-flex items-center justify-center font-medium text-sm py-2 px-3.5 rounded-[4px] transition-colors duration-150 text-center ${
              status === "in progress" && app
                ? "bg-white text-[#1B2430] border border-[#D8D2C4] hover:border-[#1B2430] hover:bg-[#FAF8F3]"
                : "bg-white text-[#1B2430] border border-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3]"
            }`}
          >
            Open Project
          </Link>
        </div>

        {status === "under review" && (
          <span className="block text-center font-['IBM_Plex_Mono'] text-xs font-semibold text-[#0F6B5C] bg-[#E9F5F1] py-1.5 rounded border border-[#0F6B5C]/15">
            Work Submitted — Waiting for Review
          </span>
        )}
        {status === "completed" && (
          <span className="block text-center font-['IBM_Plex_Mono'] text-xs font-semibold text-[#0F6B5C] bg-[#E9F5F1] py-1.5 rounded border border-[#0F6B5C]/15">
            Project Completed
          </span>
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

      {(() => {
        const matchedApp = selectedProjectForSubmit
          ? applications.find((a) => (a.projectId?._id || a.projectId) === selectedProjectForSubmit._id)
          : null;
        const matchedLatestChangeRequest = matchedApp?.changeRequests && matchedApp.changeRequests.length > 0
          ? matchedApp.changeRequests[matchedApp.changeRequests.length - 1]
          : null;
        const isEditMode = matchedLatestChangeRequest && matchedLatestChangeRequest.status === "Pending";

        return selectedProjectForSubmit && (
          <SubmitWorkModal
            mode={isEditMode ? "edit" : "submit"}
            feedback={isEditMode ? matchedLatestChangeRequest.message : ""}
            initialLink={matchedApp?.workSubmission?.workLink || ""}
            initialRemarks={matchedApp?.workSubmission?.remarks || ""}
            onConfirm={handleSubmitWork}
            onCancel={() => setSelectedProjectForSubmit(null)}
            submitting={submittingWork}
          />
        );
      })()}
    </div>
  );
}

export default StudentProjects;
