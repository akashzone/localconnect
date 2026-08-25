import StarRating from "./StarRating";

function RatingSummary({ averageRating = 0, totalReviews = 0 }) {
  const roundedRating = Number(averageRating).toFixed(1);

  return (
    <div className="bg-[#1B2430]/5 border border-[#D8D2C4] rounded-[6px] p-5 flex items-center justify-between gap-6 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="text-center bg-white border border-[#D8D2C4] rounded-[4px] px-4 py-2.5 shadow-[2px_2px_0px_#1B2430] min-w-[70px]">
          <span className="font-['Space_Grotesk'] font-bold text-2xl text-[#1B2430] block leading-none">
            {roundedRating}
          </span>
          <span className="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-wider text-[#9B9384] mt-1 block">
            out of 5
          </span>
        </div>

        <div className="space-y-1">
          <StarRating rating={Math.round(averageRating)} readOnly={true} size="w-4 h-4" />
          <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      <div className="hidden sm:block text-right">
        <p className="font-['Space_Grotesk'] font-bold text-sm text-[#0F6B5C]">
          {averageRating >= 4.5
            ? "Excellent reputation"
            : averageRating >= 3.5
            ? "Good reputation"
            : totalReviews > 0
            ? "Room to grow"
            : "No feedback yet"}
        </p>
        <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#9B9384] uppercase tracking-wider block mt-0.5">
          LocalConnect verified
        </span>
      </div>
    </div>
  );
}

export default RatingSummary;
