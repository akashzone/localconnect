import { Link, useLocation } from "react-router-dom";

const statusStyles = {
  open: { label: "Open", dot: "🟢", classes: "bg-[#E9F5F1] text-[#0F6B5C] border-[#B8E2D8]" },
  "in progress": { label: "In Progress", dot: "🟡", classes: "bg-[#FDF3D6] text-[#8A6D1D] border-[#F5E2B3]" },
  "under review": { label: "Under Review", dot: "🔵", classes: "bg-[#E9F5F1] text-[#0F6B5C] border-[#B8E2D8]" },
  "changes requested": { label: "Changes Requested", dot: "🔴", classes: "bg-[#FBE7E4] text-[#B3452F] border-[#F5C2B8]" },
  completed: { label: "Completed", dot: "🟢", classes: "bg-[#E9F5F1] text-[#0F6B5C] border-[#B8E2D8]" },
  closed: { label: "Closed", dot: "⚪", classes: "bg-[#EAEAEA] text-[#4A473F] border-[#D8D2C4]" },
};

function ProjectCard({ project }) {
  const location = useLocation();
  const {
    _id,
    title,
    budget,
    category,
    deadline,
    skillsRequired = [],
    skills = [],
    status = "open",
  } = project;

  const allSkills = skillsRequired.length > 0 ? skillsRequired : skills;
  const statusKey = status?.toLowerCase() || "open";
  const badge = statusStyles[statusKey] || statusStyles.open;
  const businessName = project.businessProfile?.businessName || project.businessOwnerId?.name || "";
  const businessType = project.businessProfile?.businessType || "";

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div
      className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 flex flex-col justify-between h-full
                 shadow-sm hover:shadow-md hover:border-[#1B2430]/40 transition-all duration-150"
    >
      <div>
        {/* 1. Title + Category */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] leading-snug">
              {title}
            </h3>
            {category && (
              <span className="font-['IBM_Plex_Mono'] text-[10px] tracking-widest uppercase text-[#9B9384] bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#D8D2C4]/60">
                {category}
              </span>
            )}
          </div>

          {/* 2. Business info (if available) */}
          {businessName && (
            <div className="space-y-0.5 mb-2.5">
              <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
                Business: <span className="text-[#1B2430] font-semibold">{businessName}</span>
              </p>
              {businessType && (
                <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
                  Business Type: <span className="text-[#1B2430] font-medium">{businessType}</span>
                </p>
              )}
            </div>
          )}

          {/* 3. Status Badge */}
          <div className="pt-0.5">
            <span
              className={`inline-flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[11px] font-medium px-2.5 py-1 rounded-[4px] border ${badge.classes}`}
            >
              <span className="text-[10px]">{badge.dot}</span>
              <span>{badge.label}</span>
            </span>
          </div>
        </div>

        {/* 4. Skills */}
        {allSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {allSkills.map((skill) => (
              <span
                key={skill}
                className="font-['IBM_Plex_Mono'] text-[10.5px] px-2 py-0.5 border border-[#D8D2C4]/70 rounded-[3px] text-[#4A473F] bg-[#FAF8F3]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* 5. Budget + deadline */}
        <div className="flex items-center justify-between border-t border-dashed border-[#D8D2C4] pt-3.5 mt-auto mb-4">
          <span className="font-['Space_Grotesk'] font-bold text-[#0F6B5C] text-base">
            ₹{budget?.toLocaleString("en-IN") ?? "—"}
          </span>
          <span className="font-['IBM_Plex_Mono'] text-xs text-[#9B9384]">
            Due {formattedDeadline}
          </span>
        </div>

        {/* 6. Action Button */}
        <Link
          to={`/projects/${_id}`}
          state={{ from: location }}
          className="w-full inline-flex items-center justify-center font-medium text-sm py-2 px-4 rounded-[4px] border border-[#1B2430] text-[#1B2430]
                     hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;