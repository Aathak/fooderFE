<<<<<<< HEAD
export interface ISong {
  title: string;
  artist: string;
  description: string;
  source: string;
  thumbnail: string;
}

export interface IPlaylist {
  uuid: string;
  playlist_name: string;
  song_count: number;
=======
export interface User {
    id : number,
    uuid : string,
    name : string,
    email : string,
    password : string,
    profile_picture : string,
    role : string,
    createdAt : string,
    updatedAt : string
}

export interface Menu {
    id : number,
    uuid : string,
    name : string,
    price : number,
    picture : string,
    description : string,
    category : string,
    createdAt : string,
    updatedAt : string
}

export interface IOrderDetail {
    id : number,
    uuid : string,
    orderId : number,
    menuId : number,
    quantity : number,
    note: string,
    createdAt : string,
    updatedAt : string,
    Menu: Menu
}

export interface IOrder {
    id : number,
    uuid: number,
    userId : number,
    customer: string,
    table_number: number,
    total_price: number,
    payment_method: string,
    status: string,
    createdAt : string,
    updatedAt : string,
    User: User,
    orderLists: IOrderDetail[]
}

export interface ICart {
    menuId: number,
    name: string,
    price: number,
    quantity: number,
    note: string,
    image: string
}

export interface ICount {
    allUser: number,
    allMenus: number,
    newOrder: number,
    doneOrder: number
}

export interface IFavorite {
    name: string,
    count: number
>>>>>>> 036cc338caf3ef5e21370bdce29d86e3ce8fefc1
}