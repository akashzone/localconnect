import { useState, useContext } from "react";
import api from "../../api/api.js";
import { AuthContext } from "../../context/AuthContext";

function ApplicationForm({ projectId, projectTitle, onClose, onSuccess }) {
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    coverLetter: "",
    estimatedDuration: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.coverLetter.trim() || !formData.estimatedDuration.trim()) {
      return setErrorMsg("All fields are required");
    }

    try {
      setSubmitting(true);
      const res = await api.post(
        "/applications",
        {
          projectId,
          coverLetter: formData.coverLetter,
          estimatedDuration: formData.estimatedDuration,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess(res.data.data);
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response?.data?.message || "Failed to submit application");
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
        className="w-full max-w-lg bg-white border border-[#D8D2C4] rounded-[6px] shadow-[6px_6px_0px_#1B2430]
                   max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 sm:p-8 pb-0">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#0F6B5C]">
              Apply to
            </span>
            <h2 className="font-['Space_Grotesk'] font-bold text-2xl mt-1 leading-snug">
              {projectTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-[4px] border border-[#D8D2C4]
                       text-[#6B6459] hover:text-[#1B2430] hover:border-[#1B2430] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 pt-6 space-y-5">
          <div>
            <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
              Cover Letter
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={5}
              placeholder="Tell them why you're a good fit for this project..."
              className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px] resize-none
                         focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                         transition-colors"
            />
          </div>

          <div>
            <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
              Estimated Duration
            </label>
            <input
              type="text"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              placeholder="e.g. 3 weeks"
              className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                         focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                         transition-colors"
            />
          </div>

          {errorMsg && (
            <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#B3452F]">
              {errorMsg}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-semibold text-sm px-4 py-3 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                         hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 font-semibold text-sm px-4 py-3 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;