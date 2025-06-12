'use client';

import React, { useState } from 'react';
import { IOrder } from "@/app/types";
import { dateFormat, priceFormat } from "@/lib/format";
import OrderDetail from "./orderDetail";

interface OrderProps {
  orders: IOrder[];
}

const Order = ({ orders }: OrderProps) => {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

    const payment_method = (method: string): React.ReactNode => {
        if (method === "QRIS") {
            return <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                QRIS
            </span>
        }
        return <span className="bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400">
            Cash
        </span>
    }

    const status = (sts: string): React.ReactNode => {
        if (sts === "NEW") {
            return <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
                New
            </span>
        }
        if (sts === "PAID") {
            return <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                Paid
            </span>
        }
        return <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
            Done
        </span>
    }

    return (
    <>
        <div className="m-2">
            {orders.map((data, index) => (
                <div
                    key={`order-${index}`}
                    className="flex flex-wrap shadow m-2 cursor-pointer"
                    onClick={() => setSelectedOrder(data)}
                >
                <div className="w-full md:w-2/12 p-2">
                    <small className="text-sm font-bold text-primary">Date</small><br />
                    {dateFormat(data.createdAt)}
                </div>
                <div className="w-full md:w-2/12 p-2">
                    <small className="text-sm font-bold text-primary">Customer</small><br />
                    {data.customer}
                </div>
                <div className="w-full md:w-1/12 p-2">
                    <small className="text-sm font-bold text-primary">Table</small> <br />
                    {data.table_number}
                </div>
                <div className="w-full md:w-2/12 p-2">
                    <small className="text-sm font-bold text-primary">Total Price</small> <br />
                    {priceFormat(data.total_price)}
                </div>
                <div className="w-full md:w-2/12 p-2">
                    <small className="text-sm font-bold text-primary">Payment Method</small> <br />
                    {payment_method(data.payment_method)}
                </div>
                <div className="w-full md:w-1/12 p-2">
                    <small className="text-sm font-bold text-primary">Status</small> <br />
                    {status(data.status)}
                </div>
            </div>
            ))}
        </div>

        {selectedOrder && (
            <OrderDetail 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            />
        )}
    </>
    );
};

export default Order;