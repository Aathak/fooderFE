
import { IOrder } from "@/app/types";
import { getCookies } from "@/lib/server-cookie";
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global";
import { get } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert";
import { dateFormat } from "@/lib/format";
import { ButtonPrimary } from "@/components/button";
import Search from "./search";
import orders from "./order";
import Link from "next/link"
import Order from "./order";
import search from "./search";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

// Define the type for searchParams
interface SearchParams {
  search?: string;
  [key: string]: string | string[] | undefined;
}

const getOrder = async (search: string): Promise<IOrder[]> => {
  try {
      const TOKEN = await getCookies("token")
      const url = `${BASE_API_URL}/order?search=${search}`
      const { data } = await get(url, TOKEN)
      let result: IOrder[] = []
      if (data?.status) result = [...data.data]
      return result
  } catch (error) {
      console.log(error)
      return []
  }
}

// / Add proper type to the searchParams parameter
const TransactionPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  // Menggunakan nilai dari searchParams, dengan penanganan jika undefined
  const search = searchParams?.search ? searchParams.search.toString() : ``;
  const order = await getOrder(search);

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
        return (
          <div>
              <div className="m-2 bg-white rounded-lg p-3 border-t-4 border-t-primary shadow-md">
                  <h4 className="text-xl font-bold mb-2">Order Data</h4>
                  <p className="text-sm text-secondary mb-4">
                      This page displays order data, including details such as order status, customer information, and assigned staff.
                  </p>
                  <div className="flex justify-between items-center mb-4">
                      {/* Search Bar */}
                      <div className="flex items-center w-full max-w-md flex-grow">
                          <Search url={`/manager/user`} search={search} />
                      </div>                    
                  </div>
                  
                  {
                      order.length == 0 ?
                          <AlertInfo title="informasi">
                              No data Available
                          </AlertInfo> 
                          :
                          <>
                              <div className="m-2">
                              <Order orders={order} />
                            </div>
                        </>
                }
            </div>
        </div>
  );
};
}

export default TransactionPage;

// <div className="container mx-auto p-6">
    //   <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>
      
    //   <div className="space-y-6">
    //     {orders.map((order) => (
    //       <div key={order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
    //         <div className="p-4 border-b bg-gray-50">
    //           <div className="flex flex-wrap justify-between items-center">
    //             <div>
    //               <h2 className="font-bold text-lg">Order #{order.orderId}</h2>
    //               <p className="text-sm text-gray-600">
    //                 {new Date(order.createdAt).toLocaleString('id-ID', {
    //                   day: 'numeric',
    //                   month: 'long',
    //                   year: 'numeric',
    //                   hour: '2-digit',
    //                   minute: '2-digit'
    //                 })}
    //               </p>
    //             </div>
    //             <div className="flex items-center space-x-4">
    //               <span className="text-sm">
    //                 Status: 
    //                 <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
    //                   order.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 
    //                   order.status === 'PAID' ? 'bg-yellow-100 text-yellow-800' : 
    //                   'bg-green-100 text-green-800'
    //                 }`}>
    //                   {order.status === 'NEW' ? 'Baru' : 
    //                    order.status === 'PAID' ? 'Dibayar' : 
    //                    'Selesai'}
    //                 </span>
    //               </span>
    //               <span className="text-sm">
    //                 Pembayaran: 
    //                 <span className="ml-1 font-medium">
    //                   {order.payment_method}
    //                 </span>
    //               </span>
    //             </div>
    //           </div>
    //         </div>
            
    //         <div className="p-4">
    //           <div className="mb-4">
    //             <div className="flex justify-between text-sm text-gray-600 mb-2">
    //               <span>Customer: {order.customer}</span>
    //               <span>Meja: {order.table_number}</span>
    //             </div>
    //           </div>
              
    //           <div className="border-t border-b py-3">
    //             <h3 className="font-medium mb-2">Pesanan:</h3>
    //             <ul className="space-y-2">
    //               {order.items.map((item, index) => (
    //                 <li key={index} className="flex justify-between text-sm">
    //                   <span>{item.quantity}x {item.name}</span>
    //                   <span>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
              
    //           <div className="flex justify-between items-center mt-4 font-bold">
    //             <span>Total:</span>
    //             <span>Rp{order.total_price.toLocaleString('id-ID')}</span>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div> 