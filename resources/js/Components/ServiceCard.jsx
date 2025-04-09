// ServiceCard.jsx
const ServiceCard = ({ icon, title, desc }) => {
    return (
        <div className="rounded-lg bg-white p-6 shadow-lg transition hover:shadow-xl dark:bg-zinc-900">
            <img
                src={icon}
                alt={`${title} Icon`}
                className="mx-auto h-12 w-12"
                loading="lazy"
            />
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white text-center">
                {title}
            </h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center">
                {desc}
            </p>
        </div>
    );
};

export default ServiceCard;
