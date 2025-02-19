import { Menu } from "@/app/types";
import { getCookies } from "@/lib/server-cookie";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { get } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert";
import Image from "next/image";
import Search from "./search";
import AddMenu from "./addMenu";
import EditMenu from "./editMenu";
import DeleteMenu from "./deleteMenu";

interface MenuResponse {
  status: boolean;
  data: {
    status: boolean;
    data: Menu[];
    message: string;
  };
}

const getMenu = async (search: string): Promise<Menu[]> => {
  try {
    const TOKEN = await getCookies("token");
    console.log("Token:", TOKEN); // Check if token exists
    
    const url = `${BASE_API_URL}/menu?search=${search}`;
    console.log("Fetching from URL:", url); // Verify the URL
    
    const response = (await get(url, TOKEN)) as MenuResponse;
    console.log("API Response:", response); // Check the full response

    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.error("Unexpected response structure:", response);
    return [];
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
};

const MenuPage = async ({
  searchParams,
}: {
  searchParams: {
    search?: string;
  };
}) => {
  const search = searchParams.search?.toString() ?? "";
  const menu: Menu[] = await getMenu(search);

  const category = (cat: string): React.ReactNode => {
    const categoryStyles = {
      FOOD: "bg-blue-100 text-blue-800",
      SNACK: "bg-indigo-100 text-indigo-800",
      DRINK: "bg-purple-100 text-purple-800",
    };

    const style =
      categoryStyles[cat as keyof typeof categoryStyles] ||
      "bg-purple-100 text-purple-800";

    return (
      <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${style}`}>
        {cat.charAt(0) + cat.slice(1).toLowerCase()}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-indigo-50">
      <div className="m-2 bg-white rounded-lg p-3 border-t-4 border-t-primary shadow-md w-full max-w-screen-lg mx-auto">
        <h4 className="text-xl font-bold mb-2 text-slate-950">Menu Data</h4>
        <p className="text-sm text-secondary mb-4 text-slate-950">
          Manage menu items: view, search, add, edit, or delete.
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center w-full max-w-md justify-between">
            <Search url="/manager/menu" search={search} />
            <AddMenu />
          </div>
        </div>

        {menu.length === 0 ? (
          <AlertInfo title="Information">No data Available</AlertInfo>
        ) : (
          <div className="m-2">
            {menu.map((data, index) => (
              <div key={`menu-item-${index}`} className="flex flex-wrap shadow m-2">
                <div className="w-full md:w-1/12 p-2">
                  <small className="text-sm font-bold text-primary text-pink-950">
                    Picture
                  </small>
                  <br />
                  <Image
                    width={40}
                    height={40}
                    src={`${BASE_IMAGE_MENU}/${data.picture}`}
                    className="rounded-sm overflow-hidden"
                    alt="preview"
                    unoptimized
                  />
                </div>
                <div className="w-full md:w-2/12 p-2">
                  <small className="text-sm font-bold text-primary text-pink-950">
                    Name
                  </small>
                  <br />
                  <div className="text-black">{data.name}</div>
                </div>
                <div className="w-full md:w-1/12 p-2">
                  <small className="text-sm font-bold text-primary text-pink-950">
                    Price
                  </small>
                  <br />
                  <div className="text-black">{data.price}</div>
                </div>
                <div className="w-full md:w-5/12 p-2">
                  <small className="text-sm font-bold text-primary text-pink-950">
                    Description
                  </small>
                  <br />
                  <div className="text-black">{data.description}</div>
                </div>
                <div className="w-full md:w-1/12 p-2">
                  <small className="text-sm font-bold text-primary text-pink-950">
                    Category
                  </small>
                  <br />
                  <div className="text-black">{category(data.category)}</div>
                </div>
                <div className="w-full md:w-2/12 p-2">
                  <small className="text-sm font-bold text-primary text-pink-950">
                    Action
                  </small>
                  <br />
                  <div className="flex gap-1"> 
                    <EditMenu selectedMenu={data} />
                    <DeleteMenu selectedMenu={data} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;