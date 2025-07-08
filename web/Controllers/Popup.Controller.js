import PopupModel from "../Models/Popup.Model.js";
import fs from "fs";
import PopupUserModel from "../Models/Popupuser.Model.js";

export const createPopup = async (req, res) => {

    try {
        const {
            Content,
            title,
            collectEmail,
            collectSMS,
            delaySeconds,
            scrollPercentage,
            ctaText,
            exitIntent,
            storeId,
            storeName
        } = req.body;

        const missingFields = [];

        if (!title) missingFields.push("title");
        if (!Content) missingFields.push("Content");
        if (!storeId) missingFields.push("storeId");
        if (collectEmail === undefined) missingFields.push("collectEmail");
        if (collectSMS === undefined) missingFields.push("collectSMS");
        if (delaySeconds === undefined) missingFields.push("delaySeconds");
        if (scrollPercentage === undefined) missingFields.push("scrollPercentage");
        if (!ctaText) missingFields.push("ctaText");
        if (exitIntent === undefined) missingFields.push("exitIntent");
        if (storeName === undefined) missingFields.push("storeName");
        if (!req.file) missingFields.push("Image");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
                success: false,
                missingFields
            });
        }

        // Convert form field strings to correct types
        const parsedCollectEmail = collectEmail === 'true';
        const parsedCollectSMS = collectSMS === 'true';
        const parsedDelaySeconds = parseInt(delaySeconds, 10);
        const parsedScrollPercentage = parseInt(scrollPercentage, 10);
        const parsedExitIntent = exitIntent === 'true';

        // Construct image URL
        const BASE_IMAGE_URL = "http://localhost:61979";
        // const BASE_IMAGE_URL = `${req.protocol}://${req.get("host")}`;

        const imageUrl = `${BASE_IMAGE_URL}/assets/${req.file.filename}`;

        const existingPopup = await PopupModel.findOne({ Store_Id: storeId });
        if (existingPopup) {

            try {
                const existingImageParts = existingPopup.Image.split("/");
                const imageName = existingImageParts[existingImageParts.length - 1];
                const imagePath = `./public/assets/${imageName}`;

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log("✅ Image deleted:", imageName);
                } else {
                    console.log("⚠️ Image not found:", imageName);
                }
            } catch (error) {
                console.error("❌ Error deleting image:", error.message);
            }

            const updatedPopup = await PopupModel.findOneAndUpdate(
                { Store_Id: storeId },
                {
                    Content,
                    title,
                    collectEmail: parsedCollectEmail,
                    collectSMS: parsedCollectSMS,
                    delaySeconds: parsedDelaySeconds,
                    scrollPercentage: parsedScrollPercentage,
                    ctaText,
                    exitIntent: parsedExitIntent,
                    Image: imageUrl,
                    storeName
                },
                { new: true }
            );

            return res.status(200).json({
                Popup: updatedPopup,
                message: "Popup updated successfully",
                success: true
            });
        }

        const newPopup = await PopupModel.create({
            Content,
            title,
            collectEmail: parsedCollectEmail,
            collectSMS: parsedCollectSMS,
            delaySeconds: parsedDelaySeconds,
            scrollPercentage: parsedScrollPercentage,
            ctaText,
            exitIntent: parsedExitIntent,
            Image: imageUrl,
            Store_Id: storeId,
            storeName
        });

        return res.status(201).json({
            popup: newPopup,
            message: "Popup created successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

//  get popup by storeName

export const getPopup = async (req, res) => {
    const { storeName } = req.query;

    if (!storeName) {
        return res.status(400).json({ message: "storeName is required", success: false });
    }

    try {
        const popup = await PopupModel.findOne({ storeName });
        if (!popup) {
            return res.status(404).json({ message: "Popup not found", success: false });
        }

        res.status(200).json({ popup, message: "Popup fetched successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


export const popupUser = async (req, res) => {
    console.log("👉 Payload received:", req.body);

    try {
        const { Useremail, store_Id, userPhone } = req.body; // 👈 FIXED HERE
        if (!store_Id) return res.status(400).json({ message: "store_Id is required", success: false });

        const popupUser = await PopupUserModel.create({
            Useremail,
            store_Id,
            userPhone
        });

        res.status(201).json({ popupUser, message: "popupUser created successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};