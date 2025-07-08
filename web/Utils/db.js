import mongoose from "mongoose";

const dbConn = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:admin@cluster0.scibxar.mongodb.net/PopDecks");
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
};

export default dbConn;