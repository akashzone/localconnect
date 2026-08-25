import StarRating from "./StarRating";

function ReviewCard({ review, reviewerRole }) {
  // If the reviewer is "business", the review was WRITTEN by a business owner for a student.
  // If the reviewer is "student", the review was WRITTEN by a student for a business owner.
  const authorName =
    review.reviewerRole === "business"
      ? review.businessOwnerId?.name || "Business Owner"
      : review.studentId?.name || "Student Developer";

  const projectTitle = review.projectId?.title;
  const dateFormatted = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="bg-[#FAF8F3]/40 border border-[#D8D2C4] rounded-[6px] p-5 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <p className="font-['Space_Grotesk'] font-bold text-[#1B2430] text-sm">
            {authorName}
          </p>
          {projectTitle && (
            <p className="font-['IBM_Plex_Mono'] text-[10px] text-[#9B9384] uppercase tracking-wider">
              Project: {projectTitle}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarRating rating={review.stars} readOnly={true} size="w-3.5 h-3.5" />
          {dateFormatted && (
            <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#9B9384] tracking-wide">
              {dateFormatted}
            </span>
          )}
        </div>
      </div>
      <p className="text-[#4A473F] text-[13.5px] leading-relaxed italic whitespace-pre-line font-['IBM_Plex_Sans']">
        "{review.description}"
      </p>
    </div>
  );
}

export default ReviewCard;
