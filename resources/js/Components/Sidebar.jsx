import React, { useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

export default function Sidebar({
    items,
    mobileOnly = false,
    isCollapsed = false,
    toggleSidebar,
    currentPath,
}) {
    // Membuat referensi untuk container sidebar mobile
    const sidebarRef = useRef(null);

    // Mendefinisikan handler swipe menggunakan react-swipeable
    const handlers = useSwipeable({
        onSwipedLeft: () =>
            sidebarRef.current?.scrollBy({ left: 320, behavior: "smooth" }), // Geser 4 item (4 * 80px)
        onSwipedRight: () =>
            sidebarRef.current?.scrollBy({ left: -320, behavior: "smooth" }), // Geser 4 item ke kiri
        trackMouse: true, // Mengizinkan swipe dengan mouse juga
    });

    // Menyimpan posisi scroll ke sessionStorage saat sidebar digeser
    const handleScroll = () => {
        if (sidebarRef.current && mobileOnly) {
            sessionStorage.setItem(
                "sidebarScrollPosition",
                sidebarRef.current.scrollLeft
            );
        }
    };

    // Memulihkan posisi scroll saat komponen dimuat
    useEffect(() => {
        if (mobileOnly && sidebarRef.current) {
            const savedScrollPosition =
                sessionStorage.getItem("sidebarScrollPosition") || 0;
            sidebarRef.current.scrollLeft = parseInt(savedScrollPosition, 10);

            // Menambahkan event listener untuk scroll
            const sidebarElement = sidebarRef.current;
            sidebarElement.addEventListener("scroll", handleScroll);

            // Cleanup: hapus event listener saat komponen unmount
            return () => {
                sidebarElement.removeEventListener("scroll", handleScroll);
            };
        }
    }, [mobileOnly]);

    // Kelas dasar untuk sidebar berdasarkan mode (mobile atau desktop)
    const baseClass = mobileOnly
        ? "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-10 md:hidden"
        : `bg-white border-r border-gray-200 shadow-md hidden md:flex flex-col transition-all duration-300 ${
              isCollapsed ? "w-16" : "w-64"
          }`;

    return (
        <div className={baseClass}>
            {/* Header Sidebar (Hanya untuk Desktop) */}
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

            {/* Container untuk Item Sidebar */}
            <div
                ref={mobileOnly ? sidebarRef : null} // Ref hanya untuk mobile
                {...(mobileOnly ? handlers : {})} // Handler swipe hanya untuk mobile
                className={
                    mobileOnly
                        ? "flex overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory p-2 max-w-[320px] mx-auto"
                        : "flex flex-col p-4 space-y-4 h-full"
                }
            >
                {items.map((item) => {
                    const isActive =
                        currentPath === item.href ||
                        currentPath.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex ${
                                mobileOnly
                                    ? "flex-col w-20 flex-shrink-0 snap-start"
                                    : isCollapsed
                                    ? "justify-center"
                                    : "flex-row gap-3"
                            } items-center p-3 rounded-md transition-all duration-200 ${
                                mobileOnly ? "text-center space-y-1" : ""
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
                            {!mobileOnly && !isCollapsed && (
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
