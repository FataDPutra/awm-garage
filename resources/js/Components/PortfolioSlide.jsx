import { useEffect, useState } from "react";

const PortfolioSlide = ({ portfolios }) => {
    const [currentPortfolio, setCurrentPortfolio] = useState(0);
    const imagesPerPageDesktop = 3; // Number of images to show on desktop
    const imagesPerPageMobile = 1; // Number of images to show on mobile

    // Determine how many images to show based on screen size
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

    // Auto-swipe logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPortfolio((prev) => (prev + 1) % totalSlides);
        }, 4000); // 4 seconds for smooth auto-swipe
        return () => clearInterval(interval);
    }, [totalSlides]);

    // Handle manual navigation
    const goToSlide = (index) => {
        setCurrentPortfolio(index);
    };

    return (
        <div className="relative overflow-hidden">
            {/* Slider Container */}
            <div
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

            {/* Navigation Dots - Hidden on mobile, shown on desktop */}
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
