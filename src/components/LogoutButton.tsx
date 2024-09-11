'use client';

import React from 'react';
import { useAuth } from "@crossmint/client-sdk-react-ui";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
      Logout
    </button>
  );
};

export default LogoutButton;