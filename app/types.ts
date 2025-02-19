export interface Menu {
    id: number,
    uuid: string,
    name: string,
    price: number,
    picture: string,
    description: string,
    category: string,
    createdAt: string,
    updatedAt: string
}

export interface IOrderDetail {
    id: number,
    uuid: string, 
    orderId: number,
    menuId: number,
    quantity: number,
    note: string,
    createdAt: string,
    updatedAt: string
}

export interface User {
    id: number,
    uuid: string,
    name: string,
    email: string,
    password: string,
    profile_picture: string,
    role: string,
    createdAt: string,
    updatedAt: string
}

export interface IOrder {
    updatedAt : string,
    user: User
    orderLists: IOrderDetail[]
}

export interface ICart {
    menuId: number,
    name: string,
    price: number,
    quantity: number,
    note: string
}