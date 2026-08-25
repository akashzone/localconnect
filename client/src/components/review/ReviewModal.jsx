import { useState } from "react";
import api from "../../api/api";
import StarRating from "./StarRating";

function ReviewModal({
  isOpen,
  onClose,
  onSuccess,
  targetName,
  projectName,
  studentId,
  businessOwnerId,
  projectId,
  reviewerRole, // "student" | "business"
}) {
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (stars < 1 || stars > 5) {
      setErrorMsg("Please select a rating between 1 and 5 stars.");
      return;
    }

    if (!description.trim()) {
      setErrorMsg("Please write a short description for your review.");
      return;
    }

    setLoading(true);
    try {
      if (reviewerRole === "business") {
        await api.post("/review", {
          studentId,
          projectId,
          stars,
          description,
        });
      } else {
        await api.post("/review/student", {
          businessOwnerId,
          projectId,
          stars,
          description,
        });
      }

      onSuccess();
      setStars(0);
      setDescription("");
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1B2430]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#D8D2C4] rounded-[6px] shadow-[6px_6px_0px_#1B2430] w-full max-w-lg p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9B9384] hover:text-[#1B2430] text-xl font-bold cursor-pointer"
        >
          ✕
        </button>

        <h3 className="font-['Space_Grotesk'] font-bold text-xl mb-1 text-[#1B2430]">
          {reviewerRole === "business" ? "Review Student" : "Review Business Owner"}
        </h3>
        <p className="text-xs text-[#9B9384] font-['IBM_Plex_Mono'] uppercase tracking-wider mb-6">
          Project: {projectName}
        </p>

        {errorMsg && (
          <div className="mb-4 bg-[#FBE7E4] text-[#B3452F] border border-[#B3452F]/25 text-xs font-['IBM_Plex_Mono'] px-3.5 py-2.5 rounded-[4px] font-semibold">
            ⚠ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2 font-bold">
              Reviewing
            </span>
            <p className="font-semibold text-[15px] text-[#1B2430]">
              {targetName}
            </p>
          </div>

          <div>
            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2 font-bold">
              Rating
            </span>
            <StarRating rating={stars} onChange={setStars} size="w-7 h-7" />
          </div>

          <div>
            <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2 font-bold">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                reviewerRole === "business"
                  ? "How was your experience working with this student? Were skills up to mark? Did they meet deadlines?"
                  : "How was the communication and clarity? Was the project budget paid out correctly?"
              }
              rows={4}
              className="w-full text-sm bg-white border border-[#D8D2C4] rounded-[4px] p-3 text-[#1B2430] placeholder-[#9B9384] focus:outline-none focus:border-[#0F6B5C] font-['IBM_Plex_Sans'] resize-none leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#0F6B5C] text-white shadow-[3px_3px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
