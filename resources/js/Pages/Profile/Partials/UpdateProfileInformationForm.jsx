import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState, useCallback } from "react";
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
        }, 1000), // Delay 1000ms untuk mengurangi frekuensi
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
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Username */}
                <div>
                    <InputLabel htmlFor="username" value="Username" />
                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.username} />
                </div>

                {/* Full Name */}
                <div>
                    <InputLabel htmlFor="full_name" value="Full Name" />
                    <TextInput
                        id="full_name"
                        className="mt-1 block w-full"
                        value={data.full_name}
                        onChange={(e) => setData("full_name", e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.full_name} />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Phone */}
                <div>
                    <InputLabel htmlFor="phone" value="Phone" />
                    <TextInput
                        id="phone"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        autoComplete="tel"
                    />
                    <InputError className="mt-2" message={errors.phone} />
                    {data.phone && (
                        <p
                            className={`mt-2 text-sm ${
                                user.phone_verified_at
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {user.phone_verified_at
                                ? "Nomor ini sudah diverifikasi untuk WhatsApp."
                                : "Nomor ini belum diverifikasi."}
                        </p>
                    )}
                </div>

                {/* Location Search */}
                <div className="relative">
                    <InputLabel htmlFor="search" value="Search Location" />
                    <TextInput
                        id="search"
                        className="mt-1 block w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Type to search location (min 3 chars)..."
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <span className="absolute right-2 top-9 text-sm text-gray-500">
                            Loading...
                        </span>
                    )}
                    {locations.length > 0 && !isLoading && (
                        <ul className="absolute z-10 mt-1 w-full border border-gray-300 rounded-md shadow-md bg-white max-h-60 overflow-auto">
                            {locations.map((loc) => (
                                <li
                                    key={loc.id}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleLocationSelect(loc)}
                                >
                                    {loc.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Display Selected Location */}
                <div>
                    <InputLabel htmlFor="address" value="Selected Address" />
                    <TextInput
                        id="address"
                        className="mt-1 block w-full"
                        value={data.address}
                        disabled
                    />
                </div>

                {/* Province */}
                <div>
                    <InputLabel htmlFor="province_name" value="Province" />
                    <TextInput
                        id="province_name"
                        className="mt-1 block w-full"
                        value={data.province_name}
                        disabled
                    />
                </div>

                {/* City */}
                <div>
                    <InputLabel htmlFor="city_name" value="City" />
                    <TextInput
                        id="city_name"
                        className="mt-1 block w-full"
                        value={data.city_name}
                        disabled
                    />
                </div>

                {/* District */}
                <div>
                    <InputLabel htmlFor="district_name" value="District" />
                    <TextInput
                        id="district_name"
                        className="mt-1 block w-full"
                        value={data.district_name}
                        disabled
                    />
                </div>

                {/* Subdistrict */}
                <div>
                    <InputLabel
                        htmlFor="subdistrict_name"
                        value="Subdistrict"
                    />
                    <TextInput
                        id="subdistrict_name"
                        className="mt-1 block w-full"
                        value={data.subdistrict_name}
                        disabled
                    />
                </div>

                {/* ZIP Code */}
                <div>
                    <InputLabel htmlFor="zip_code" value="ZIP Code" />
                    <TextInput
                        id="zip_code"
                        className="mt-1 block w-full"
                        value={data.zip_code}
                        disabled
                    />
                </div>

                {/* Address Details */}
                <div>
                    <InputLabel
                        htmlFor="address_details"
                        value="Address Details"
                    />
                    <TextInput
                        id="address_details"
                        className="mt-1 block w-full"
                        value={data.address_details}
                        onChange={(e) =>
                            setData("address_details", e.target.value)
                        }
                    />
                    <InputError
                        className="mt-2"
                        message={errors.address_details}
                    />
                </div>

                {/* Latitude */}
                <div>
                    <InputLabel htmlFor="latitude" value="Latitude" />
                    <TextInput
                        id="latitude"
                        type="number"
                        step="any"
                        className="mt-1 block w-full"
                        value={data.latitude}
                        onChange={(e) => setData("latitude", e.target.value)}
                        min="-90"
                        max="90"
                    />
                    <InputError className="mt-2" message={errors.latitude} />
                </div>

                {/* Longitude */}
                <div>
                    <InputLabel htmlFor="longitude" value="Longitude" />
                    <TextInput
                        id="longitude"
                        type="number"
                        step="any"
                        className="mt-1 block w-full"
                        value={data.longitude}
                        onChange={(e) => setData("longitude", e.target.value)}
                        min="-180"
                        max="180"
                    />
                    <InputError className="mt-2" message={errors.longitude} />
                </div>

                {/* Email Verification */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || isLoading}>
                        Save
                    </PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
