// import React from 'react';
import Image from "next/image"
import { IOrder } from "@/app/types";
import { dateFormat } from "@/lib/format";
import { ButtonPrimary } from '@/components/button';
import { BASE_IMAGE_MENU } from "@/global";
import { priceFormat } from "@/lib/format";
import { printNota } from "./printNota";

interface OrderDetailProps {
    order: IOrder | null; // Accepts the selected order or null if none
    onClose: () => void; // Function to close the detail view
}

const OrderDetail = ({ order, onClose } : OrderDetailProps) => {
    if (!order) return null; // Render nothing if no order is selected 

    return (
        <div className="py-24 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <button onClick={onClose} className="absolute top-10 right-10 text-gray hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>

            <div className="w-full max-w-5xl px-4 md:px-5 lg-6 mx-auto">
                <h2 className="font-bold text-3xl text-center">
                    Order Summary
                </h2>
                <p className="mt-2 text-lg text-secondary mb-8 text-center">
                    Thanks for making a order, you can check our order summary below
                </p>
                <div className="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                        <div className="data">
                            <p className="font-semibold">Order: #{order.id}<span className="text-primary font-medium"> | </span> Table Number: {order.table_number}</p>
                            <p className="font-semibold mt-2">Customer : <span className="font-medium">{order.customer} | {dateFormat(order.createdAt)}</span></p>
                        </div>
                        <ButtonPrimary type='button' onClick={() => printNota(order)}>
                            Print Nota
                        </ButtonPrimary>
                    </div>
                    <div className="w-full px-3 ">
                        {order.orderLists?.map((item, index) => (
                            <div key={index} className="flex flex-col lg:flex-row items-center py-6 border-b border-slate-300 gap-6 w-full">
                                <div className="img-box max-lg:w-full">
                                <Image width={60} height={60} src={`${BASE_IMAGE_MENU}/${item.Menu.picture}`} 
                                    className="rounded-sm overflow-hidden ml-4" alt="preview" unoptimized />
                                </div>
                                <div className="flex flex-row items-center w-full ">
                                    <div className="grid grid-cols-2 lg:grid-cols-2 w-full">
                                        <div className="flex items-center">
                                            <div className="">
                                                <h2 className="font-semibold text-xl mb-1">{item.Menu.name}</h2>
                                                <p className="font-normal text-sm text-secondary ">note: {item.note}</p>
                                            </div>

                                        </div>
                                        <div className="grid grid-cols-5">
                                            <div className="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                                                <div className="flex gap-3 lg:block">
                                                    <p className="font-medium">Qty</p>
                                                    <p className="lg:mt-4 font-bold text-sm">{item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                                                <div className="flex gap-3 lg:block">
                                                    <p className="font-medium">Price</p>
                                                    <p className="lg:mt-4 font-bold text-sm">{priceFormat(item.Menu.price)}</p>
                                                </div>
                                            </div>
                                            <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                                                <div className="flex gap-3 lg:block">
                                                    <p className="font-medium">Subtotal</p>
                                                    <p className="lg:mt-4 font-bold text-sm">{priceFormat(item.quantity * item.Menu.price)}</p>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full border-t border-gray-200 p-6 flex flex-col lg:flex-row items-center justify-between">
                        <div className="data">
                            <p className="font-semibold">Payment Method : <span className="font-medium">{order.payment_method}</span></p>
                            <p className="font-semibold mt-2">Cashier : <span className="font-medium">{order.User.name}</span></p>
                        </div>
                        <p className="font-semibold text-lg">Total Price: <span className="text-primary">{priceFormat(order.total_price)}</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default OrderDetail;