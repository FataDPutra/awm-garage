import React, { useEffect, useState, useCallback } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { User, Save, MapPin } from "lucide-react";
import axios from "axios";
import debounce from "lodash/debounce";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            username: user.username || "",
            email: user.email || "",
            full_name: user.full_name || "",
            phone: user.phone || "",
            address: user.address || "",
            province_name: user.province_name || "",
            city_name: user.city_name || "",
            district_name: user.district_name || "",
            subdistrict_name: user.subdistrict_name || "",
            zip_code: user.zip_code || "",
            address_details: user.address_details || "",
            latitude: user.latitude || "",
            longitude: user.longitude || "",
        });

    const [search, setSearch] = useState("");
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLocations = useCallback(
        debounce((searchValue) => {
            if (!searchValue || searchValue.length <= 2) {
                setLocations([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            axios
                .get(`/locations?search=${encodeURIComponent(searchValue)}`)
                .then((response) => {
                    setLocations(response.data.data || []);
                })
                .catch((error) => {
                    console.error("Error fetching locations:", error);
                    setLocations([]);
                })
                .finally(() => setIsLoading(false));
        }, 1000),
        []
    );

    useEffect(() => {
        fetchLocations(search);
    }, [search]);

    const handleLocationSelect = (location) => {
        setData({
            ...data,
            province_name: location.province_name || "",
            city_name: location.city_name || "",
            district_name: location.district_name || "",
            subdistrict_name: location.subdistrict_name || "",
            zip_code: location.zip_code || "",
            address: location.label || "",
        });
        setSearch(location.label || "");
        setLocations([]);
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"), {
            onError: (errors) => console.error("Update failed:", errors),
            onSuccess: () => console.log("Profile updated successfully"),
        });
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <User size={24} className="text-blue-500" /> Informasi
                    Profil
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Update data profil kamu disini !
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <InputLabel
                            htmlFor="username"
                            value="Username"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="username"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-50 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            required
                            autoComplete="username"
                        />
                        <InputError
                            className="mt-2 text-red-500"
                            message={errors.username}
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="full_name"
                            value="Full Name"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="full_name"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-50 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={data.full_name}
                            onChange={(e) =>
                                setData("full_name", e.target.value)
                            }
                            required
                            autoComplete="name"
                        />
                        <InputError
                            className="mt-2 text-red-500"
                            message={errors.full_name}
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Email"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-50 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            autoComplete="email"
                        />
                        <InputError
                            className="mt-2 text-red-500"
                            message={errors.email}
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="phone"
                            value="Phone"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="phone"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-50 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            autoComplete="tel"
                        />
                        <InputError
                            className="mt-2 text-red-500"
                            message={errors.phone}
                        />
                        {data.phone && (
                            <p
                                className={`mt-2 text-sm ${
                                    user.phone_verified_at
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {user.phone_verified_at
                                    ? "Verified for WhatsApp!"
                                    : "Not verified yet."}
                            </p>
                        )}
                    </div>
                </div>

                {/* Location Search */}
                <div className="relative">
                    <InputLabel
                        htmlFor="search"
                        value="Search Location"
                        className="text-gray-700 font-medium"
                    />
                    <div className="relative">
                        <TextInput
                            id="search"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-50 p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search your location..."
                            disabled={isLoading}
                        />
                        <MapPin
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                        />
                        {isLoading && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-400">
                                Loading...
                            </span>
                        )}
                    </div>
                    {locations.length > 0 && !isLoading && (
                        <ul className="absolute z-10 mt-2 w-full border border-blue-200 rounded-xl shadow-xl bg-white max-h-60 overflow-auto animate-slide-down">
                            {locations.map((loc) => (
                                <li
                                    key={loc.id}
                                    className="p-3 cursor-pointer hover:bg-blue-50 text-gray-700 transition-colors duration-200"
                                    onClick={() => handleLocationSelect(loc)}
                                >
                                    {loc.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Location Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <InputLabel
                            htmlFor="address"
                            value="Address"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="address"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-100 p-3"
                            value={data.address}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="province_name"
                            value="Province"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="province_name"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-100 p-3"
                            value={data.province_name}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="city_name"
                            value="City"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="city_name"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-100 p-3"
                            value={data.city_name}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="district_name"
                            value="District"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="district_name"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-100 p-3"
                            value={data.district_name}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="subdistrict_name"
                            value="Subdistrict"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="subdistrict_name"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-100 p-3"
                            value={data.subdistrict_name}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="zip_code"
                            value="ZIP Code"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="zip_code"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-100 p-3"
                            value={data.zip_code}
                            disabled
                        />
                    </div>
                </div>

                {/* Additional Details */}
                <div>
                    <InputLabel
                        htmlFor="address_details"
                        value="Address Details"
                        className="text-gray-700 font-medium"
                    />
                    <TextInput
                        id="address_details"
                        className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-50 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={data.address_details}
                        onChange={(e) =>
                            setData("address_details", e.target.value)
                        }
                    />
                    <InputError
                        className="mt-2 text-red-500"
                        message={errors.address_details}
                    />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <InputLabel
                            htmlFor="latitude"
                            value="Latitude"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="latitude"
                            type="number"
                            step="any"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-50 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={data.latitude}
                            onChange={(e) =>
                                setData("latitude", e.target.value)
                            }
                            min="-90"
                            max="90"
                        />
                        <InputError
                            className="mt-2 text-red-500"
                            message={errors.latitude}
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="longitude"
                            value="Longitude"
                            className="text-gray-700 font-medium"
                        />
                        <TextInput
                            id="longitude"
                            type="number"
                            step="any"
                            className="mt-1 block w-full border-blue-200 rounded-xl bg-blue-50 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={data.longitude}
                            onChange={(e) =>
                                setData("longitude", e.target.value)
                            }
                            min="-180"
                            max="180"
                        />
                        <InputError
                            className="mt-2 text-red-500"
                            message={errors.longitude}
                        />
                    </div>
                </div>

                {/* Email Verification */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <p className="text-sm text-gray-800">
                            Your email is unverified.{" "}
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200 underline"
                            >
                                Resend verification email
                            </Link>
                        </p>
                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm text-green-600 font-medium">
                                A new verification link has been sent!
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing || isLoading}
                        className="relative bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto overflow-hidden group"
                    >
                        <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                        <Save size={20} />{" "}
                        {processing ? "Saving..." : "Save Changes"}
                    </button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-200"
                        enterFrom="opacity-0 translate-y-2"
                        leave="transition ease-in-out duration-200"
                        leaveTo="opacity-0 translate-y-2"
                    >
                        <p className="text-sm text-green-600 font-medium">
                            Saved successfully!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
