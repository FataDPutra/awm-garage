import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Create({ services }) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: "",
        weight: "",
        photo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("orders.store"));
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-lg font-semibold mb-4">Create New Order</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Service</label>
                    <select
                        value={data.service_id}
                        onChange={(e) => setData("service_id", e.target.value)}
                    >
                        <option value="">Select Service</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.service_name}
                            </option>
                        ))}
                    </select>
                    {errors.service_id && <p>{errors.service_id}</p>}
                </div>

                <div>
                    <label>Weight (kg)</label>
                    <input
                        type="number"
                        value={data.weight}
                        onChange={(e) => setData("weight", e.target.value)}
                    />
                    {errors.weight && <p>{errors.weight}</p>}
                </div>

                <div>
                    <label>Upload Photo</label>
                    <input
                        type="file"
                        onChange={(e) => setData("photo", e.target.files[0])}
                    />
                    {errors.photo && <p>{errors.photo}</p>}
                </div>

                <button type="submit" disabled={processing}>
                    Submit Order
                </button>
            </form>
        </div>
    );
}
