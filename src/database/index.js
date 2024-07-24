import mongoose from "mongoose";

const connectToDB = async () => {
    const url = 'mongodb+srv://nguyentuanhung4529871036:nguyentuanhung123@server-actions.n8puntw.mongodb.net/?retryWrites=true&w=majority&appName=server-actions';

    mongoose
        .connect(url)
        .then(() => console.log('Database connection is successfully'))
        .catch((e) => console.log(e))
}

export default connectToDB;