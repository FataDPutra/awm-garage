const PortfolioSlide = ({
    portfolios,
    currentPortfolio,
    setCurrentPortfolio,
}) => {
    return (
        <div className="relative overflow-hidden">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(-${currentPortfolio * (100 / 4)}%)`,
                    width: `${portfolios.length * 25}%`,
                }}
            >
                {portfolios.map((img, index) => (
                    <div key={index} className="w-1/4 flex-shrink-0 px-2">
                        <img
                            src={img}
                            alt={`Portfolio ${index + 1}`}
                            className="h-64 w-full rounded-lg object-cover transition-transform hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
                {portfolios.map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                            currentPortfolio === index
                                ? "bg-blue-600"
                                : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentPortfolio(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PortfolioSlide;
