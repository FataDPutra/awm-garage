import React, { useRef } from "react";
import { useSwipeable } from "react-swipeable";
import {
    FaHourglassStart,
    FaCheckCircle,
    FaShippingFast,
    FaUserCheck,
    FaTimesCircle,
    FaExclamationTriangle,
    FaMoneyCheckAlt,
    FaClipboardCheck,
    FaTruck,
    FaCheck,
    FaRedo,
} from "react-icons/fa";
import { Package2 } from "lucide-react";
import { BiSolidPackage } from "react-icons/bi";

const statusConfig = {
    all: {
        label: "Semua",
        icon: <FaCheckCircle className="text-gray-500" />,
        bgColor: "bg-gray-500",
    },
    waiting_for_payment: {
        label: "Belum Bayar",
        icon: <FaMoneyCheckAlt className="text-orange-500" />,
        bgColor: "bg-orange-500",
    },
    processing: {
        label: "Diproses",
        icon: <FaHourglassStart className="text-yellow-500" />,
        bgColor: "bg-yellow-500",
    },
    waiting_for_cust_confirmation: {
        label: "Menunggu Konfirmasi",
        icon: <FaUserCheck className="text-blue-500" />,
        bgColor: "bg-blue-500",
    },
    waiting_for_customer_shipment: {
        label: "Menunggu Pengiriman Customer",
        icon: <FaShippingFast className="text-indigo-500" />,
        bgColor: "bg-indigo-500",
    },
    waiting_for_admin_confirmation: {
        label: "Menunggu Konfirmasi Admin",
        icon: <FaClipboardCheck className="text-teal-500" />,
        bgColor: "bg-teal-500",
    },
    waiting_for_shipment: {
        label: "Menunggu Pengiriman",
        icon: <BiSolidPackage className="text-purple-500" />,
        bgColor: "bg-purple-500",
    },
    shipped: {
        label: "Dikirim",
        icon: <FaTruck className="text-cyan-500" />,
        bgColor: "bg-cyan-500",
    },
    customer_complain: {
        label: "Komplain",
        icon: <FaExclamationTriangle className="text-red-500" />,
        bgColor: "bg-red-500",
    },
    approved: {
        label: "Disetujui",
        icon: <FaCheck className="text-green-600" />,
        bgColor: "bg-green-600",
    },
    completed: {
        label: "Selesai",
        icon: <FaCheckCircle className="text-green-500" />,
        bgColor: "bg-green-500",
    },
};

export default function StatusSelector({ selectedStatus, setSelectedStatus }) {
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

export { statusConfig };
