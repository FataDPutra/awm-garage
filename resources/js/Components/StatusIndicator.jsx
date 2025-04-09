import React from "react";
import { statusConfig } from "./StatusSelector";

export default function StatusIndicator({ selectedStatus }) {
    return (
        <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
                Status Dipilih:
            </span>
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${statusConfig[selectedStatus].bgColor}`}
            >
                {React.cloneElement(statusConfig[selectedStatus].icon, {
                    className: "mr-2",
                })}
                {statusConfig[selectedStatus].label}
            </span>
        </div>
    );
}
