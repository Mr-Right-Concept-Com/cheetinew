import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    // TODO: Replace with actual Supabase auth check
    const checkAuth = async () => {
      try {
        // Simulate auth check
        const storedUser = localStorage.getItem("cheetihost_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Replace with actual Supabase authentication
    const mockUser: User = {
      id: "1",
      email,
      name: "Demo User",
      role: "user",
    };
    
    setUser(mockUser);
    localStorage.setItem("cheetihost_user", JSON.stringify(mockUser));
    navigate("/dashboard");
  };

  const signup = async (name: string, email: string, password: string) => {
    // TODO: Replace with actual Supabase authentication
    const mockUser: User = {
      id: "1",
      email,
      name,
      role: "user",
    };
    
    setUser(mockUser);
    localStorage.setItem("cheetihost_user", JSON.stringify(mockUser));
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cheetihost_user");
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
