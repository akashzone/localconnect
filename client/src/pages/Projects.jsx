import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import api from "../api/api.js";
import ProjectCard from "../components/project/ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search, filter, and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get("/projects");
        setProjects(res.data.data || []);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Compute unique categories dynamically from loaded projects
  const uniqueCategories = [
    ...new Set(
      projects
        .map((p) => p.category?.trim())
        .filter(Boolean)
    ),
  ];

  // Filter and sort project list
  const filteredProjects = projects
    .filter((project) => {
      const isOpen = project.status?.toLowerCase() === "open";
      if (!isOpen) return false;

      const matchesSearch =
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.skillsRequired?.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "budgetDesc") {
        return (b.budget || 0) - (a.budget || 0);
      }
      if (sortBy === "budgetAsc") {
        return (a.budget || 0) - (b.budget || 0);
      }
      if (sortBy === "deadlineNear") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
          The board
        </span>
        <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-8">
          Browse projects
        </h1>

        {/* Search & Filter Bar */}
        {!loading && !error && projects.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B9384] text-sm pointer-events-none">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects by title, description, or skills..."
                className="w-full border border-[#D8D2C4] rounded-[4px] pl-10 pr-3.5 py-2.5 text-[14.5px]
                           bg-white focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                           transition-colors"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-56 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none border border-[#D8D2C4] rounded-[4px] pl-3.5 pr-10 py-2.5 text-[14.5px]
                           bg-white text-[#1B2430] font-medium shadow-[2px_2px_0px_#1B2430]/5
                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                           hover:border-[#1B2430] transition-colors cursor-pointer"
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9384] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-56 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none border border-[#D8D2C4] rounded-[4px] pl-3.5 pr-10 py-2.5 text-[14.5px]
                           bg-white text-[#1B2430] font-medium shadow-[2px_2px_0px_#1B2430]/5
                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                           hover:border-[#1B2430] transition-colors cursor-pointer"
              >
                <option value="default">Sort by: Default</option>
                <option value="budgetDesc">Budget: High to Low</option>
                <option value="budgetAsc">Budget: Low to High</option>
                <option value="deadlineNear">Deadline: Nearest First</option>
              </select>
              <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9384] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
              Loading projects...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F]">
              Failed to fetch projects.
            </p>
          </div>
        )}

        {/* Empty list (before filtering) */}
        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
              No projects available.
            </p>
          </div>
        )}

        {/* No results matching search filters */}
        {!loading && !error && projects.length > 0 && filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
              No projects match your search criteria.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;