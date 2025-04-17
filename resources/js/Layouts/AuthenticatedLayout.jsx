import React, { useState } from "react";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import Sidebar from "@/Components/Sidebar";
import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    PlusCircle,
    ClipboardList,
    FileText,
    Package,
    Paintbrush,
    User,
    BarChart2,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { url } = usePage();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const sidebarItems = [
        { href: "/dashboard", label: "Home", icon: <Home size={20} /> },
        ...(user.role === "customer"
            ? [
                  {
                      href: "/purchase-requests",
                      label: "Buat Pesanan",
                      icon: <FileText size={20} />,
                  },
                  {
                      href: "/orders",
                      label: "Pesanan",
                      icon: <Package size={20} />,
                  },
              ]
            : [
                  {
                      href: "/purchaserequests",
                      label: "Pemesanan",
                      icon: <FileText size={20} />,
                  },
                  {
                      href: "/admin/orders",
                      label: "Pesanan",
                      icon: <Package size={20} />,
                  },
                  {
                      href: "/admin/reports",
                      label: "Laporan",
                      icon: <BarChart2 size={20} />,
                  },
                  {
                      href: "/services",
                      label: "Layanan",
                      icon: <Paintbrush size={20} />,
                  },
              ]),
        {
            href: "/profile",
            label: "Profile",
            icon: <User size={20} />,
        },
    ];

    const generateBreadcrumb = () => {
        const pathSegments = url.split("/").filter((segment) => segment);
        let breadcrumb = ["Dashboard"];

        const breadcrumbMap = {
            dashboard: "Dashboard",
            "purchase-requests": "Pemesanan",
            purchaserequests: "Pemesanan",
            create: "Buat",
            edit: "Ubah",
            show: "Detail",
            orders: "Pesanan",
            services: "Layanan",
            payments: "Pembayaran",
            shippings: "Pengiriman",
            reports: "Laporan",
            profile: "Profile",
            locations: "Locations",
        };

        pathSegments.forEach((segment, index) => {
            if (breadcrumbMap[segment]) {
                if (segment === "dashboard" && index === 0) return;
                breadcrumb.push(breadcrumbMap[segment]);
            } else if (!isNaN(segment)) {
                breadcrumb.push("Detail");
            }
        });

        return breadcrumb.join(" / ");
    };

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="flex shrink-0 items-center"
                            >
                                <img
                                    src="/logo-awm.svg"
                                    alt="AWM Garage Logo"
                                    className="h-10 w-auto"
                                />
                                <span className="ml-3 text-xl font-bold text-blue-600">
                                    AWM Garage
                                </span>
                            </Link>
                            <span className="ml-4 text-sm text-gray-600 hidden sm:block">
                                {generateBreadcrumb()}
                            </span>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6 space-x-4">
                            <User size={20} className="text-gray-600" />
                            <span className="text-gray-700 font-medium">
                                {user.username}
                            </span>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md"
                            >
                                Log Out
                            </Link>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        !showingNavigationDropdown
                                    )
                                }
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden bg-white shadow-md"
                    }
                >
                    <div className="pb-4 pt-4 px-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-3">
                                {user.username}
                            </div>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 w-full"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex min-h-screen bg-gray-50">
                <Sidebar
                    items={sidebarItems}
                    mobileOnly={false}
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                    currentPath={url}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-0">
                    {header && (
                        <header className="bg-white shadow-md mb-6 rounded-xl">
                            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    {children}
                </main>
                <Sidebar
                    items={sidebarItems}
                    mobileOnly={true}
                    isCollapsed={false}
                    currentPath={url}
                />
            </div>
        </div>
    );
}
