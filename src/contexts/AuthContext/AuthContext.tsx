import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { IAuthContextType, IUser } from "../../types";
import { usegetCurrentUser, usegetCurrentUserQuery, useSignOutAccount } from "../../lib/react-query/queris";



const INITIAL_STATE = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => {return {}},
};


const AuthContext = createContext<IAuthContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {mutateAsync:getCurrentUser}=usegetCurrentUser()
  const {mutateAsync:signOutAccount}=useSignOutAccount()
  const {data:getCurrentUserQuery}=usegetCurrentUserQuery()

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if(currentAccount.error) {
        signOutAccount()
        throw new Error(currentAccount.error)
      }
      const {data}=currentAccount
      setUser({
        id: data.$id,
        name: data.name,
        username: data.username,
        email: data.email,
        imageUrl: data.imageUrl,
        bio: data.bio,
        });
      setIsAuthenticated(true);
      return {data};
    } catch (error) {
      setIsAuthenticated(false);
      return {error};
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkAuthUser();
  }, [getCurrentUserQuery]);
  
  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
