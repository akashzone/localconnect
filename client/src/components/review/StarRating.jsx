import { useState } from "react";

function StarRating({ rating = 0, onChange, readOnly = false, size = "w-5 h-5" }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (val) => {
    if (!readOnly && onChange) {
      onChange(val);
    }
  };

  const handleMouseEnter = (val) => {
    if (!readOnly) {
      setHoverRating(val);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const currentRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`${size} fill-current transition-colors duration-150 ${
            star <= currentRating ? "text-[#E2B714]" : "text-[#D8D2C4]"
          } ${!readOnly ? "cursor-pointer hover:scale-110 transform" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
        </svg>
      ))}
    </div>
  );
}

export default StarRating;
