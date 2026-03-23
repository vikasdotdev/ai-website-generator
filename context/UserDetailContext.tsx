import { createContext } from "react";

export type UserDetail = {
  id: number;
  email: string;
  name: string;
  credits: number;
  created?: boolean;
};

export type UserDetailContextType = {
  UserDetail: UserDetail | null;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | null>>;
  refetchCredits: () => Promise<void>;
  isLoading: boolean;
};

export const UserDetailContext = createContext<UserDetailContextType>({
  UserDetail: null,
  setUserDetail: () => {},
  refetchCredits: async () => {},
  isLoading: true,
});
