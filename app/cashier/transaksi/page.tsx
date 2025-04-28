"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/client-cookie";

interface OrderItem {
  menu_id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  customer: string;
  table_number: string;
  payment_method: "CASH" | "QRIS";
  total_price: number;
  status: "NEW" | "PAID" | "DONE";
  createdAt: string;
  items: OrderItem[];
}

const TransactionPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load orders from cookie
    const orderHistory = getCookie("orderHistory");
    if (orderHistory) {
      try {
        const parsedOrders = JSON.parse(orderHistory);
        // Sort by newest first
        parsedOrders.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(parsedOrders);
      } catch (error) {
        console.error("Error parsing order history:", error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-700 mb-2">Belum ada transaksi</h2>
          <p className="text-gray-500 mb-4">Transaksi Anda akan muncul di sini setelah Anda melakukan pemesanan.</p>
          <a href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Pesan Sekarang
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg">Order #{order.orderId}</h2>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    Status: 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'PAID' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status === 'NEW' ? 'Baru' : 
                       order.status === 'PAID' ? 'Dibayar' : 
                       'Selesai'}
                    </span>
                  </span>
                  <span className="text-sm">
                    Pembayaran: 
                    <span className="ml-1 font-medium">
                      {order.payment_method}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Customer: {order.customer}</span>
                  <span>Meja: {order.table_number}</span>
                </div>
              </div>
              
              <div className="border-t border-b py-3">
                <h3 className="font-medium mb-2">Pesanan:</h3>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center mt-4 font-bold">
                <span>Total:</span>
                <span>Rp{order.total_price.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionPage;