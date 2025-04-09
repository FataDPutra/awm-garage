import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import CustomInput from "@/Components/CustomInput";
import CustomButton from "@/Components/CustomButton";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        password_confirmation: "",
        role: "customer",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register - AWM Garage" />

            <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
                {/* Logo dan Judul */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="/logo-awm-garage.jpeg"
                        alt="AWM Garage Logo"
                        className="h-16 w-auto mb-3"
                    />
                    <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        Daftar ke AWM Garage
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
                        Buat akun untuk memesan layanan kami
                    </p>
                </div>

                {/* Form Register */}
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
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                        autoComplete="new-password"
                        required
                    />

                    {/* Confirm Password Field */}
                    <CustomInput
                        id="password_confirmation"
                        label="Konfirmasi Password"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        error={errors.password_confirmation}
                        autoComplete="new-password"
                        required
                    />

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                        <Link
                            href={route("login")}
                            className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                        >
                            Sudah punya akun? Masuk
                        </Link>
                        <CustomButton
                            disabled={processing}
                            className="sm:w-auto"
                        >
                            Daftar
                        </CustomButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
