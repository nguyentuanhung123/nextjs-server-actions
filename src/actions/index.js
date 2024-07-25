'use server'

import connectToDB from "@/database"
import User from "@/models/user";
import { revalidatePath } from "next/cache";

// export const fetchListOfProducts = async () => {
//     const res = await fetch('https://dummyjson.com/products');
//     const data = await res.json();

//     return data?.products
// }

// add new user action
export async function addNewUserAction(formData, pathToRevalidate) {
    await connectToDB();

    try {
        // validate data using joi/ other packages you can use

        const newlyCreatedUser = await User.create(formData);
        if(newlyCreatedUser) {
            revalidatePath(pathToRevalidate);
            return {
                success: true,
                message: 'User added successfully'
            }
        } else {
            return {
                success: false,
                message: 'Some error occured. Please try again.'
            }
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Some error occured. Please try again.'
        }
    }
}

// fetch users actios
export async function fetchUsersAction() {
    await connectToDB();
    try {
        const listOfUsers = await User.find({});
        if(listOfUsers) {
            return {        
                success: true,  
                data: JSON.parse(JSON.stringify(listOfUsers))
            }   
        } else {
            return {
                success: false,
                message: 'Some error occured. Please try again.'
            }
        }
    }
    catch(error) {
        console.log(error);
        return {
            success: false,
            message: 'Some error occured. Please try again.'
        }
    }
}

// edit a user action

// delete a user action
export async function deleteUserAction(currentUserId, pathToRevalidate) {
    await connectToDB();
    try {
        const deletedUser = await User.findOneAndDelete({ _id: currentUserId });

        if(deletedUser) {
            revalidatePath(pathToRevalidate);
            return {
                success: true,  
                message: "User deleted successfully"
            }
        } else {
            return {
                success: false,
                message: 'Not able perform detele operation! Please try again later.'
            }
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Some error occured. Please try again.'
        }
    }
}