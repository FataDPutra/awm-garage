import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable"; // Impor library swipe

const PortfolioSlide = ({ portfolios }) => {
    const [currentPortfolio, setCurrentPortfolio] = useState(0);
    const imagesPerPageDesktop = 3;
    const imagesPerPageMobile = 1;

    const [imagesPerPage, setImagesPerPage] = useState(
        window.innerWidth >= 640 ? imagesPerPageDesktop : imagesPerPageMobile
    );

    useEffect(() => {
        const handleResize = () => {
            setImagesPerPage(
                window.innerWidth >= 640
                    ? imagesPerPageDesktop
                    : imagesPerPageMobile
            );
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const totalSlides = Math.ceil(portfolios.length / imagesPerPage);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPortfolio((prev) => (prev + 1) % totalSlides);
        }, 4000);
        return () => clearInterval(interval);
    }, [totalSlides]);

    const goToSlide = (index) => {
        setCurrentPortfolio(index);
    };

    const goToPrevious = () => {
        setCurrentPortfolio((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToNext = () => {
        setCurrentPortfolio((prev) => (prev + 1) % totalSlides);
    };

    // Tambahkan handler untuk swipe
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => goToNext(),
        onSwipedRight: () => goToPrevious(),
        trackMouse: true, // Mengizinkan drag dengan mouse
        delta: 10, // Minimum jarak swipe untuk trigger
    });

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
                    transform: `translateX(-${currentPortfolio * 100}%)`,
                }}
            >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        className="w-full flex-shrink-0 flex justify-center items-center sm:gap-6"
                    >
                        {portfolios
                            .slice(
                                slideIndex * imagesPerPage,
                                (slideIndex + 1) * imagesPerPage
                            )
                            .map((img, index) => (
                                <div
                                    key={index}
                                    className="w-full sm:w-1/3 px-2 sm:px-4"
                                >
                                    <div className="relative w-full max-w-xs mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
                                        <img
                                            src={img}
                                            alt={`Portfolio ${
                                                slideIndex * imagesPerPage +
                                                index +
                                                1
                                            }`}
                                            className="w-full h-auto rounded-lg object-cover transition-transform hover:scale-105"
                                            loading="lazy"
                                        />
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
            <div className="hidden sm:flex justify-center gap-3 mt-6">
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                        key={index}
                        className={`h-3 w-3 rounded-full transition ${
                            currentPortfolio === index
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

export default PortfolioSlide;
