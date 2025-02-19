
import { Menu } from "@/app/types";
import { getCookies } from "@/lib/server-cookie";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { get } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert";
import Image from "next/image";
import Search from "./search";
import MenuButtons from "@/components/MenuButtons";

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
  // const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  // const [loading, setLoading] = useState(true);
  // const [activeFilter, setActiveFilter] = useState<string>("ALL");

  // useEffect(() => {
  //   const fetchMenu = async () => {
  //     setLoading(true);
  //     const Menudata = await getMenu(search);
  //     setMenu(Menudata);
      
  //     // Initialize quantities state with zeros
  //     const initialQuantities: {[key: string]: number} = {};
  //     Menudata.forEach(item => {
  //       initialQuantities[item.id] = 0;
  //     });
  //     setQuantities(initialQuantities);
  //     setLoading(false);
  //   };
    
  //   fetchMenu();
  // }, [search]);

  // const handleIncrement = (id: number) => {
  //   setQuantities(prev => ({
  //     ...prev,
  //     [id]: (prev[id] || 0) + 1
  //   }));
  // };

  // const handleDecrement = (id: number) => {
  //   setQuantities(prev => ({
  //     ...prev,
  //     [id]: Math.max((prev[id] || 0) - 1, 0)
  //   }));
  // };

  // const filterMenu = (category: string) => {
  //   setActiveFilter(category);
  // };

  // const filteredMenu = activeFilter === "ALL" 
  //   ? menu 
  //   : menu.filter(item => item.category === activeFilter);

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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-screen p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 ">Menu Data</h2>
        <p className="text-gray-600 mb-4 ">Slmt makan</p>
        <div className="flex justify-center mb-6 gap-5">
          <Search url="/cashier/menu" search={search} />
          <button>
            <div className="text-sm bg-pink-800 text-white rounded-md py-2 px-4 hover:bg-pink-950 font-bold">
              All
            </div>
          </button>
          <button>
            <div className="text-sm bg-pink-800 text-white rounded-md py-2 px-4 hover:bg-pink-950 font-bold">
              Food
            </div>
          </button>
          <button>
            <div className="text-sm bg-pink-800 text-white rounded-md py-2 px-4 hover:bg-pink-950 font-bold">
              Snack
            </div>
          </button>
          <button>
            <div className="text-sm bg-pink-800 text-white rounded-md py-2 px-4 hover:bg-pink-950 font-bold ">
              Drink
            </div>
          </button>
        </div>

        {menu.length === 0 ? (
          <AlertInfo title="Information">No data Available</AlertInfo>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menu.map((data, index) => (
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
                <h3 className="text-lg font-bold text-center mb-2">{category(data.category)}</h3>
                <p className="text-sm text-gray-600 text-center mb-2">{data.description}</p>
                <span className="text-lg font-bold text-primary">Rp{data.price}</span>
                <div className="mt-3 flex items-center space-x-3">
                <MenuButtons menuId={data.id} />
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