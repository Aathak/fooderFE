import { ICart, Menu } from "@/app/types";
import { getCookies } from "@/lib/server-cookie";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { useState } from "react";
import { get } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert";
import Image from "next/image";
import Search from "./search";

const Card = ({ menu, Search }: { menu: Menu[], Search:string }) => {
    const [quantities, setQuantities] = useState<{ [key: string]: number}>({})
    const [notes, setNotes] = useState<{ [key: string]: string}>({})
    const [cart, setCart] = useState<ICart[]>([])

    const addToCart = (item: ICart) => {
        setCart((prev) => {
            const filteredCart= prev.filter((cartItem) => cartItem.menuId !== item.menuId)
            if (item.quantity > 0) {
                return [...filteredCart, item]
            }
            return filteredCart
        })
    }

    const handleAdd = (data: Menu) => {
        const currentQty = quantities[data.id] || 0
        const newQty = currentQty + 1

        setQuantities((prev) => ({...prev, [data.id]: newQty}))

        addToCart({
            menuId: data.id,
            name: data.name,
            price: data.price,
            quantity: newQty,
            note: notes[data.id]
        })
    }

    const handleRemove ={data}
} 