import InputError from "@/Components/InputError";
import CustomInput from "@/Components/CustomInput";
import CustomButton from "@/Components/CustomButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ResetPassword({ token, email, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password - AWM Garage" />

            <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-xl">
                {/* Logo dan Judul */}
                <div className="flex flex-col items-center mb-10">
                    <a href="/" className="flex shrink-0 items-center">
                        <img
                            src="/logo-awm.svg"
                            alt="AWM Garage Logo"
                            className="h-20 w-auto mb-4"
                        />
                    </a>

                    <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        Reset Kata Sandi
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                        Masukkan kata sandi baru untuk akun Anda
                    </p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="mb-6 text-sm font-medium text-green-600 text-center bg-green-100 dark:bg-green-900/50 p-3 rounded-md shadow-sm">
                        {status}
                    </div>
                )}

                {/* Form Reset Password */}
                <form onSubmit={submit} className="space-y-6">
                    {/* Email Field */}
                    <CustomInput
                        id="email"
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        error={errors.email}
                        autoComplete="username"
                    />

                    {/* Password Field */}
                    <CustomInput
                        id="password"
                        label="Kata Sandi Baru"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                        autoComplete="new-password"
                        isFocused={true}
                    />

                    {/* Password Confirmation Field */}
                    <CustomInput
                        id="password_confirmation"
                        label="Konfirmasi Kata Sandi"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        error={errors.password_confirmation || errors.password}
                        autoComplete="new-password"
                    />

                    {/* Actions */}
                    <div className="mt-8 flex flex-col gap-4 items-center">
                        <CustomButton
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                        >
                            Reset Kata Sandi
                        </CustomButton>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Kembali ke{" "}
                            <a
                                href={route("login")}
                                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            >
                                halaman login
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
