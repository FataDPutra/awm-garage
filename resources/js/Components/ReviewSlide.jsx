// ReviewSlide.jsx
const ReviewSlide = ({ review, isActive }) => {
    return (
        <div
            className={`w-full flex-shrink-0 px-8 py-6 text-center transition-opacity duration-500 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0 absolute"
            }`}
        >
            <img
                src={review.image}
                alt={`Review Result by ${review.name}`}
                className="mx-auto h-64 w-full max-w-md rounded-lg object-cover mb-6"
                loading="lazy"
            />
            <p className="text-lg font-medium text-black dark:text-white">
                {review.name}
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 italic line-clamp-3">
                "{review.comment}"
            </p>
            <div className="mt-3 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <img
                        key={i}
                        src="/icons/star.png"
                        alt="Star Icon"
                        className="h-4 w-4"
                        loading="lazy"
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewSlide;
