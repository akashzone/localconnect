

function WithdrawModal({ projectTitle, onConfirm, onCancel, withdrawing }) {
    return (
        <div
            className="fixed inset-0 bg-[#1B2430]/60 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4"
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-white border border-[#D8D2C4] rounded-[6px] shadow-[6px_6px_0px_#1B2430] p-7"
            >
                <div className="w-11 h-11 flex items-center justify-center rounded-[6px] bg-[#FBE7E4] text-[#B3452F]
                        text-xl mb-5 rotate-[-2deg]">
                    ⚠
                </div>

                <h2 className="font-['Space_Grotesk'] font-bold text-xl mb-2">
                    Withdraw application?
                </h2>

                <p className="text-[14px] text-[#4A473F] leading-relaxed mb-1">
                    You're about to withdraw your application for
                </p>
                <p className="font-['Space_Grotesk'] font-bold text-[15px] mb-6">
                    "{projectTitle}"
                </p>

                <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#9B9384] mb-7">
                    This can't be undone. You'll need to reapply if you change your mind.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={withdrawing}
                        className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                       hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 disabled:opacity-50"
                    >
                        Keep it
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={withdrawing}
                        className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#B3452F] text-white
                       shadow-[3px_3px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-150 disabled:opacity-50"
                    >
                        {withdrawing ? "Withdrawing..." : "Withdraw"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WithdrawModal;