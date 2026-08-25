import ReviewCard from "./ReviewCard";

function ReviewList({ reviews = [] }) {
  if (reviews.length === 0) {
    return (
      <div className="border border-dashed border-[#D8D2C4] rounded-[6px] p-8 text-center bg-white/20">
        <span className="text-2xl mb-2 block">💬</span>
        <p className="font-['IBM_Plex_Mono'] text-xs text-[#9B9384] tracking-wider uppercase">
          No reviews received yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
}

export default ReviewList;
