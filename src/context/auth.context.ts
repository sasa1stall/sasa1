import { createContext } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
}

interface UserData {
  accessToken: string;
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: UserData) => void;
  register: (userData: UserData) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
}

export type { User, UserData, AuthContextType };

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
