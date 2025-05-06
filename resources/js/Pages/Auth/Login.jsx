import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import CustomInput from "@/Components/CustomInput";
import CustomButton from "@/Components/CustomButton";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";

export default function Login(canResetPassword) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
    });

    // State untuk toggle visibilitas password
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login - AWM Garage" />

            <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
                {/* Logo dan Judul */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex shrink-0 items-center">
                        <img
                            src="/logo-awm.svg"
                            alt="AWM Garage Logo"
                            className="h-16 w-auto mb-3"
                        />
                    </Link>
                    <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        Masuk ke AWM Garage
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
                        Masuk untuk memesan layanan kami
                    </p>
                </div>

                {/* Form Login */}
                <form onSubmit={submit} className="space-y-6">
                    {/* Username Field */}
                    <CustomInput
                        id="username"
                        label="Username"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        error={errors.username}
                        autoComplete="username"
                        isFocused={true}
                        required
                    />

                    {/* Password Field */}
                    <CustomInput
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                        autoComplete="current-password"
                        required
                        inputClassName="pr-10"
                    >
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <LuEyeClosed className="h-5 w-5" />
                            ) : (
                                <FaEye className="h-5 w-5" />
                            )}
                        </button>
                    </CustomInput>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                        <Link
                            href={route("register")}
                            className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                        >
                            Belum punya akun?
                        </Link>
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                            >
                                Lupa Password?
                            </Link>
                        )}

                        <CustomButton
                            disabled={processing}
                            className="sm:w-auto"
                        >
                            Masuk
                        </CustomButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
