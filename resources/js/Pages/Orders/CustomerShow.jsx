import { Link, useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import OrderInfoSection from "@/Components/Customer/Orders/OrderInfoSection";
import PurchaseRequestSection from "@/Components/Customer/Orders/PurchaseRequestSection";
import CompletedPhotosSection from "@/Components/Customer/Orders/CompletedPhotosSection";
import ComplainsSection from "@/Components/Customer/Orders/ComplainsSection";
import CustomerConfirmationForm from "@/Components/Customer/Orders/CustomerConfirmationForm";
import PaymentButton from "@/Components/Customer/Orders/PaymentButton";
import ShippingConfirmationSection from "@/Components/Customer/Orders/ShippingConfirmationSection";
import ShippingInfoSection from "@/Components/Customer/Orders/ShippingInfoSection";
import ReviewsSection from "@/Components/Customer/Orders/ReviewsSection";

export default function CustomerShow({ order, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        shipping_receipt_customer: order.shipping_receipt_customer || "",
        shipping_proof_customer: null,
        customer_confirmation: "",
        customer_feedback: "",
        rating: 0,
        review: "",
        review_media: [],
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedProof, setUploadedProof] = useState(
        order.shipping_proof_customer
            ? `/storage/${order.shipping_proof_customer}`
            : null
    );
    const [reviewMediaPreviews, setReviewMediaPreviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (order.shipping_proof_customer) {
            setUploadedProof(`/storage/${order.shipping_proof_customer}`);
        }
    }, [order]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <Package size={28} className="text-blue-500" />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Detail Pesanan #{order.order_id}
                    </h2>
                </div>
            }
        >
            <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-gray-50 space-y-6">
                <OrderInfoSection order={order} />
                <PurchaseRequestSection order={order} />
                <CompletedPhotosSection order={order} />
                <ComplainsSection order={order} />
                <CustomerConfirmationForm
                    order={order}
                    data={data}
                    setData={setData}
                    post={post}
                    processing={processing}
                />
                <PaymentButton order={order} />
                <ShippingConfirmationSection
                    order={order}
                    data={data}
                    setData={setData}
                    post={post}
                    processing={processing}
                    previewImage={previewImage}
                    setPreviewImage={setPreviewImage}
                    uploadedProof={uploadedProof}
                    setUploadedProof={setUploadedProof}
                />
                <ShippingInfoSection
                    order={order}
                    uploadedProof={uploadedProof}
                    post={post}
                />
                <ReviewsSection
                    order={order}
                    data={data}
                    setData={setData}
                    post={post}
                    processing={processing}
                    showReviewForm={showReviewForm}
                    setShowReviewForm={setShowReviewForm}
                    reviewMediaPreviews={reviewMediaPreviews}
                    setReviewMediaPreviews={setReviewMediaPreviews}
                    hoverRating={hoverRating}
                    setHoverRating={setHoverRating}
                />
            </div>
        </AuthenticatedLayout>
    );
}
