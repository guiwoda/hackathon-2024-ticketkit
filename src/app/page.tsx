"use client";

import { useEffect } from "react";
import { useAuth } from "@crossmint/client-sdk-react-ui";

export default function Home() {
  const { login, jwt } = useAuth();

  useEffect(() => {
    if (!jwt) {
      login();
    } else {
      window.location.href = '/dashboard';
    }
  }, [jwt, login]);

  return null;
}
