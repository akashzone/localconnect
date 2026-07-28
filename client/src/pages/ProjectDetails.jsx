import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api.js";

const statusStyles = {
  open: "bg-[#E9F5F1] text-[#0F6B5C]",
  "in progress": "bg-[#FDF3D6] text-[#8A6D1D]",
  completed: "bg-[#EAEAEA] text-[#4A473F]",
  closed: "bg-[#FBE7E4] text-[#B3452F]",
};

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get(`/projects/${id}`);
        setProject(res.data.data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
          Loading project...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F]">
          Failed to fetch project.
        </p>
      </div>
    );
  }

  const {
    title,
    description,
    budget,
    deadline,
    skills = [],
    status = "open",
  } = project;

  const statusClass = statusStyles[status?.toLowerCase()] || statusStyles.open;
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "—";

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] px-4 py-16">
      <div className="max-w-3xl mx-auto">

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C] hover:underline mb-8"
        >
          ← Back to projects
        </Link>

        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[6px_6px_0px_#1B2430]">

          {/* Top row */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384]">
              POSTING #{id?.slice(-4).toUpperCase()}
            </span>
            <span
              className={`font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-[3px] ${statusClass}`}
            >
              {status}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl leading-tight mb-6">
            {title}
          </h1>

          {/* Budget / deadline row */}
          <div className="flex flex-wrap gap-8 border-y border-dashed border-[#D8D2C4] py-5 mb-8">
            <div>
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                Budget
              </span>
              <span className="font-['Space_Grotesk'] font-bold text-xl text-[#0F6B5C]">
                ₹{budget}
              </span>
            </div>

            <div>
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                Deadline
              </span>
              <span className="font-['Space_Grotesk'] font-bold text-xl">
                {formattedDeadline}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2">
              Description
            </span>
            <p className="text-[15px] text-[#4A473F] leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-9">
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2">
                Required skills
              </span>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-['IBM_Plex_Mono'] text-[12px] px-2.5 py-1.5 border border-[#D8D2C4] rounded-[3px] text-[#4A473F]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            className="w-full font-semibold px-6 py-3.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                       shadow-[4px_4px_0px_#F5C445] hover:shadow-[2px_2px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-150"
          >
            Apply to this project
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;