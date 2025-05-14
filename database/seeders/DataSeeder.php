<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Service;
use App\Models\AdditionalType;
use App\Models\ServiceAdditional;
use App\Models\Location;
use App\Models\PurchaseRequest;
use App\Models\OfferPrice;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Shipping;
use App\Models\Review;
use Illuminate\Support\Facades\Hash;

class DataSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->seedUsers();
        $this->seedServices();
        $this->seedAdditionalTypes();
        $this->seedServiceAdditionals();
        $this->seedLocations();
        $this->seedPurchaseRequests();
        $this->seedOfferPrices();
        $this->seedOrders();
        $this->seedPayments();
        $this->seedShippings();
        $this->seedReviews();
    }

    private function seedUsers()
    {
        // Admin
        User::create([
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Customer
        User::create([
            'username' => 'customer',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);
    }

    private function seedServices()
    {
        Service::create([
            'service_name' => 'Vapor Blasting',
            'description' => 'Pembersihan presisi dengan hasil halus dan detail tajam. Cocok untuk komponen mesin, karburator, dan part logam agar tampak seperti baru tanpa merusak permukaan.',
            'base_price' => 150000,
        ]);

        Service::create([
            'service_name' => 'Sand Blasting',
            'description' => 'Menghilangkan karat, cat lama, dan kotoran membandel. Ideal untuk persiapan pengecatan dan restorasi permukaan logam agar lebih bersih dan siap finishing.',
            'base_price' => 150000,
        ]);

        Service::create([
            'service_name' => 'Powder Coating',
            'description' => 'Finishing warna solid, tahan gores, dan anti karat. Solusi pengecatan terbaik untuk tampilan profesional yang awet dan sesuai gaya Anda.',
            'base_price' => 200000,
        ]);

        Service::create([
            'service_name' => 'Parts & Custom',
            'description' => 'Pembuatan part custom sesuai desain dan kebutuhan Anda. Mulai dari bracket hingga aksesori, semua dikerjakan dengan presisi dan material berkualitas.',
            'base_price' => 250000,
        ]);

        Service::create([
            'service_name' => 'Restoration & Modification',
            'description' => 'Menghidupkan kembali kendaraan lama dengan sentuhan modifikasi penuh karakter. Kombinasi tampilan klasik dan performa modern untuk hasil maksimal.',
            'base_price' => 500000,
        ]);

        Service::create([
            'service_name' => 'Zinc Plating',
            'description' => 'Lapisan pelindung anti karat untuk part logam seperti baut dan bracket. Menjaga part tetap bersih, kuat, dan tahan lama dalam segala kondisi.',
            'base_price' => 100000,
        ]);
    }

    private function seedAdditionalTypes()
    {
        AdditionalType::create(['name' => 'Color']);
    }

    private function seedServiceAdditionals()
    {
        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Silver Grey Metalic',
            'image_path' => 'service_additionals/silver_grey_metalic.webp',
            'additional_price' => 0,
        ]);

        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Super White',
            'image_path' => 'service_additionals/super_white.webp   ',
            'additional_price' => 0,
        ]);

        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Gold Candy',
            'image_path' => 'service_additionals/gold_candy.webp    ',
            'additional_price' => 0,
        ]);

        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Dark Grey Gloss',
            'image_path' => 'service_additionals/dark_grey_gloss.webp   ',
            'additional_price' => 0,
        ]);

        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Merah Candy',
            'image_path' => 'service_additionals/merah_candy.webp   ',
            'additional_price' => 0,
        ]);

        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Black Semi Gloss',
            'image_path' => 'service_additionals/black_semi_gloss.webp  ',
            'additional_price' => 0,
        ]);

        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Merah Ferari',
            'image_path' => 'service_additionals/merah_ferari.webp',
            'additional_price' => 100000,
        ]);

        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Orange',
            'image_path' => 'service_additionals/orange.webp    ',
            'additional_price' => 0,
        ]);

        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Orange KTM',
            'image_path' => 'service_additionals/orange_ktm.webp    ',
            'additional_price' => 0,
        ]);

        ServiceAdditional::create([
            'service_id' => 3, // Powder Coating
            'additional_type_id' => 1, // Color
            'name' => 'Biru Monster',
            'image_path' => 'service_additionals/biru_monster.webp  ',
            'additional_price' => 0,
        ]);
    }

    private function seedLocations()
    {
        Location::create([
            'label' => 'Gandaria Utara, Jakarta Selatan',
            'province_name' => 'DKI Jakarta',
            'city_name' => 'Jakarta Selatan',
            'district_name' => 'Kebayoran Baru',
            'subdistrict_name' => 'Gandaria Utara',
            'zip_code' => '12140',
        ]);

        Location::create([
            'label' => 'Cimahi Selatan, Cimahi',
            'province_name' => 'Jawa Barat',
            'city_name' => 'Cimahi',
            'district_name' => 'Cimahi Selatan',
            'subdistrict_name' => 'Cimahi',
            'zip_code' => '40534',
        ]);
    }

    private function seedPurchaseRequests()
    {
        $commonSourceAddress = [
            'province_name' => 'DKI Jakarta',
            'city_name' => 'Jakarta Selatan',
            'district_name' => 'Kebayoran Baru',
            'subdistrict_name' => 'Gandaria Utara',
            'zip_code' => '12140',
            'address' => 'Jl. Merdeka No.10',
            'address_details' => 'Depan taman',
        ];

        $commonDestinationAddress = [
            'province_name' => 'Jawa Barat',
            'city_name' => 'Cimahi',
            'district_name' => 'Cimahi Selatan',
            'subdistrict_name' => 'Cimahi',
            'zip_code' => '40534',
            'address' => 'Jl. Raya No.1',
            'address_details' => 'Dekat pasar',
        ];

        // Purchase Request untuk Vapor Blasting
        PurchaseRequest::create([
            'user_id' => 2,
            'service_id' => 1,
            'description' => 'Membersihkan permukaan blok mesin motor.',
            'photo_path' => ['purchase_requests/vaporblasting.jpeg'],
            'weight' => 5.50,
            'shipping_cost_to_admin' => 25000,
            'shipping_to_admin_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 25000,
                'etd' => '2-3',
            ],
            'source_address' => $commonSourceAddress,
            'destination_address' => $commonDestinationAddress,
            'shipping_to_customer_preference' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 30000,
                'etd' => '2-3',
            ],
            'status' => 'done',
        ]);

        // Purchase Request untuk Sand Blasting
        PurchaseRequest::create([
            'user_id' => 2,
            'service_id' => 2,
            'description' => 'Membersihkan rangka sepeda motor dari karat.',
            'photo_path' => ['purchase_requests/sandblasting.jpeg'],
            'weight' => 10.00,
            'shipping_cost_to_admin' => 35000,
            'shipping_to_admin_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 35000,
                'etd' => '2-3',
            ],
            'source_address' => $commonSourceAddress,
            'destination_address' => $commonDestinationAddress,
            'shipping_to_customer_preference' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 40000,
                'etd' => '2-3',
            ],
            'status' => 'done',
        ]);

        // Purchase Request untuk Powder Coating
        PurchaseRequest::create([
            'user_id' => 2,
            'service_id' => 3,
            'description' => 'Melapisi velg motor dengan warna Merah Ferari.',
            'photo_path' => ['purchase_requests/powdercoating.jpeg'],
            'weight' => 8.00,
            'shipping_cost_to_admin' => 30000,
            'shipping_to_admin_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 30000,
                'etd' => '2-3',
            ],
            'source_address' => $commonSourceAddress,
            'destination_address' => $commonDestinationAddress,
            'shipping_to_customer_preference' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 35000,
                'etd' => '2-3',
            ],
            'additional_details' => [
                [
                    'id' => 7,
                    'type' => 1,
                    'name' => 'Merah Ferari',
                    'image_path' => 'service_additionals/merah_ferari.webp',
                    'additional_price' => 100000,
                ],
            ],
            'status' => 'done',
        ]);

        // Purchase Request untuk Parts & Custom
        PurchaseRequest::create([
            'user_id' => 2,
            'service_id' => 4,
            'description' => 'Membuat braket kustom untuk motor.',
            'photo_path' => ['purchase_requests/parts_custom.jpeg'],
            'weight' => 2.00,
            'shipping_cost_to_admin' => 20000,
            'shipping_to_admin_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 20000,
                'etd' => '2-3',
            ],
            'source_address' => $commonSourceAddress,
            'destination_address' => $commonDestinationAddress,
            'shipping_to_customer_preference' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 25000,
                'etd' => '2-3',
            ],
            'status' => 'done',
        ]);

        // Purchase Request untuk Restoration & Modification
        PurchaseRequest::create([
            'user_id' => 2,
            'service_id' => 5,
            'description' => 'Merestorasi bodi motor klasik.',
            'photo_path' => ['purchase_requests/restoration.jpeg'],
            'weight' => 50.00,
            'shipping_cost_to_admin' => 100000,
            'shipping_to_admin_details' => [
                'courier' => 'jne',
                'service' => 'OKE',
                'cost' => 100000,
                'etd' => '3-5',
            ],
            'source_address' => $commonSourceAddress,
            'destination_address' => $commonDestinationAddress,
            'shipping_to_customer_preference' => [
                'courier' => 'jne',
                'service' => 'OKE',
                'cost' => 120000,
                'etd' => '3-5',
            ],
            'status' => 'done',
        ]);

        // Purchase Request untuk Zinc Plating
        PurchaseRequest::create([
            'user_id' => 2,
            'service_id' => 6,
            'description' => 'Melapisi baut dan mur dengan seng.',
            'photo_path' => ['purchase_requests/zincplating.jpeg'],
            'weight' => 1.50,
            'shipping_cost_to_admin' => 15000,
            'shipping_to_admin_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 15000,
                'etd' => '2-3',
            ],
            'source_address' => $commonSourceAddress,
            'destination_address' => $commonDestinationAddress,
            'shipping_to_customer_preference' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 20000,
                'etd' => '2-3',
            ],
            'status' => 'done',
        ]);
    }

    private function seedOfferPrices()
    {
        // Offer Price untuk Vapor Blasting
        OfferPrice::create([
            'pr_id' => 1,
            'service_price' => 150000,
            'dp_amount' => 75000,
            'estimation_days' => 3,
            'shipping_cost_to_customer' => 30000,
            'shipping_to_customer_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 30000,
                'etd' => '2-3',
            ],
            'total_price' => 230000, // 150000 + 50000 + 30000
            'status' => 'accepted',
        ]);

        // Offer Price untuk Sand Blasting
        OfferPrice::create([
            'pr_id' => 2,
            'service_price' => 100000,
            'dp_amount' => 50000,
            'estimation_days' => 2,
            'shipping_cost_to_customer' => 40000,
            'shipping_to_customer_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 40000,
                'etd' => '2-3',
            ],
            'total_price' => 180000, // 100000 + 40000 + 40000
            'status' => 'accepted',
        ]);

        // Offer Price untuk Powder Coating
        OfferPrice::create([
            'pr_id' => 3,
            'service_price' => 200000,
            'dp_amount' => 100000,
            'estimation_days' => 4,
            'shipping_cost_to_customer' => 35000,
            'shipping_to_customer_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 35000,
                'etd' => '2-3',
            ],
            'total_price' => 335000, // 200000 + 100000 + 35000
            'status' => 'accepted',
        ]);

        // Offer Price untuk Parts & Custom
        OfferPrice::create([
            'pr_id' => 4,
            'service_price' => 250000,
            'dp_amount' => 125000,
            'estimation_days' => 5,
            'shipping_cost_to_customer' => 25000,
            'shipping_to_customer_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 25000,
                'etd' => '2-3',
            ],
            'total_price' => 395000, // 250000 + 120000 + 25000
            'status' => 'accepted',
        ]);

        // Offer Price untuk Restoration & Modification
        OfferPrice::create([
            'pr_id' => 5,
            'service_price' => 500000,
            'dp_amount' => 250000,
            'estimation_days' => 10,
            'shipping_cost_to_customer' => 120000,
            'shipping_to_customer_details' => [
                'courier' => 'jne',
                'service' => 'OKE',
                'cost' => 120000,
                'etd' => '3-5',
            ],
            'total_price' => 770000, // 500000 + 150000 + 120000
            'status' => 'accepted',
        ]);

        // Offer Price untuk Zinc Plating
        OfferPrice::create([
            'pr_id' => 6,
            'service_price' => 175000,
            'dp_amount' => 87500,
            'estimation_days' => 3,
            'shipping_cost_to_customer' => 20000,
            'shipping_to_customer_details' => [
                'courier' => 'jne',
                'service' => 'REG',
                'cost' => 20000,
                'etd' => '2-3',
            ],
            'total_price' => 255000, // 175000 + 60000 + 20000
            'status' => 'accepted',
        ]);
    }

    private function seedOrders()
    {
        // Order untuk Vapor Blasting
        Order::create([
            'order_id' => 'INV-20250506-0001',
            'offerprice_id' => 1,
            'completed_photo_path' => ['completed_photos/vaporblasting.jpeg'],
            'shipping_receipt' => 'JNE123456789',
            'shipping_receipt_customer' => 'JNE987654321',
            'shipping_proof_customer' => 'shipping_proofs_customer/resi.jpeg',
            'status' => 'completed',
            'customer_confirmation' => 'approved',
        ]);

        // Order untuk Sand Blasting
        Order::create([
            'order_id' => 'INV-20250506-0002',
            'offerprice_id' => 2,
            'completed_photo_path' => ['completed_photos/sandblasting.jpeg'],
            'shipping_receipt' => 'JNE123456790',
            'shipping_receipt_customer' => 'JNE987654322',
            'shipping_proof_customer' => 'shipping_proofs_customer/resi.jpeg',
            'status' => 'completed',
            'customer_confirmation' => 'approved',
        ]);

        // Order untuk Powder Coating
        Order::create([
            'order_id' => 'INV-20250506-0003',
            'offerprice_id' => 3,
            'completed_photo_path' => ['completed_photos/powdercoating.jpeg'],
            'shipping_receipt' => 'JNE123456791',
            'shipping_receipt_customer' => 'JNE987654323',
            'shipping_proof_customer' => 'shipping_proofs_customer/resi.jpeg',
            'status' => 'completed',
            'customer_confirmation' => 'approved',
        ]);

        // Order untuk Parts & Custom
        Order::create([
            'order_id' => 'INV-20250506-0004',
            'offerprice_id' => 4,
            'completed_photo_path' => ['completed_photos/parts_custom.jpeg'],
            'shipping_receipt' => 'JNE123456792',
            'shipping_receipt_customer' => 'JNE987654324',
            'shipping_proof_customer' => 'shipping_proofs_customer/resi.jpeg',
            'status' => 'completed',
            'customer_confirmation' => 'approved',
        ]);

        // Order untuk Restoration & Modification
        Order::create([
            'order_id' => 'INV-20250506-0005',
            'offerprice_id' => 5,
            'completed_photo_path' => ['completed_photos/restoration.jpeg'],
            'shipping_receipt' => 'JNE123456793',
            'shipping_receipt_customer' => 'JNE987654325',
            'shipping_proof_customer' => 'shipping_proofs_customer/resi.jpeg',
            'status' => 'completed',
            'customer_confirmation' => 'approved',
        ]);

        // Order untuk Zinc Plating
        Order::create([
            'order_id' => 'INV-20250506-0006',
            'offerprice_id' => 6,
            'completed_photo_path' => ['completed_photos/zincplating.jpeg'],
            'shipping_receipt' => 'JNE123456794',
            'shipping_receipt_customer' => 'JNE987654326',
            'shipping_proof_customer' => 'shipping_proofs_customer/resi.jpeg',
            'status' => 'completed',
            'customer_confirmation' => 'approved',
        ]);
    }

    private function seedPayments()
    {
        // Payment DP untuk Vapor Blasting
        Payment::create([
            'offerprice_id' => 1,
            'amount' => 75000,
            'payment_method' => 'qris',
            'payment_type' => 'dp',
            'transaction_id' => 'DP-67fd1978b735b',
            'payment_status' => 'paid',
            'payment_time' => now()->subDays(7),
        ]);

        // Payment Final untuk Vapor Blasting
        Payment::create([
            'offerprice_id' => 1,
            'amount' => 155000, // 230000 - 75000
            'payment_method' => 'qris',
            'payment_type' => 'full',
            'transaction_id' => 'full-67fd1978b735b',
            'payment_status' => 'success',
            'payment_time' => now(),
        ]);

        // Payment DP untuk Sand Blasting
        Payment::create([
            'offerprice_id' => 2,
            'amount' => 50000,
            'payment_method' => 'qris',
            'payment_type' => 'dp',
            'transaction_id' => 'DP-67fd1978b735c',
            'payment_status' => 'paid',
            'payment_time' => now()->subDays(7),
        ]);

        // Payment full untuk Sand Blasting
        Payment::create([
            'offerprice_id' => 2,
            'amount' => 130000, // 180000 - 50000
            'payment_method' => 'qris',
            'payment_type' => 'full',
            'transaction_id' => 'full-67fd1978b735c',
            'payment_status' => 'success',
            'payment_time' => now(),
        ]);

        // Payment DP untuk Powder Coating
        Payment::create([
            'offerprice_id' => 3,
            'amount' => 100000,
            'payment_method' => 'qris',
            'payment_type' => 'dp',
            'transaction_id' => 'DP-67fd1978b735d',
            'payment_status' => 'paid',
            'payment_time' => now()->subDays(7),
        ]);

        // Payment full untuk Powder Coating
        Payment::create([
            'offerprice_id' => 3,
            'amount' => 235000, // 335000 - 100000
            'payment_method' => 'qris',
            'payment_type' => 'full',
            'transaction_id' => 'Full-67fd1978b735d',
            'payment_status' => 'success',
            'payment_time' => now(),
        ]);

        // Payment DP untuk Parts & Custom
        Payment::create([
            'offerprice_id' => 4,
            'amount' => 125000,
            'payment_method' => 'qris',
            'payment_type' => 'dp',
            'transaction_id' => 'DP-67fd1978b735e',
            'payment_status' => 'paid',
            'payment_time' => now()->subDays(7),
        ]);

        // Payment full untuk Parts & Custom
        Payment::create([
            'offerprice_id' => 4,
            'amount' => 270000, // 395000 - 125000
            'payment_method' => 'qris',
            'payment_type' => 'full',
            'transaction_id' => 'Full-67fd1978b735e',
            'payment_status' => 'success',
            'payment_time' => now(),
        ]);

        // Payment DP untuk Restoration & Modification
        Payment::create([
            'offerprice_id' => 5,
            'amount' => 250000,
            'payment_method' => 'qris',
            'payment_type' => 'dp',
            'transaction_id' => 'DP-67fd1978b735f',
            'payment_status' => 'paid',
            'payment_time' => now()->subDays(7),
        ]);

        // Payment full untuk Restoration & Modification
        Payment::create([
            'offerprice_id' => 5,
            'amount' => 520000, // 770000 - 250000
            'payment_method' => 'qris',
            'payment_type' => 'full',
            'transaction_id' => 'Full-67fd1978b735f',
            'payment_status' => 'success',
            'payment_time' => now(),
        ]);

        // Payment DP untuk Zinc Plating
        Payment::create([
            'offerprice_id' => 6,
            'amount' => 87500,
            'payment_method' => 'qris',
            'payment_type' => 'dp',
            'transaction_id' => 'DP-67fd1978b735g',
            'payment_status' => 'paid',
            'payment_time' => now()->subDays(7),
        ]);

        // Payment full untuk Zinc Plating
        Payment::create([
            'offerprice_id' => 6,
            'amount' => 167500, // 255000 - 87500
            'payment_method' => 'qris',
            'payment_type' => 'full',
            'transaction_id' => 'Full-67fd1978b735g',
            'payment_status' => 'success',
            'payment_time' => now(),
        ]);
    }

    private function seedShippings()
    {
        // Shipping untuk Vapor Blasting
        Shipping::create([
            'order_id' => 'INV-20250506-0001',
            'courier_code' => 'jne',
            'courier_name' => 'JNE',
            'courier_service' => 'REG',
            'tracking_number' => 'JNE123456789',
            'shipping_date' => now()->subDays(3),
            'status' => 'delivered',
        ]);

        // Shipping untuk Sand Blasting
        Shipping::create([
            'order_id' => 'INV-20250506-0002',
            'courier_code' => 'jne',
            'courier_name' => 'JNE',
            'courier_service' => 'REG',
            'tracking_number' => 'JNE123456790',
            'shipping_date' => now()->subDays(3),
            'status' => 'delivered',
        ]);

        // Shipping untuk Powder Coating
        Shipping::create([
            'order_id' => 'INV-20250506-0003',
            'courier_code' => 'jne',
            'courier_name' => 'JNE',
            'courier_service' => 'REG',
            'tracking_number' => 'JNE123456791',
            'shipping_date' => now()->subDays(3),
            'status' => 'delivered',
        ]);

        // Shipping untuk Parts & Custom
        Shipping::create([
            'order_id' => 'INV-20250506-0004',
            'courier_code' => 'jne',
            'courier_name' => 'JNE',
            'courier_service' => 'REG',
            'tracking_number' => 'JNE123456792',
            'shipping_date' => now()->subDays(3),
            'status' => 'delivered',
        ]);

        // Shipping untuk Restoration & Modification
        Shipping::create([
            'order_id' => 'INV-20250506-0005',
            'courier_code' => 'jne',
            'courier_name' => 'JNE',
            'courier_service' => 'OKE',
            'tracking_number' => 'JNE123456793',
            'shipping_date' => now()->subDays(5),
            'status' => 'delivered',
        ]);

        // Shipping untuk Zinc Plating
        Shipping::create([
            'order_id' => 'INV-20250506-0006',
            'courier_code' => 'jne',
            'courier_name' => 'JNE',
            'courier_service' => 'REG',
            'tracking_number' => 'JNE123456794',
            'shipping_date' => now()->subDays(3),
            'status' => 'delivered',
        ]);
    }

    private function seedReviews()
    {
        // Review untuk Vapor Blasting
        Review::create([
            'order_id' => 'INV-20250506-0001',
            'rating' => 5,
            'review' => 'Hasil vapor blasting sangat memuaskan, permukaan bersih dan halus!',
            'media_paths' => ['review_media/vaporblasting.jpeg'],
        ]);

        // Review untuk Sand Blasting
        Review::create([
            'order_id' => 'INV-20250506-0002',
            'rating' => 4,
            'review' => 'Rangka motor bersih dari karat, hasil sangat baik.',
            'media_paths' => ['review_media/sandblasting.jpeg'],
        ]);

        // Review untuk Powder Coating
        Review::create([
            'order_id' => 'INV-20250506-0003',
            'rating' => 5,
            'review' => 'Barang saya menjadi seperti baru !',
            'media_paths' => ['review_media/powdercoating.jpeg'],
        ]);

        // Review untuk Parts & Custom
        Review::create([
            'order_id' => 'INV-20250506-0004',
            'rating' => 4,
            'review' => 'Braket kustom presisi dan sesuai kebutuhan.',
            'media_paths' => ['review_media/parts_custom.jpeg'],
        ]);

        // Review untuk Restoration & Modification
        Review::create([
            'order_id' => 'INV-20250506-0005',
            'rating' => 5,
            'review' => 'Motor klasik jadi seperti baru, restorasi luar biasa!',
            'media_paths' => ['review_media/restoration.jpeg'],
        ]);

        // Review untuk Zinc Plating
        Review::create([
            'order_id' => 'INV-20250506-0006',
            'rating' => 4,
            'review' => 'Baut dan mur tahan karat dengan hasil mengkilap.',
            'media_paths' => ['review_media/zincplating.jpeg'],
        ]);
    }
}