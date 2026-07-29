import { useEffect, useState } from "react";
import api from "../api/api.js";
import ProjectCard from "../components/project/ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
          The board
        </span>
        <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-10">
          Browse projects
        </h1>

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

        {/* Empty */}
        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
              No projects available.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;