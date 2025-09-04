
import {
 
  useState,
  ReactNode,
  useEffect,

} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
}



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("token");

        if (token) {
          const res = await fetch("api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            Cookies.remove("token");
            setIsLoginModalOpen(true);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setUser(userData);
    Cookies.set("token", token, {
      expires: 7,
      HttpOnly: true,
      Secure: true,
      SameSite: "strict",
    });
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsLoginModalOpen(true);
  };

  return {children}
   
}

