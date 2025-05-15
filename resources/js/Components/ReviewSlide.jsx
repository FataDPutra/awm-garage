import { useEffect, useState } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable"; // Impor library swipe

const ReviewSlide = () => {
    const [reviews, setReviews] = useState([]);
    const [currentReview, setCurrentReview] = useState(0);
    const reviewsPerPageDesktop = 2;
    const reviewsPerPageMobile = 1;

    const [reviewsPerPage, setReviewsPerPage] = useState(
        window.innerWidth >= 640 ? reviewsPerPageDesktop : reviewsPerPageMobile
    );

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get("/reviews");
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviews([]);
            }
        };
        fetchReviews();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setReviewsPerPage(
                window.innerWidth >= 640
                    ? reviewsPerPageDesktop
                    : reviewsPerPageMobile
            );
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const totalSlides = Math.ceil(reviews.length / reviewsPerPage);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % totalSlides);
        }, 5000);
        return () => clearInterval(interval);
    }, [totalSlides]);

    const goToSlide = (index) => {
        setCurrentReview(index);
    };

    const goToPrevious = () => {
        setCurrentReview((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToNext = () => {
        setCurrentReview((prev) => (prev + 1) % totalSlides);
    };

    // Tambahkan handler untuk swipe
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => goToNext(),
        onSwipedRight: () => goToPrevious(),
        trackMouse: true, // Mengizinkan drag dengan mouse
        delta: 10, // Minimum jarak swipe untuk trigger
    });

    const getStarIndexes = (rating) => {
        const totalStars = 5;
        const filledStars = Math.min(rating, totalStars);
        const startIndex = Math.floor((totalStars - filledStars) / 2);
        const filledIndexes = Array.from(
            { length: filledStars },
            (_, i) => startIndex + i
        );
        return filledIndexes;
    };

    return (
        <div className="relative overflow-hidden">
            {/* Tombol Panah Kiri */}
            <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-3 focus:outline-none"
                aria-label="Previous Slide"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* Slider Container dengan Swipe */}
            <div
                {...swipeHandlers}
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(-${currentReview * 100}%)`,
                }}
            >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        className="w-full flex-shrink-0 flex justify-center items-start gap-6 sm:gap-8 px-4 sm:px-6"
                    >
                        {reviews
                            .slice(
                                slideIndex * reviewsPerPage,
                                (slideIndex + 1) * reviewsPerPage
                            )
                            .map((review) => (
                                <div
                                    key={review.id}
                                    className="w-full max-w-[280px] sm:max-w-[400px] mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg"
                                >
                                    <div className="flex flex-col items-center p-6">
                                        <div className="w-full h-48 flex items-center justify-center bg-zinc-900 rounded-2xl overflow-hidden">
                                            <img
                                                src={review.image}
                                                alt={`Review Result by ${review.name}`}
                                                className="max-h-full max-w-full object-contain rounded-2xl"
                                                loading="lazy"
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/portofolio/default.png")
                                                }
                                            />
                                        </div>
                                        <p className="mt-4 text-lg font-medium text-black dark:text-white text-center">
                                            {review.name}
                                        </p>
                                        <div className="mt-3 flex justify-center gap-1">
                                            {[...Array(5)].map((_, i) => {
                                                const filledIndexes =
                                                    getStarIndexes(
                                                        review.rating
                                                    );
                                                return (
                                                    <svg
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                            filledIndexes.includes(
                                                                i
                                                            )
                                                                ? "text-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                );
                                            })}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 italic line-clamp-3 text-center">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            {/* Tombol Panah Kanan */}
            <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-3 focus:outline-none"
                aria-label="Next Slide"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* Navigation Dots */}
            <div className="hidden sm:flex justify-center gap-3 mt-6 pb-4">
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                        key={index}
                        className={`h-3 w-3 rounded-full transition ${
                            currentReview === index
                                ? "bg-blue-600"
                                : "bg-gray-300"
                        }`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewSlide;
