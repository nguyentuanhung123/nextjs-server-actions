import { fetchUsersAction } from "@/actions"
import AddNewUser from "@/components/add-new-user"
import SingleUserCard from "@/components/single-user-card";

const UserManagement = async () => {

    const getListOfUsers = await fetchUsersAction();

    // console.log(getListOfUsers);

    return (
        <div className='p-20 max-w-6xl mx-auto'>
            <div className="flex justify-between">
                <h1>User management</h1>
                <AddNewUser />
            </div>
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {
                    getListOfUsers && getListOfUsers.data && getListOfUsers.data.length > 0 ? (
                        getListOfUsers.data.map((userItem) => <SingleUserCard key={userItem.id} user={userItem}/>)
                    ) : (
                        <h3>No user found! Please create one.</h3>
                    )
                }
            </div>
        </div>
    )
}

export default UserManagement