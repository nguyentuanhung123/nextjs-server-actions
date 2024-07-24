import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: String, 
    lastName: String, 
    email: String,
    address: String
})

const User = mongoose.model.User || mongoose.model('User', UserSchema);

export default User;