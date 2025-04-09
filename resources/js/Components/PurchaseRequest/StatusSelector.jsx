import React, { useRef } from "react";
import { useSwipeable } from "react-swipeable";

export default function StatusSelector({
    selectedStatus,
    setSelectedStatus,
    statusConfig,
}) {
    const statusContainerRef = useRef(null);

    const handlers = useSwipeable({
        onSwipedLeft: () =>
            statusContainerRef.current?.scrollBy({
                left: 90,
                behavior: "smooth",
            }),
        onSwipedRight: () =>
            statusContainerRef.current?.scrollBy({
                left: -90,
                behavior: "smooth",
            }),
        trackMouse: true,
    });

    return (
        <div
            ref={statusContainerRef}
            {...handlers}
            className="mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory max-w-[280px] sm:overflow-x-visible sm:max-w-full"
        >
            <div className="inline-flex gap-2 border-b border-gray-200 pb-2">
                {Object.keys(statusConfig).map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`flex flex-col items-center w-[90px] py-2 text-center snap-start flex-shrink-0 ${
                            selectedStatus === status
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500"
                        }`}
                    >
                        <span className="text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">
                            {statusConfig[status].label}
                        </span>
                        <span className="mt-1">
                            {React.cloneElement(statusConfig[status].icon, {
                                className: `${
                                    selectedStatus === status
                                        ? "text-blue-600"
                                        : statusConfig[status].icon.props
                                              .className
                                } text-base`,
                            })}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
