import express from "express";
import { getShop } from "../Controllers/Shop.Controller.js";
// import { createPopup,getPopup, popupUser } from "../Controllers/Popup.Controller.js";
import { upload } from "../Middleware/Multer.js";
import { createPopup, getAllPopupsUsers, getPopup, popupUser } from "../Controllers/Popup.Controller.js";
import { getBillingDetail } from "../Controllers/Billing.Controller.js";

const Router = express.Router();

Router.get("/store-info", getShop);
Router.post("/create-popup", upload.single("Image"), createPopup);
Router.get("/get-popup", getPopup);
Router.post("/create-popup-user", popupUser);
Router.get("/get-popup-user", getAllPopupsUsers);

Router.get("/getBillingDetail", getBillingDetail);
export default Router;