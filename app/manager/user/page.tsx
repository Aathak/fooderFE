import { User } from "@/app/types";
import { getCookies } from "@/lib/server-cookie";
import { BASE_API_URL } from "@/global";
import { BASE_IMAGE_PROFILE } from "@/global";
import { get } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert";
import Image from "next/image";
import Search from "./search";
import AddUser from "./addUser";
import EditUser from "./editUser";
import DeleteUser from "./deleteUser";

interface UserResponse {
  status: boolean;
  data: {
    status: boolean;
    data: User[];
    message: string;
  };
}

const getUser = async (search: string): Promise<User[]> => {
  try {
    const TOKEN = await getCookies("token");
    const url = `${BASE_API_URL}/user?search=${search}`;
    const response = (await get(url, TOKEN)) as UserResponse;

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

// const getMenu = async (search: string): Promise<Menu[]> => {
//   try {
//     const TOKEN = await getCookies("token");
//     const url = `${BASE_API_URL}/menu?search=${search}`;
//     const data = await get(url, TOKEN);
//     let result: Menu[] = [];
//     if (data && data.status && Array.isArray(data.data)) {
//       result = data.data as Menu[];
//     }
//     return result;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };

const UserPage = async ({
  searchParams,
}: {
  searchParams: {
    search?: string;
  };
}) => {
  const search = searchParams.search?.toString() ?? "";
  const menu: User[] = await getUser(search);

  const role = (cat: string): React.ReactNode => {
    const roleStyles = {
      CHASIER: "bg-blue-100 text-blue-800",
      MANAGER: "bg-purple-100 text-purple-800",
    };

    const style =
      roleStyles[cat as keyof typeof roleStyles] ||
      "bg-purple-100 text-purple-800";

    return (
      <span
        className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${style}`}
      >
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
          <div className="flex items-center w-full max-w-md flex-grow">
            <Search url={`/manager/user`} search={search} />
            <AddUser />
          </div>
        </div>

        {menu.length == 0 ? (
          <AlertInfo title="informasi">No data Available</AlertInfo>
        ) : (
          <>
            <div className="m-2">
              {menu.map((data, index) => (
                <div
                  key={`keyPrestasi${index}`}
                  className={`flex flex-wrap shadow m-2`}
                >
                  <div className="w-full md:w-1/12 p-2">
                    <small className="text-sm font-bold text-primary text-pink-950">
                      Picture
                    </small>
                    <br />
                    <Image
                      width={40}
                      height={40}
                      src={`${BASE_IMAGE_PROFILE}/${data.profile_picture}`}
                      className="rounded-sm overflow-hidden"
                      alt="preview"
                      unoptimized
                    />
                  </div>
                  <div className="w-full md:w-2/12 p-2">
                    <small className="text-sm font-bold text-primary text-pink-950">
                      Name
                    </small>{" "}
                    <br />
                    <div className="text-black">{data.name}</div>
                  </div>
                  <div className="w-full md:w-3/12 p-2">
                    <small className="text-sm font-bold text-primary text-pink-950">
                      Email
                    </small>{" "}
                    <br />
                    <div className="text-black">{data.email}</div>
                  </div>
                  <div className="w-full md:w-3/12 p-2 justify-between">
                    <small className="text-sm font-bold text-primary text-pink-950 justify-between">
                      Role
                    </small>{" "}
                    <br />
                    <div className="text-black">{role(data.role)}</div>
                  </div>
                  <div className="w-full md:w-2/12 p-2 justify-between">
                    <small className="text-sm font-bold text-primary text-pink-950 justify-between">
                      Action
                    </small>
                    <br />
                    <div className="flex gap-1"> 
                      <EditUser selectedUser={data} />
                      <DeleteUser selectedUser={data} />
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPage;
