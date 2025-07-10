import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { places as defaultPlaces } from "@/data/config";

interface Place {
  id: number;
  name: string;
  location: string;
  state: string;
  type: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  description: string;
  tags: string[];
  lat: number;
  lng: number;
  addedBy?: string;
  addedAt?: string;
}

interface PlacesContextType {
  places: Place[];
  addPlace: (place: Place) => void;
  refreshPlaces: () => void;
}

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (context === undefined) {
    throw new Error("usePlaces must be used within a PlacesProvider");
  }
  return context;
}

interface PlacesProviderProps {
  children: ReactNode;
}

export function PlacesProvider({ children }: PlacesProviderProps) {
  const [places, setPlaces] = useState<Place[]>(defaultPlaces);

  const refreshPlaces = () => {
    try {
      const userAddedPlaces = JSON.parse(
        localStorage.getItem("user-added-places") || "[]",
      );
      const allPlaces = [...defaultPlaces, ...userAddedPlaces];
      setPlaces(allPlaces);
    } catch (error) {
      console.error("Error loading user places:", error);
      setPlaces(defaultPlaces);
    }
  };

  const addPlace = (newPlace: Place) => {
    try {
      console.log("PlacesContext: Adding new place:", newPlace);
      const userAddedPlaces = JSON.parse(
        localStorage.getItem("user-added-places") || "[]",
      );
      userAddedPlaces.push(newPlace);
      localStorage.setItem(
        "user-added-places",
        JSON.stringify(userAddedPlaces),
      );
      console.log("PlacesContext: Place added to localStorage, refreshing...");
      refreshPlaces();
    } catch (error) {
      console.error("Error adding place:", error);
    }
  };

  // Load user places on mount
  useEffect(() => {
    console.log("PlacesContext: Loading places...");
    refreshPlaces();

    // Listen for storage changes (in case places are added in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user-added-places") {
        refreshPlaces();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = {
    places,
    addPlace,
    refreshPlaces,
  };

  return (
    <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
  );
}
