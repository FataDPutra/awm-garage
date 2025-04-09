import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({
    items,
    mobileOnly = false,
    isCollapsed = false,
    toggleSidebar,
    currentPath,
}) {
    const baseClass = mobileOnly
        ? "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-10 md:hidden"
        : `bg-white border-r border-gray-200 shadow-md hidden md:flex flex-col transition-all duration-300 ${
              isCollapsed ? "w-16" : "w-64"
          }`;

    return (
        <div className={baseClass}>
            {/* Header Sidebar (Desktop Only) */}
            {!mobileOnly && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    {!isCollapsed && (
                        <div className="flex-1 text-center font-semibold text-gray-700">
                            Menu
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                        {isCollapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>
                </div>
            )}

            {/* Sidebar Items */}
            <div
                className={
                    mobileOnly
                        ? "flex justify-around p-2"
                        : "flex flex-col p-4 space-y-4 h-full"
                }
            >
                {items.map((item) => {
                    // Logika aktif: Cocokkan eksak atau jika currentPath dimulai dengan item.href
                    const isActive =
                        currentPath === item.href ||
                        currentPath.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center p-3 rounded-md transition-all duration-200 ${
                                mobileOnly
                                    ? "flex-col text-center space-y-1"
                                    : isCollapsed
                                    ? "justify-center"
                                    : "flex-row gap-3"
                            } ${
                                isActive
                                    ? "text-blue-600 bg-blue-50 font-semibold"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {mobileOnly && (
                                <span className="text-xs font-medium">
                                    {item.label}
                                </span>
                            )}
                            {!isCollapsed && !mobileOnly && (
                                <span className="font-medium text-sm">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
