import { useState, useContext } from "react";
import StarRating from "./StarRating";
import { AuthContext } from "../../context/AuthContext";
import ReportModal from "../ReportModal";

function ReviewCard({ review, reviewerRole }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showReportModal, setShowReportModal] = useState(false);

  // If the reviewer is "business", the review was WRITTEN by a business owner for a student.
  // If the reviewer is "student", the review was WRITTEN by a student for a business owner.
  const authorName =
    review.reviewerRole === "business"
      ? review.businessOwnerId?.name || "Business Owner"
      : review.studentId?.name || "Student Developer";

  const authorUserId =
    review.reviewerRole === "business"
      ? review.businessOwnerId?._id || review.businessOwnerId
      : review.studentId?._id || review.studentId;

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
          {isAuthenticated && user?.role !== "admin" && user?._id !== authorUserId && (
            <button
              onClick={() => setShowReportModal(true)}
              className="text-[10px] text-[#B3452F] hover:underline font-semibold cursor-pointer border-0 bg-transparent p-0 flex items-center gap-0.5"
            >
              🚩 Report
            </button>
          )}
        </div>
      </div>
      <p className="text-[#4A473F] text-[13.5px] leading-relaxed italic whitespace-pre-line font-['IBM_Plex_Sans']">
        "{review.description}"
      </p>

      {showReportModal && (
        <ReportModal
          reviewId={review._id}
          targetName={`Review by ${authorName}`}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}

export default ReviewCard;
