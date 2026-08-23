import { useState } from "react";

function SubmitWorkModal({ initialLink = "", initialRemarks = "", onConfirm, onCancel, submitting }) {
  const [workLink, setWorkLink] = useState(initialLink);
  const [remarks, setRemarks] = useState(initialRemarks);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workLink.trim()) {
      setErrorMsg("Work link is required.");
      return;
    }
    setErrorMsg("");
    onConfirm({ workLink: workLink.trim(), remarks: remarks.trim() });
  };

  return (
    <div
      className="fixed inset-0 bg-[#1B2430]/60 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-[#D8D2C4] rounded-[6px] shadow-[6px_6px_0px_#1B2430] p-7"
      >
        <div
          className="w-11 h-11 flex items-center justify-center rounded-[6px] text-xl mb-5 rotate-[-2deg] bg-[#E9F5F1] text-[#0F6B5C]"
        >
          🚀
        </div>

        <h2 className="font-['Space_Grotesk'] font-bold text-xl mb-2">
          Submit Your Work
        </h2>

        <p className="text-[14px] text-[#6B6459] mb-5">
          Provide the link to your completed project files, repository, or workspace.
        </p>

        {errorMsg && (
          <div className="bg-[#FBE7E4] text-[#B3452F] text-xs font-['IBM_Plex_Mono'] px-3 py-2 rounded-[4px] mb-4 border border-[#F5C2B8]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1.5 font-semibold">
              Work Link *
            </label>
            <input
              type="url"
              value={workLink}
              onChange={(e) => setWorkLink(e.target.value)}
              placeholder="e.g. https://github.com/your-username/repo"
              required
              className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2 text-[14px]
                         focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                         transition-colors font-medium bg-white"
            />
          </div>

          <div>
            <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1.5 font-semibold">
              Remarks / Notes (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Describe the final implementation, instructions, or notes..."
              rows={3}
              className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2 text-[14px]
                         focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                         transition-colors font-medium bg-white resize-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                         hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#0F6B5C] text-white
                         shadow-[3px_3px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[2px]
                         hover:translate-y-[2px] transition-all duration-150 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Work"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitWorkModal;
