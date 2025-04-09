import React from "react";
import { Link } from "@inertiajs/react";

export default function Button({ href, icon, label, active = false }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-md transition-all duration-200 ${
                active
                    ? "bg-blue-700 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
            }`}
        >
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}
