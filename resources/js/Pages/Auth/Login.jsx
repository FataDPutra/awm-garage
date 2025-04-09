import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import CustomInput from "@/Components/CustomInput";
import CustomCheckbox from "@/Components/CustomCheckbox";
import CustomButton from "@/Components/CustomButton";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in - AWM Garage" />

            <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-xl">
                {/* Logo dan Judul */}
                <div className="flex flex-col items-center mb-10">
                    <img
                        src="/logo-awm-garage.jpeg"
                        alt="AWM Garage Logo"
                        className="h-20 w-auto mb-4"
                    />
                    <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        Masuk ke AWM Garage
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                        Login untuk memesan layanan vaporblasting dan lebih
                    </p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="mb-6 text-sm font-medium text-green-600 text-center bg-green-100 dark:bg-green-900/50 p-3 rounded-md shadow-sm">
                        {status}
                    </div>
                )}

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
                    />

                    {/* Password Field */}
                    <CustomInput
                        id="password"
                        label="Password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                        autoComplete="current-password"
                    />

                    {/* Remember Me Checkbox (Opsional, dikomentari) */}
                    {/* <CustomCheckbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                        label="Ingat saya"
                    /> */}

                    {/* Actions */}
                    <div className="mt-8 flex flex-col gap-4 items-center">
                        <CustomButton
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                        >
                            Masuk
                        </CustomButton>

                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                                >
                                    Lupa kata sandi?
                                </Link>
                            )}
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Belum punya akun?{" "}
                                <Link
                                    href={route("register")}
                                    className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    Daftar di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
