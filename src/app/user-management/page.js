import { fetchUsersAction } from "@/actions"
import AddNewUser from "@/components/add-new-user"
import SingleUserCard from "@/components/single-user-card";

const UserManagement = async () => {

    const getListOfUsers = await fetchUsersAction();

    // console.log(getListOfUsers);

    return (
        <div className='p-20 max-w-6xl'>
            <div className="flex justify-between">
                <h1>User management</h1>
                <AddNewUser />
            </div>
            <div className="mt-6">
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