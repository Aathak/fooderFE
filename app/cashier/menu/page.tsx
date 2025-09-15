"use client"; //use effect dijalankan saat pertama kali halaman itu ditampilkan

import { useState, useEffect, SetStateAction } from "react";
import { ICart, Menu } from "@/app/types";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { get } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert";
import Image from "next/image";
import Search from "./search";
import Cart from "./card";

const getCookies = (key: string): string => {
  const cookies = document.cookie.split("; ");
  const found = cookies.find((row) => row.startsWith(`${key}=`));
  return found ? found.split("=")[1] : "";
};

const getMenu = async (search: string): Promise<Menu[]> => {
  try {
    const TOKEN = getCookies("token");
    const url = `${BASE_API_URL}/menu?search=${search}`;
    const { data } = await get(url, TOKEN);
    return data?.status ? [...data.data] : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const MenuButtons = ({ 
  menuId, 
  menu, 
  updateQuantity 
}: { 
  menuId: string; 
  menu: Menu[]; 
  updateQuantity: (item: Menu, amount: number) => void 
}) => {
  const menuItem = menu.find(item => item.id === Number(menuId));
  
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => menuItem && updateQuantity(menuItem, -1)} 
        className="bg-gray-200 text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center"
      >
        -
      </button>
      <button 
        onClick={() => menuItem && updateQuantity(menuItem, 1)} 
        className="bg-pink-800 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
};

const CategoryBadge = ({ 
  category 
}: { 
  category: string 
}) => {
  const categoryStyles = {
    FOOD: "bg-blue-100 text-blue-800",
    SNACK: "bg-indigo-100 text-indigo-800",
    DRINK: "bg-purple-100 text-purple-800",
  };

  const style =
    categoryStyles[category as keyof typeof categoryStyles] ||
    "bg-purple-100 text-purple-800";

  return (
    <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${style}`}>
      {category.charAt(0) + category.slice(1).toLowerCase()}
    </span>
  );
};

const MenuPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const search = searchParams.search ? searchParams.search.toString() : "";
  const [menu, setMenu] = useState<Menu[]>([]);
  const [cart, setCart] = useState<{
    [key: string]: { item: Menu; quantity: number };
  }>({});
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getMenu(search);
      setMenu(data);
    };
    fetchMenu();
  }, [search]);

  const updateQuantity = (item: Menu, amount: number) => {
    if (!item) return;
  
    setCart((prevCart) => {
      const prevQuantity = prevCart[String(item.id)]?.quantity || 0;
      const newQuantity = Math.max(0, prevQuantity + amount);
  
      console.log(`Item: ${item.name}, Prev: ${prevQuantity}, New: ${newQuantity}`);
  
      return {
        ...prevCart,
        [String(item.id)]: { item, quantity: newQuantity },
      };
    });
  };
  
  const filterMenuByCategory = (category: SetStateAction<string>) => {
    setActiveCategory(category); //activ
  };

  const getFilteredMenu = () => {
    if (activeCategory === "ALL") return menu;
    return menu.filter(item => item.category === activeCategory);
  };

  const filteredMenu = getFilteredMenu();

  return (
    <div className="min-h-screen bg-gray-100 flex space-x-6 p-6">
      <div className="bg-white shadow-lg rounded-lg w-3/4 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Menu Data</h2>
        <p className="text-gray-600 mb-4">Selamat makan!!</p>
        <div className="flex justify-center mb-6 gap-5">
          <Search url="/cashier/menu" search={search} />
          <button onClick={() => filterMenuByCategory("ALL")}>
            <div className={`text-sm ${activeCategory === "ALL" ? "bg-pink-950" : "bg-pink-800"} text-white rounded-md py-2 px-4 hover:bg-pink-950 font-bold`}>
              All
            </div>
          </button>
          <button onClick={() => filterMenuByCategory("FOOD")}>
            <div className={`text-sm ${activeCategory === "FOOD" ? "bg-pink-950" : "bg-pink-800"} text-white rounded-md py-2 px-4 hover:bg-pink-950 font-bold`}>
              Food
            </div>
          </button>
          <button onClick={() => filterMenuByCategory("SNACK")}>
            <div className={`text-sm ${activeCategory === "SNACK" ? "bg-pink-950" : "bg-pink-800"} text-white rounded-md py-2 px-4 hover:bg-pink-950 font-bold`}>
              Snack
            </div>
          </button>
          <button onClick={() => filterMenuByCategory("DRINK")}>
            <div className={`text-sm ${activeCategory === "DRINK" ? "bg-pink-950" : "bg-pink-800"} text-white rounded-md py-2 px-4 hover:bg-pink-950 font-bold`}>
              Drink
            </div>
          </button>
        </div>

        {filteredMenu.length === 0 ? (
          <AlertInfo title="Information">No data Available</AlertInfo>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredMenu.map((data, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden p-4 flex flex-col items-center border border-gray-200">
                <Image
                  src={`${BASE_IMAGE_MENU}/${data.picture}`}
                  width={150}
                  height={135}
                  className="w-32 h-32 object-cover max-w-max mb-3"
                  alt={data.name}
                  unoptimized
                />
                <h3 className="text-lg font-bold text-gray-800 text-center">{data.name}</h3>
                <h3 className="text-lg font-bold text-center mb-2">
                  <CategoryBadge category={data.category} />
                </h3>
                <p className="text-sm text-gray-600 text-center mb-2">{data.description}</p>
                <span className="text-lg font-bold text-primary">Rp{data.price.toLocaleString('id-ID')}</span>
                <div className="mt-3 flex items-center space-x-3">
                <MenuButtons menuId={String(data.id)} menu={menu} updateQuantity={updateQuantity} />
                  {cart[data.id] && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {cart[data.id].quantity} in cart
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Cart cart={cart} setCart={setCart} />
    </div>
  );
};

export default MenuPage;