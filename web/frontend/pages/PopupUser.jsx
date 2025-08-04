import React, { useState, useEffect } from 'react';
import {
  Page,
  Card,
  DataTable,
  Spinner,
  TextField,
  Button,
  Stack
} from '@shopify/polaris';

import { TitleBar } from "@shopify/app-bridge-react";
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const PopupUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const store_ID = useSelector((state) => state.store.storeDetail.storeName);

  const getUsers = async () => {
    try {
      const response = await fetch(`/api/get-popup-user?storeName=${store_ID.toLowerCase()}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.popupUsers)) {
        const formatted = data.popupUsers.map((user, index) => ({
          id: user._id,
          name: `User ${index + 1}`,
          email: user.Useremail,
          number: user.userPhone,
        }));
        setUsers(formatted);
      } else {
        setUsers([]);
      }

      setLoading(false);
    } catch (error) {
      console.log('Failed to fetch users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store_ID) {
      getUsers();
    }
  }, [store_ID]);

  const rows = users.map(user => [
    user.name,
    user.email,
    user.number
  ]);



  return (
    <Page title="User List">
      <TitleBar title="Subscriber" />
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner accessibilityLabel="Loading users" size="large" />
        </div>
      ) : (
        <>
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'text']}
              headings={['User', 'Email', 'Number']}
              rows={rows}
              footerContent={`Showing ${users.length} users`}
            />
          </Card>

          
        </>
      )}
      <Toaster
        position='top-right'
      />
    </Page>
  );
};

export default PopupUser;
