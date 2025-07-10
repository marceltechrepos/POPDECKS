import express from "express";
import { getShop } from "../Controllers/Shop.Controller.js";
// import { createPopup,getPopup, popupUser } from "../Controllers/Popup.Controller.js";
import { upload } from "../Middleware/Multer.js";
import { createPopup, getPopup, popupUser } from "../Controllers/Popup.Controller.js";

const Router = express.Router();

Router.get("/store-info", getShop);
Router.post("/create-popup", upload.single("Image"), createPopup);
Router.get("/get-popup", getPopup);
Router.post("/create-popup-user", popupUser);
export default Router;