import { BrowserRouter, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import { QueryProvider, PolarisProvider } from "./components";
import Popups from "./pages/Popups.jsx";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setStoreDetail } from "./redux/Slices/StoreSlice.js";
import PopupUser from "./pages/PopupUser.jsx";

export default function App() {
  const dispatch = useDispatch();
  const [subscription, setSubscription] = useState(null);
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  const getStore = async () => {
    try {
      const response = await fetch('/api/store-info', {
        method: 'GET',
      });

      const data = await response.json();
      dispatch(setStoreDetail(data));
      console.log("Store Data", data);
    } catch (error) {
      console.error('Error fetching store info:', error);
    }
  }

  const getSubscription = async () => {
    try {
      const response = await fetch('/api/getBillingDetail');
      const data = await response.json();
      console.log("Subscription Data", data);
      setSubscription(data.subscriptions); // <<<<< FIXED
    } catch (error) {
      console.error('Error fetching subscription info:', error);
    }
  };

  const getExtension = async () => {
    try {
      const response = await fetch('/api/extension-info');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch extensions');
      }

      const data = await response.json();
      console.log("Extension Data", data);

      // If using REST API:
      // data will be an array of extension objects

      // data will be an array of {id, title, type}

    } catch (error) {
      console.error('Error details:', error);
    }
  };

  useEffect(() => {
    getSubscription();
    getStore();
    getExtension();
  }, []);


  const hasActiveSubscription = subscription && subscription.length > 0;

  return (
    <PolarisProvider>
      <BrowserRouter>
        <QueryProvider>
          <NavMenu>
            {hasActiveSubscription && (
              <>
                <Link to="/" rel="home" />
                <Link to="Popups" element={Popups}>Popups</Link>
                <Link to="PopupUser" element={PopupUser}>Popup User</Link>
              </>
            )}
            <Link to="/Pricing">Pricing</Link>

          </NavMenu>
          <Routes pages={pages} />
        </QueryProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}