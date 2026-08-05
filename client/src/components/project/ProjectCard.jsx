import { Link, useLocation } from "react-router-dom";

const statusStyles = {
  open: "bg-[#E9F5F1] text-[#0F6B5C]",
  "in progress": "bg-[#FDF3D6] text-[#8A6D1D]",
  completed: "bg-[#EAEAEA] text-[#4A473F]",
  closed: "bg-[#FBE7E4] text-[#B3452F]",
};

function ProjectCard({ project }) {
  const location = useLocation();
  const {
    _id,
    title,
    budget,
    category,
    deadline,
    skills = [],
    status = "open",
  } = project;

  const statusClass = statusStyles[status?.toLowerCase()] || statusStyles.open;
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div
      className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 flex flex-col
                 shadow-[3px_3px_0px_#D8D2C4] hover:shadow-[3px_3px_0px_#F5C445]
                 hover:-translate-y-0.5 transition-all duration-150"
    >
      {/* Top row: category tag + status */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-['IBM_Plex_Mono'] text-[10px] tracking-widest uppercase text-[#9B9384]">
          {category || "General"}
        </span>
        <span
          className={`font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wide px-2 py-1 rounded-[3px] ${statusClass}`}
        >
          {status}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] mb-4 leading-snug">
        {title}
      </h3>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="font-['IBM_Plex_Mono'] text-[11px] px-2 py-1 border border-[#D8D2C4] rounded-[3px] text-[#4A473F]"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Budget + deadline */}
      <div className="flex items-center justify-between border-t border-dashed border-[#D8D2C4] pt-4 mt-auto mb-5">
        <span className="font-['Space_Grotesk'] font-bold text-[#0F6B5C]">
          ₹{budget}
        </span>
        <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384]">
          Due {formattedDeadline}
        </span>
      </div>

      {/* CTA */}
      <Link
        to={`/projects/${_id}`}
        state={{ from: location }}
        className="text-center font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                   hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
      >
        View Details
      </Link>
    </div>
  );
}

export default ProjectCard;