import { useState } from "react";
import api from "../api/api";

const REPORT_REASONS = [
  "Fraud / Scam",
  "Harassment",
  "Inappropriate Behavior",
  "Fake Profile",
  "Spam",
  "Payment Issue",
  "Project Issue",
  "Work Quality Issue",
  "Suspicious Activity",
  "Other"
];

function ReportModal({
  reportedUserId = null,
  projectId = null,
  applicationId = null,
  reviewId = null,
  targetName = "",
  onClose
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!reason) {
      setErrorMsg("Please select a report reason.");
      return;
    }

    const trimmedDesc = description.trim();
    if (trimmedDesc.length < 10) {
      setErrorMsg("Description must be at least 10 characters.");
      return;
    }

    if (trimmedDesc.length > 1000) {
      setErrorMsg("Description cannot exceed 1000 characters.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/reports", {
        reportedUserId,
        projectId,
        applicationId,
        reviewId,
        reason,
        description: trimmedDesc
      });

      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        throw new Error(res.data?.message || "Failed to submit report.");
      }
    } catch (err) {
      console.error("Report submission error:", err);
      setErrorMsg(
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#1B2430]/60 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-[#D8D2C4] rounded-[6px] shadow-[6px_6px_0px_#1B2430] p-7"
      >
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-[#E9F5F1] text-[#0F6B5C] border border-[#B8E2D8] rounded-[6px] flex items-center justify-center text-2xl mx-auto rotate-[-2deg] shadow-sm">
              ✓
            </div>
            <h2 className="font-['Space_Grotesk'] font-bold text-xl text-[#1B2430]">
              Report Submitted
            </h2>
            <p className="text-sm text-[#6B6459] leading-relaxed max-w-xs mx-auto">
              Report submitted successfully. LocalConnect administrators will review this issue.
            </p>
          </div>
        ) : (
          <>
            <div className="w-11 h-11 bg-[#FBE7E4] text-[#B3452F] border border-[#F5C2B8] rounded-[6px] flex items-center justify-center text-xl mb-5 rotate-[-2deg]">
              ⚠️
            </div>

            <h2 className="font-['Space_Grotesk'] font-bold text-xl mb-2 text-[#1B2430]">
              Report Issue
            </h2>

            <p className="text-[13.5px] text-[#6B6459] mb-5 leading-relaxed">
              Help us keep LocalConnect safe. Report inappropriate behavior, scams, or other policy violations.
              {targetName && (
                <span className="block mt-1 font-medium text-[#1B2430]">
                  Target: {targetName}
                </span>
              )}
            </p>

            {errorMsg && (
              <div className="bg-[#FBE7E4] text-[#B3452F] text-xs font-['IBM_Plex_Mono'] px-3 py-2 rounded-[4px] mb-4 border border-[#F5C2B8]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-['IBM_Plex_Sans']">
              <div>
                <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1.5 font-semibold">
                  Reason / Category *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[14px]
                             focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                             transition-colors font-medium bg-[#FAF8F3] text-[#1B2430]"
                >
                  <option value="" disabled>Select report reason</option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] font-semibold">
                    Description / Details *
                  </label>
                  <span className="font-['IBM_Plex_Mono'] text-[9.5px] text-[#9B9384]">
                    {description.length}/1000
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details about the inappropriate behavior, scam, or dispute..."
                  rows={4}
                  required
                  className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2 text-[14px]
                             focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                             transition-colors font-medium bg-white text-[#1B2430] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                             hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] text-white bg-[#B3452F] hover:bg-[#963725]
                             shadow-[3px_3px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[2px]
                             hover:translate-y-[2px] transition-all duration-150 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportModal;
