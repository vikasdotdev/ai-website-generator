"use client";

import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext, UserDetail } from "@/context/UserDetailContext";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [UserDetailState, setUserDetail] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createOrFetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/users");
      setUserDetail(res.data);
    } catch (err) {
      console.error("createOrFetchUser error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch credits from DB — call this after AI generation or upgrade
  const refetchCredits = useCallback(async () => {
    try {
      const res = await axios.post("/api/users");
      setUserDetail(res.data);
    } catch (err) {
      console.error("refetchCredits error:", err);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      createOrFetchUser();
    } else if (isLoaded && !isSignedIn) {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, createOrFetchUser]);

  return (
    <UserDetailContext.Provider
      value={{
        UserDetail: UserDetailState,
        setUserDetail,
        refetchCredits,
        isLoading,
      }}
    >
      {children}
    </UserDetailContext.Provider>
  );
}
