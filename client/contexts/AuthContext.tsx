import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    favorites: number[];
    visited: number[];
    wantToTry: number[];
  };
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User["preferences"]>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on init
  useEffect(() => {
    // Clear ALL user data to start completely fresh
    localStorage.removeItem("place-interactions");
    localStorage.removeItem("biricuticos-user");
    localStorage.removeItem("user-added-places");

    // Initialize demo users with clean preferences
    const existingUsers = localStorage.getItem("biricuticos-users");
    if (!existingUsers) {
      const demoUsers = [
        {
          id: "1",
          name: "Samuel Macedo",
          email: "samuel@exemplo.com",
          password: "123456",
          preferences: {
            favorites: [],
            visited: [],
            wantToTry: [],
          },
        },
      ];
      localStorage.setItem("biricuticos-users", JSON.stringify(demoUsers));
    }

    const savedUser = localStorage.getItem("biricuticos-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        localStorage.removeItem("biricuticos-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("biricuticos-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("biricuticos-user");
    }
  }, [user]);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - in real app, this would be an API call
    const mockUsers = JSON.parse(
      localStorage.getItem("biricuticos-users") || "[]",
    );
    const existingUser = mockUsers.find((u: any) => u.email === email);

    if (!existingUser) {
      setIsLoading(false);
      return { success: false, error: "E-mail não encontrado" };
    }

    if (existingUser.password !== password) {
      setIsLoading(false);
      return { success: false, error: "Senha incorreta" };
    }

    // Create user object without password
    const { password: _, ...userWithoutPassword } = existingUser;
    setUser(userWithoutPassword);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock signup - in real app, this would be an API call
    const mockUsers = JSON.parse(
      localStorage.getItem("biricuticos-users") || "[]",
    );
    const existingUser = mockUsers.find((u: any) => u.email === email);

    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: "E-mail já está em uso" };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In real app, this would be hashed
      preferences: {
        favorites: [],
        visited: [],
        wantToTry: [],
      },
    };

    // Save to mock database
    mockUsers.push(newUser);
    localStorage.setItem("biricuticos-users", JSON.stringify(mockUsers));

    try {
      // Set user (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error setting user after signup:", error);
      setIsLoading(false);
      return { success: false, error: "Erro interno após criar conta" };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserPreferences = (
    newPreferences: Partial<User["preferences"]>,
  ) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...newPreferences,
      },
    };

    setUser(updatedUser);

    // Also update in mock database
    const mockUsers = JSON.parse(
      localStorage.getItem("biricuticos-users") || "[]",
    );
    const userIndex = mockUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        preferences: updatedUser.preferences,
      };
      localStorage.setItem("biricuticos-users", JSON.stringify(mockUsers));
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUserPreferences,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
