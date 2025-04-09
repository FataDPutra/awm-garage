import React from "react";

const PurchaseRequestInfo = ({ purchaseRequest }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Informasi Purchase Request
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <p>
                        <strong>Customer:</strong>{" "}
                        {purchaseRequest.user.full_name}
                    </p>
                    <p>
                        <strong>Service:</strong>{" "}
                        {purchaseRequest.service.service_name}
                    </p>
                    <p>
                        <strong>Weight:</strong> {purchaseRequest.weight} kg
                    </p>
                    <p>
                        <strong>Shipping Cost to Admin:</strong> Rp{" "}
                        {purchaseRequest.shipping_cost_to_admin}
                    </p>
                    <p>
                        <strong>Shipping to Admin:</strong>{" "}
                        {purchaseRequest.shipping_to_admin_details?.name} -{" "}
                        {purchaseRequest.shipping_to_admin_details?.service}{" "}
                        (ETD:{" "}
                        {purchaseRequest.shipping_to_admin_details?.etd ||
                            "N/A"}
                        )
                    </p>
                </div>
                <div>
                    <p>
                        <strong>Source Address:</strong>{" "}
                        {purchaseRequest.source_address.address_details}
                    </p>
                    <p>
                        <strong>Destination Address:</strong>{" "}
                        {purchaseRequest.destination_address.address_details}
                    </p>
                    <p>
                        <strong>Shipping Preference:</strong>{" "}
                        {purchaseRequest.shipping_to_customer_preference?.name}{" "}
                        -{" "}
                        {
                            purchaseRequest.shipping_to_customer_preference
                                ?.service
                        }{" "}
                        ({purchaseRequest.shipping_to_customer_preference?.cost}{" "}
                        Rp, ETD:{" "}
                        {purchaseRequest.shipping_to_customer_preference?.etd ||
                            "N/A"}
                        )
                    </p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                    <p>
                        <strong>Description:</strong>{" "}
                        {purchaseRequest.description}
                    </p>
                    <div className="mt-2">
                        <strong>Additional Options:</strong>
                        {purchaseRequest.additional_details &&
                        purchaseRequest.additional_details.length > 0 ? (
                            <ul className="list-disc pl-5 mt-1">
                                {purchaseRequest.additional_details.map(
                                    (add, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            {add.name} (+{add.additional_price}{" "}
                                            Rp)
                                            {add.image_path && (
                                                <img
                                                    src={`/storage/${add.image_path}`}
                                                    alt={add.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                        </li>
                                    )
                                )}
                            </ul>
                        ) : (
                            <span className="ml-2 text-gray-500">
                                No additional options selected
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseRequestInfo;
