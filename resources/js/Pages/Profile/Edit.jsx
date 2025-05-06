import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import VerifyPhoneForm from "./Partials/VerifyPhoneForm";

export default function Edit({ auth, mustVerifyEmail, status, user }) {
    const [activeSection, setActiveSection] = useState("profile");

    const sections = [
        {
            id: "profile",
            title: "Informasi Profil",
            component: UpdateProfileInformationForm,
            props: { mustVerifyEmail, status, user },
        },
        {
            id: "phone",
            title: "Verifikasi Nomor Telepon",
            component: VerifyPhoneForm,
            props: { user },
        },
        {
            id: "password",
            title: "Ubah Password",
            component: UpdatePasswordForm,
            props: {},
        },
        {
            id: "delete",
            title: "Hapus Akun",
            component: DeleteUserForm,
            props: {},
        },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <User size={28} className="text-blue-500 " />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Your Profile
                    </h2>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="space-y-6">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                className="bg-white rounded-2xl shadow-lg border border-blue-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                            >
                                <button
                                    onClick={() =>
                                        setActiveSection(
                                            activeSection === section.id
                                                ? null
                                                : section.id
                                        )
                                    }
                                    className="w-full p-4 sm:p-6 flex justify-between items-center text-left"
                                >
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {section.title}
                                    </h3>
                                    {activeSection === section.id ? (
                                        <ChevronUp
                                            size={24}
                                            className="text-blue-500"
                                        />
                                    ) : (
                                        <ChevronDown
                                            size={24}
                                            className="text-blue-500"
                                        />
                                    )}
                                </button>
                                {activeSection === section.id && (
                                    <div className="p-4 sm:p-6 border-t border-blue-100 animate-slide-down">
                                        <section.component {...section.props} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
