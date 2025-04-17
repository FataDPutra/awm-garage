import { Head, Link } from "@inertiajs/react";
import { portfolios, services, advantages } from "./data";
import ServiceCard from "@/Components/ServiceCard";
import ReviewSlide from "@/Components/ReviewSlide";
import PortfolioSlide from "@/Components/PortfolioSlide";
import React, { useState } from "react";

export default function Welcome({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    return (
        <>
            <Head title="Welcome to AWM Garage" />
            <div className="min-h-screen bg-gray-50 text-black/80 dark:bg-black dark:text-white/80 font-sans">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-zinc-900">
                    <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-4">
                        <div className="flex items-center justify-between w-full sm:w-auto">
                            <div className="flex items-center">
                                <Link
                                    href="/"
                                    className="flex shrink-0 items-center"
                                >
                                    <img
                                        src="/logo-awm.svg"
                                        alt="AWM Garage Logo"
                                        className="h-12 w-auto"
                                    />
                                    <span className="ml-3 text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        AWM Garage
                                    </span>
                                </Link>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="sm:hidden text-gray-700 dark:text-white focus:outline-none"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={
                                            mobileMenuOpen
                                                ? "M6 18L18 6M6 6l12 12"
                                                : "M4 6h16M4 12h16M4 18h16"
                                        }
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Desktop & Mobile Menu */}
                        <nav
                            className={`${
                                mobileMenuOpen ? "flex" : "hidden"
                            } sm:flex flex-col sm:flex-row sm:items-center w-full sm:w-auto mt-4 sm:mt-0`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 w-full">
                                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-1">
                                    {[
                                        "profil",
                                        "fitur",
                                        "kelebihan",
                                        "portfolio",
                                        "review",
                                        "location",
                                        "kontak",
                                    ].map((section) => (
                                        <button
                                            key={section}
                                            onClick={() =>
                                                scrollToSection(section)
                                            }
                                            className="relative rounded-md px-3 py-2 text-sm font-medium text-black dark:text-white 
                                            transition-all duration-300 ease-in-out 
                                            hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400 
                                            active:bg-blue-200 active:text-blue-700 dark:active:bg-zinc-700 dark:active:text-blue-300 
                                            text-left sm:text-center 
                                            group"
                                        >
                                            {section.charAt(0).toUpperCase() +
                                                section.slice(1)}
                                            {/* Underline effect on hover */}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    {auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white 
                                            transition-all duration-300 ease-in-out 
                                            hover:bg-blue-700 hover:shadow-lg hover:scale-105 
                                            active:bg-blue-800 active:shadow-md active:scale-100 
                                            text-center"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                className="rounded-md px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 
                                                border border-blue-600 dark:border-blue-400 
                                                transition-all duration-300 ease-in-out 
                                                hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-black 
                                                hover:shadow-md hover:scale-105 
                                                active:bg-blue-700 active:text-white dark:active:bg-blue-500 
                                                active:shadow-sm active:scale-100 
                                                text-center"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-400 
                                                transition-all duration-300 ease-in-out 
                                                hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-lg hover:scale-105 
                                                active:bg-blue-800 dark:active:bg-blue-600 active:shadow-md active:scale-100 
                                                text-center"
                                            >
                                                Daftar
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section
                    className="relative flex h-[60vh] min-h-[400px] items-center justify-center bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero-garage.png')" }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative z-10 text-center text-white px-4">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Selamat Datang di AWM Garage
                        </h1>
                        <p className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
                            Spesialis Vaporblasting, Powder Coating,
                            Sandblasting, Modification, Restoration, dan Parts &
                            Custom
                        </p>
                        <button
                            onClick={() => (window.location.href = "/register")}
                            className="mt-6 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white 
                            transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:scale-105"
                        >
                            Pesan Sekarang
                        </button>
                    </div>
                </section>

                {/* Profil Perusahaan */}
                <section id="profil" className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-8">
                            Tentang AWM Garage
                        </h2>
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            <img
                                src="/profile-image.png"
                                alt="AWM Garage Team"
                                className="h-64 w-full rounded-lg object-cover md:w-1/2"
                            />
                            <p className="text-base text-gray-700 dark:text-gray-300 md:w-1/2">
                                AWM Garage adalah bengkel spesialis yang telah
                                berdiri sejak 2013, fokus pada layanan
                                vaporblasting, sandblasting, dan
                                powdercoating...
                            </p>
                        </div>
                    </div>
                </section>

                {/* Layanan Unggulan */}
                <section
                    id="fitur"
                    className="py-16 bg-gray-100 dark:bg-zinc-800"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-8">
                            Layanan Unggulan Kami
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, index) => (
                                <ServiceCard key={index} {...service} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Kelebihan Pemesanan */}
                <section id="kelebihan" className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-8">
                            Mengapa Memesan Lewat Web Kami?
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {advantages.map((advantage, index) => (
                                <ServiceCard key={index} {...advantage} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Galeri Portofolio */}
                <section
                    id="portfolio"
                    className="py-16 bg-gray-100 dark:bg-zinc-800"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-8">
                            Hasil Kerja Kami
                        </h2>
                        <div className="max-w-6xl mx-auto">
                            <PortfolioSlide portfolios={portfolios} />
                        </div>
                    </div>
                </section>

                {/* Review Pelanggan */}
                <section id="review" className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-8">
                            Apa Kata Pelanggan Kami
                        </h2>
                        <div className="relative mx-auto max-w-5xl bg-transparent">
                            <ReviewSlide />
                        </div>
                    </div>
                </section>

                {/* Lokasi Bengkel */}
                <section
                    id="location"
                    className="py-16 bg-gray-100 dark:bg-zinc-800"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-8">
                            Lokasi AWM Garage
                        </h2>
                        <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.731741937498!2d110.39292557524648!3d-7.156981892847513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708755b1c39bc9%3A0x5087d3a6f9a5613d!2sAWMgarage!5e0!3m2!1sen!2sid!4v1741879889717!5m2!1sen!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                            Kunjungi kami di: Jl. Mendut Raya, RT.4/RW.3,
                            Siroto, Candirejo, Ungaran Barat, Semarang Regency,
                            Central Java
                        </p>
                    </div>
                </section>

                {/* Kontak */}
                <section id="kontak" className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-8">
                            Hubungi Kami
                        </h2>
                        <div className="max-w-2xl mx-auto text-center">
                            <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                                Punya pertanyaan atau ingin memesan layanan?
                                Hubungi kami melalui salah satu kontak di bawah
                                ini!
                            </p>
                            <div className="flex flex-col gap-4 items-center">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/icons/phone.png"
                                        alt="Phone Icon"
                                        className="h-6 w-6"
                                    />
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        +62 896 3889 2960
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/icons/gmail.png"
                                        alt="Email Icon"
                                        className="h-6 w-6"
                                    />
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        aguswijaiia95@gmail.com
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/icons/instagram.png"
                                        alt="Instagram Icon"
                                        className="h-6 w-6"
                                    />
                                    <a
                                        href="https://www.instagram.com/wijaiagus/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        @wiijaiaagus
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/icons/whatsapp.png"
                                        alt="WhatsApp Icon"
                                        className="h-6 w-6"
                                    />
                                    <a
                                        href="https://wa.me/6289638892960"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Chat via WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-blue-600 py-8 text-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm">
                            Fata D Putra © {new Date().getFullYear()} | AWM
                            Garage
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
