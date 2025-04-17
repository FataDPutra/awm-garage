<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan Pesanan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            text-align: center;
            color: #1E40AF;
        }
        h3 {
            text-align: center;
            color: #4B5563;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #D1D5DB;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #F3F4F6;
            color: #374151;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #F9FAFB;
        }
        th:nth-child(1), td:nth-child(1) { width: 5%; } /* No */
        th:nth-child(2), td:nth-child(2) { width: 15%; } /* ID Pesanan */
        th:nth-child(3), td:nth-child(3) { width: 15%; } /* Tanggal */
        th:nth-child(4), td:nth-child(4) { width: 25%; } /* Pemesan */
        th:nth-child(5), td:nth-child(5) { width: 25%; } /* Layanan */
        th:nth-child(6), td:nth-child(6) { width: 15%; } /* Harga */
    </style>
</head>
<body>
    <h1>Laporan Pesanan</h1>
    <h3>{{ $filterDescription }}</h3>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>ID Pesanan</th>
                <th>Tanggal</th>
                <th>Pemesan</th>
                <th>Layanan</th>
                <th>Harga</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($orders as $index => $order)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $order->order_id }}</td>
                    <td>{{ \Carbon\Carbon::parse($order->created_at)->format('d M Y') }}</td>
                    <td>
                        @if($order->offerPrice && $order->offerPrice->purchaseRequest && $order->offerPrice->purchaseRequest->user)
                            {{ $order->offerPrice->purchaseRequest->user->full_name }}
                        @else
                            Tidak Diketahui
                        @endif
                    </td>
                    <td>
                        @if($order->offerPrice && $order->offerPrice->purchaseRequest && $order->offerPrice->purchaseRequest->service)
                            {{ $order->offerPrice->purchaseRequest->service->service_name }}
                        @else
                            Tidak Diketahui
                        @endif
                    </td>
                    <td>
                        @if($order->offerPrice && $order->offerPrice->total_price !== null)
                            Rp {{ number_format($order->offerPrice->total_price, 0, ',', '.') }}
                        @else
                            Tidak Diketahui
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center; padding: 16px;">
                        Tidak ada pesanan yang ditemukan untuk filter ini.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>