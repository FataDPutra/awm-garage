import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function VerifyPhoneForm({ user, flash, className = "" }) {
    const [otpSent, setOtpSent] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        phone: user.phone || "",
        otp: "",
    });

    // Reset state jika user.phone_verified_at berubah
    useEffect(() => {
        if (user.phone_verified_at) {
            setOtpSent(false);
            reset("otp");
        }
    }, [user.phone_verified_at, reset]);

    const handleSendOTP = () => {
        post(route("profile.sendOtp"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setOtpSent(true);
            },
            onError: () => {
                console.log("Send OTP failed", errors);
            },
        });
    };

    const handleVerifyOTP = () => {
        post(route("profile.verifyOtp"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setOtpSent(false);
                reset("otp");
            },
            onError: (err) => {
                console.log("Verify OTP failed", err);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Verifikasi Nomor Telepon
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Jika Anda ingin menerima notifikasi melalui WhatsApp,
                    verifikasi nomor Anda terhubung ke WhatsApp. Jika tidak,
                    Anda tetap bisa melanjutkan tetapi tidak akan mendapatkan
                    notifikasi.
                </p>
                <div className="text-sm p-2 my-2 text-white bg-red-700 rounded-lg ">
                    <h4>Sebelum Tekan SEND OTP</h4>
                    <h3>
                        {" "}
                        Pastikan Nomor Anda Terhubung ke WhatsApp agar menerima
                        KODE OTP !
                    </h3>
                </div>
            </header>

            <form
                className="mt-6 space-y-6"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex items-center space-x-2">
                    <span
                        className={`inline-block w-2 h-2 rounded-full ${
                            user.phone_verified_at
                                ? "bg-green-500"
                                : "bg-red-500"
                        }`}
                    ></span>
                    <p
                        className={`text-sm ${
                            user.phone_verified_at
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {user.phone_verified_at
                            ? "Sudah Diverifikasi"
                            : "Belum Diverifikasi"}
                    </p>
                </div>

                {!user.phone_verified_at && (
                    <>
                        <div>
                            <InputLabel
                                htmlFor="verify-phone"
                                value="Phone Number"
                            />
                            <TextInput
                                id="verify-phone"
                                type="tel"
                                autoComplete="tel"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                disabled={otpSent || processing}
                            />
                            <InputError
                                className="mt-2"
                                message={errors.phone}
                            />
                        </div>

                        {!otpSent ? (
                            <PrimaryButton
                                onClick={handleSendOTP}
                                disabled={processing || !data.phone}
                            >
                                {processing ? "Mengirim OTP..." : "Send OTP"}
                            </PrimaryButton>
                        ) : (
                            <div>
                                <InputLabel
                                    htmlFor="verify-otp"
                                    value="Enter OTP"
                                />
                                <TextInput
                                    id="verify-otp"
                                    className="mt-1 block w-full"
                                    value={data.otp}
                                    onChange={(e) =>
                                        setData("otp", e.target.value)
                                    }
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.otp}
                                />
                                <PrimaryButton
                                    className="mt-2"
                                    onClick={handleVerifyOTP}
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Memverifikasi..."
                                        : "Verify OTP"}
                                </PrimaryButton>
                            </div>
                        )}
                    </>
                )}

                {flash?.message && (
                    <p className="mt-2 text-sm text-green-600">
                        {flash.message}
                    </p>
                )}
            </form>
        </section>
    );
}
