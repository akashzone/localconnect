import { useState } from "react";

function RequestChangesModal({ onConfirm, onCancel, submitting }) {
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg("Message is required.");
      return;
    }
    setErrorMsg("");
    onConfirm(message.trim());
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
          className="w-11 h-11 flex items-center justify-center rounded-[6px] text-xl mb-5 rotate-[-2deg] bg-[#FBE7E4] text-[#B3452F]"
        >
          ✏️
        </div>

        <h2 className="font-['Space_Grotesk'] font-bold text-xl mb-2">
          Request Changes
        </h2>

        <p className="text-[14px] text-[#6B6459] mb-5">
          Tell the student what needs to be changed before resubmitting the work.
        </p>

        {errorMsg && (
          <div className="bg-[#FBE7E4] text-[#B3452F] text-xs font-['IBM_Plex_Mono'] px-3 py-2 rounded-[4px] mb-4 border border-[#F5C2B8]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1.5 font-semibold">
              Describe the changes required... *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Please update the checkout flow and add the missing mobile responsive screens."
              rows={4}
              required
              className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2 text-[14px]
                         focus:outline-none focus:border-[#B3452F] focus:ring-2 focus:ring-[#B3452F]/15
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
              className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#B3452F] text-white
                         shadow-[3px_3px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[2px]
                         hover:translate-y-[2px] transition-all duration-150 disabled:opacity-50"
            >
              {submitting ? "Requesting..." : "Request Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestChangesModal;
