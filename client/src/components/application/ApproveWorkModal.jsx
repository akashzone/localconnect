function ApproveWorkModal({ onConfirm, onCancel, submitting }) {
  return (
    <div
      className="fixed inset-0 bg-[#1B2430]/60 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white border border-[#D8D2C4] rounded-[6px] shadow-[6px_6px_0px_#1B2430] p-7"
      >
        <div
          className="w-11 h-11 flex items-center justify-center rounded-[6px] text-xl mb-5 rotate-[-2deg] bg-[#E9F5F1] text-[#0F6B5C]"
        >
          ✓
        </div>

        <h2 className="font-['Space_Grotesk'] font-bold text-xl mb-2">
          Approve Work?
        </h2>

        <p className="text-[14px] text-[#4A473F] leading-relaxed mb-4">
          Are you sure you want to approve this submission?
        </p>

        <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#9B9384] mb-7">
          Once approved, this project will be marked as completed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                       hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#0F6B5C] text-white
                       shadow-[3px_3px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[2px]
                       hover:translate-y-[2px] transition-all duration-150 disabled:opacity-50"
          >
            {submitting ? "Approving..." : "Approve Work"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApproveWorkModal;
