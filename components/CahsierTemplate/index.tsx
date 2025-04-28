"use client";
import { ReactNode } from "react";
import Sidebar from "./sidebar";
import { User } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { getCookies } from "@/lib/server-cookie";
import { get } from "@/lib/api-bridge";
import { cookies } from "next/headers"


type MenuType = {
  id: string;
  icon: ReactNode;
  path: string;
  label: string;
};
type ManagerProp = {
  children: ReactNode;
  id: string;
  title: string;
  menuList: MenuType[];
};

// const getUser= async (): Promise<User | null> => {
//   try{
//     const TOKEN = await getCookies("token");
//     const url =`${BASE_API_URL}/user/profile_picture` //sesuai endpoint
//     const { data } = await get (url, TOKEN)
//     if (data?.status) return data.data;
//     return(null)
//   } catch (error) {
//     console.log(error)
//     return(null)
//   }
// }

const CahsierTemplate = ({ children, id, title, menuList }: ManagerProp) => {
  return (
    <div className="w-full min-h-dvh bg-slate-50">
      <Sidebar menuList={menuList} title={title} id={id}>
        {children}
      </Sidebar>
    </div>
  );
};
export default CahsierTemplate;
