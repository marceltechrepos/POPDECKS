import mongoose from "mongoose";

const PopupUser = new mongoose.Schema({
    Useremail: {
        type: String,
    },
    store_Id : {
        type: String,
    },
    userPhone:{
        type: String,
    }
})

const PopupUserModel = mongoose.model("PopupUser", PopupUser);

export default PopupUserModel