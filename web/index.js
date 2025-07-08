// @ts-check
import path, { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import dbConn from "./Utils/db.js";
import Router from "./routes/Auth.Route.js";
import { fileURLToPath } from "url";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
app.use("/proxy/*", authenticateUser);
app.set('trust proxy', true)

app.use("/api", Router)
app.use("/proxy", Router)
async function authenticateUser(req, res, next) {
  let shop = req.query.shop;
  let storeName = await shopify.config.sessionStorage.findSessionsByShop(shop);
  console.log("storename for view", storeName);
  if (shop === storeName[0].shop) {
    next();
  } else {
    res.send("User is not Authorized");
  }
}

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PublicAssetsPath = path.join(__dirname, 'public/assets');
// Serve assets at /assets/filename
app.use('/assets', express.static(PublicAssetsPath));


app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

dbConn();


app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});