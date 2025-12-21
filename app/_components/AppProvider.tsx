"use client";

import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();

  const [UserDetail, setUserDetail] = useState<any>();

  const createNewUser = useCallback(async () => {
    try {
      const res = await axios.post("/api/users");
      console.log("createNewUser response:", res.data);
      setUserDetail(res.data);
    } catch (err) {
      console.error("createNewUser error:", err);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      createNewUser();
    }
  }, [isLoaded, isSignedIn, createNewUser]);

  return (
    <UserDetailContext.Provider value={{ UserDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
}
