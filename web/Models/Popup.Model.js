import mongoose from "mongoose";

const popupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    Content: {
        type: String,
        required: true
    },
    Store_Id: {
        type: String,
        required: true
    },
    storeName: {
        type: String,
    },
    collectEmail: {
        type: Boolean,
        default: false
    },
    collectSMS: {
        type: Boolean,
        default: false
    },
    delaySeconds: {
        type: Number,
        default: 0
    },
    scrollPercentage: {
        type: Number,
        default: 0
    },
    ctaText: {
        type: String,
        required: true
    },
    exitIntent: {
        type: Boolean,
        default: false
    },
    Image: {
        type: String,
        default: null
    }

}, { timestamps: true });

const PopupModel = mongoose.model("Popup", popupSchema);

export default PopupModel