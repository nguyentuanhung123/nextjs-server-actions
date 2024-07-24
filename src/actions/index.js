'use server'

import connectToDB from "@/database"
import User from "@/models/user";

// export const fetchListOfProducts = async () => {
//     const res = await fetch('https://dummyjson.com/products');
//     const data = await res.json();

//     return data?.products
// }

// add new user action
export async function addNewUserAction(formData) {
    await connectToDB();

    try {
        // validate data using joi/ other packages you can use

        const newlyCreatedUser = await User.create(formData);
        if(newlyCreatedUser) {
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

// edit a user action

// delete a user action