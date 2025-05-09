import { Inertia } from "@inertiajs/inertia";

export default function PaymentButton({ order }) {
    // Check if the order is not in the correct state or if a full payment is already successful
    if (
        order.customer_confirmation !== "approved" ||
        order.status !== "waiting_for_payment" ||
        // Check if any payment has payment_status of 'success' (full payment)
        order.offerPrice?.payments?.some(
            (payment) => payment.payment_status === "success"
        )
    ) {
        return null;
    }

    const handleFull = () => {
        Inertia.get(`/payments/${order.offer_price.id}/payment-full`);
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <button
                onClick={handleFull}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-md"
            >
                Bayar Full
            </button>
        </section>
    );
}
