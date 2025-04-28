"use client";

import { useState, useEffect } from "react";
import { Menu } from "@/app/types";
import { getCookie, storeCookie, removeCookie } from "@/lib/client-cookie";

interface CartProps {
  cart: { [key: string]: { item: Menu; quantity: number } };
  setCart: React.Dispatch<React.SetStateAction<{ [key: string]: { item: Menu; quantity: number } }>>;
}

const Cart = ({ cart, setCart }: CartProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS">("CASH");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Load cart from cookie when component mounts
  useEffect(() => {
    const savedCart = getCookie("cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setCart(cartData);
      } catch (error) {
        console.error("Error parsing cart cookie:", error);
      }
    }
  }, [setCart]);

  // Save cart to cookie whenever it changes
  useEffect(() => {
    storeCookie("cart", JSON.stringify(cart));
  }, [cart]);

  const getTotal = () => {
    return Object.values(cart).reduce((total, { item, quantity }) => total + item.price * quantity, 0);
  };

  const updateItemQuantity = (itemId: number, amount: number) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[itemId]) {
        const newQuantity = Math.max(0, newCart[itemId].quantity + amount);
        if (newQuantity === 0) {
          delete newCart[itemId];
        } else {
          newCart[itemId].quantity = newQuantity;
        }
      }
      return newCart;
    });
  };

  const handleCheckoutStart = () => {
    if (Object.keys(cart).length === 0) {
      alert("Keranjang kosong!");
      return;
    }
    setShowForm(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim() || !tableNumber.trim()) {
      alert("Harap isi nama dan nomor meja");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Prepare order data for API
      const orderData = {
        customer: customerName,
        table_number: tableNumber,
        payment_method: paymentMethod,
        total_price: Math.round(getTotal() * 1.05), // Including 5% service
        items: Object.values(cart).map(({ item, quantity }) => ({
          menu_id: item.id,
          name: item.name,
          quantity: quantity,
          price: item.price
        }))
      };
      
      // Store order in history cookie for transaction page
      const orderHistory = JSON.parse(getCookie("orderHistory") || "[]");
      const newOrder = {
        ...orderData,
        orderId: Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: "NEW",
        createdAt: new Date().toISOString()
      };
      
      orderHistory.push(newOrder);
      storeCookie("orderHistory", JSON.stringify(orderHistory));
      
      // Generate fake order ID for display
      setOrderId(newOrder.orderId);
      
      // Clear cart after successful order
      setCart({});
      removeCookie("cart");
      
      setOrderComplete(true);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Gagal membuat pesanan, silakan coba lagi.");
    } finally {
      setIsProcessing(false);
      setShowForm(false);
    }
  };

  const resetOrder = () => {
    setOrderComplete(false);
    setCustomerName("");
    setTableNumber("");
    setPaymentMethod("CASH");
    setOrderId("");
  };

  const cartItems = Object.values(cart);
  const isEmpty = cartItems.length === 0;

  // If order is complete, show success message
  if (orderComplete) {
    return (
      <div className="w-1/4 bg-white rounded-lg shadow-md p-4 max-h-screen overflow-auto">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h4>
          <p className="text-gray-600 mb-1">Nomor Pesanan: {orderId}</p>
          <p className="text-gray-600 mb-4">Metode Pembayaran: {paymentMethod}</p>
          <p className="text-sm text-gray-500 mb-6">Pesanan Anda sedang diproses dan akan segera diantar ke meja {tableNumber}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={resetOrder}
              className="bg-pink-800 text-white px-6 py-2 rounded-lg hover:bg-pink-950 transition-colors"
            >
              Pesan Lagi
            </button>
            <button 
              onClick={() => window.location.href = "/transaction"}
              className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Lihat Transaksi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If showing checkout form
  if (showForm) {
    return (
      <div className="w-1/4 bg-white rounded-lg shadow-md p-4 max-h-screen overflow-auto">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => setShowForm(false)}
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-xl font-bold text-gray-800">Checkout</h4>
        </div>
        
        <form onSubmit={handleCheckoutSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Nama</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Nomor Meja</label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Misalnya: 1, 2, 3, dst."
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1">Metode Pembayaran</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="CASH"
                  checked={paymentMethod === "CASH"}
                  onChange={() => setPaymentMethod("CASH")}
                  className="mr-2"
                />
                <span>Cash</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="QRIS"
                  checked={paymentMethod === "QRIS"}
                  onChange={() => setPaymentMethod("QRIS")}
                  className="mr-2"
                />
                <span>QRIS</span>
              </label>
            </div>
          </div>
          
          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between items-center font-bold">
              <span>Total:</span>
              <span className="text-xl">Rp{getTotal().toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-800 text-white hover:bg-pink-950'
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Konfirmasi Pesanan'
            )}
          </button>
        </form>
      </div>
    );
  }

  // Regular cart view
  return (
    <div className="w-1/4 bg-white rounded-lg shadow-md p-4 max-h-screen overflow-auto">
      <h4 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Cart</h4>
      
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="mb-4">
          <ul className="divide-y">
            {cartItems.map(({ item, quantity }) => (
              <li key={item.id} className="py-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{item.name}</h5>
                    <p className="text-sm text-gray-500">Rp{item.price.toLocaleString('id-ID')} x {quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">Rp{(item.price * quantity).toLocaleString('id-ID')}</p>
                    <div className="flex items-center mt-1 space-x-1">
                      <button
                        onClick={() => updateItemQuantity(item.id, -1)}
                        className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                      <span className="text-sm w-6 text-center">{quantity}</span>
                      <button 
                        onClick={() => updateItemQuantity(item.id, 1)}
                        className="bg-pink-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-auto border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total:</span>
          <span className="text-xl font-bold text-gray-800">Rp{getTotal().toLocaleString('id-ID')},-</span>
        </div>
        
        <button
          onClick={handleCheckoutStart}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isEmpty ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-pink-800 text-white hover:bg-pink-950'
          }`}
          disabled={isEmpty}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;