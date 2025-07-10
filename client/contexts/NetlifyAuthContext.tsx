import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import netlifyIdentity from "netlify-identity-widget";

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

interface NetlifyAuthContextType {
  user: User | null;
  login: () => void;
  signup: () => void;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User["preferences"]>) => void;
  isLoading: boolean;
}

const NetlifyAuthContext = createContext<NetlifyAuthContextType | undefined>(
  undefined,
);

export function useNetlifyAuth() {
  const context = useContext(NetlifyAuthContext);
  if (context === undefined) {
    throw new Error("useNetlifyAuth must be used within a NetlifyAuthProvider");
  }
  return context;
}

interface NetlifyAuthProviderProps {
  children: ReactNode;
}

export function NetlifyAuthProvider({ children }: NetlifyAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Netlify Identity
    netlifyIdentity.init();

    // Check if user is already logged in
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      loadUserWithPreferences(currentUser);
    }
    setIsLoading(false);

    // Listen for login events
    netlifyIdentity.on("login", (user) => {
      loadUserWithPreferences(user);
      netlifyIdentity.close();
    });

    // Listen for logout events
    netlifyIdentity.on("logout", () => {
      setUser(null);
    });

    // Listen for signup events
    netlifyIdentity.on("init", (user) => {
      if (user) {
        loadUserWithPreferences(user);
      }
    });

    return () => {
      netlifyIdentity.off("login");
      netlifyIdentity.off("logout");
      netlifyIdentity.off("init");
    };
  }, []);

  const loadUserWithPreferences = (netlifyUser: any) => {
    // Get user preferences from localStorage (keyed by user ID)
    const userPrefsKey = `user-preferences-${netlifyUser.id}`;
    const savedPrefs = localStorage.getItem(userPrefsKey);

    let preferences = {
      favorites: [],
      visited: [],
      wantToTry: [],
    };

    if (savedPrefs) {
      try {
        preferences = JSON.parse(savedPrefs);
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    }

    const user: User = {
      id: netlifyUser.id,
      name:
        netlifyUser.user_metadata?.full_name ||
        netlifyUser.email?.split("@")[0] ||
        "User",
      email: netlifyUser.email || "",
      preferences,
    };

    setUser(user);
  };

  const login = () => {
    netlifyIdentity.open("login");
  };

  const signup = () => {
    netlifyIdentity.open("signup");
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  const updateUserPreferences = (
    newPreferences: Partial<User["preferences"]>,
  ) => {
    if (!user) return;

    const updatedPreferences = {
      ...user.preferences,
      ...newPreferences,
    };

    const updatedUser = {
      ...user,
      preferences: updatedPreferences,
    };

    setUser(updatedUser);

    // Save preferences to localStorage (keyed by user ID)
    const userPrefsKey = `user-preferences-${user.id}`;
    localStorage.setItem(userPrefsKey, JSON.stringify(updatedPreferences));
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUserPreferences,
    isLoading,
  };

  return (
    <NetlifyAuthContext.Provider value={value}>
      {children}
    </NetlifyAuthContext.Provider>
  );
}
