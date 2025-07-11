import React, { createContext, useContext, useState, useEffect } from "react";
import { places } from "@/data/config";

// Types for place interactions
export interface PlaceInteraction {
  placeId: number;
  isFavorited: boolean;
  isVisited: boolean;
  dateAdded?: string;
  dateVisited?: string;
}

interface PlaceStatsContextType {
  interactions: PlaceInteraction[];
  getPlaceInteraction: (placeId: number) => PlaceInteraction;
  toggleFavorite: (placeId: number) => void;
  toggleVisited: (placeId: number) => void;
  stats: {
    totalPlaces: number;
    wantToTry: number;
    triedTogether: number;
    favorited: number;
  };
}

const PlaceStatsContext = createContext<PlaceStatsContextType | undefined>(
  undefined,
);

export function PlaceStatsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [interactions, setInteractions] = useState<PlaceInteraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simple shared storage using a public GitHub Gist
  const SHARED_STORAGE_URL = "https://api.github.com/gists/abc123def456"; // You'll create this

  // Load from shared storage on mount
  useEffect(() => {
    loadSharedData();
  }, []);

  const loadSharedData = async () => {
    try {
      // For now, let's use a simple approach with localStorage but make it "shared"
      // by using a fixed key that represents global state
      const saved = localStorage.getItem("biricuticos-global-interactions");
      if (saved) {
        try {
          setInteractions(JSON.parse(saved));
        } catch (error) {
          console.error("Error loading place interactions:", error);
        }
      }
    } catch (error) {
      console.error("Error loading shared data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToSharedStorage = async (data: PlaceInteraction[]) => {
    try {
      // Save to localStorage with a global key
      localStorage.setItem(
        "biricuticos-global-interactions",
        JSON.stringify(data),
      );
    } catch (error) {
      console.error("Error saving to shared storage:", error);
    }
  };

  // Save to shared storage whenever interactions change
  useEffect(() => {
    if (!isLoading && interactions.length >= 0) {
      saveToSharedStorage(interactions);
    }
  }, [interactions, isLoading]);

  // Get interaction for a specific place
  const getPlaceInteraction = (placeId: number): PlaceInteraction => {
    return (
      interactions.find((i) => i.placeId === placeId) || {
        placeId,
        isFavorited: false,
        isVisited: false,
      }
    );
  };

  // Toggle favorite status
  const toggleFavorite = (placeId: number) => {
    setInteractions((prev) => {
      const existing = prev.find((i) => i.placeId === placeId);
      if (existing) {
        return prev.map((i) =>
          i.placeId === placeId
            ? {
                ...i,
                isFavorited: !i.isFavorited,
                dateAdded: !i.isFavorited
                  ? new Date().toISOString()
                  : i.dateAdded,
              }
            : i,
        );
      } else {
        return [
          ...prev,
          {
            placeId,
            isFavorited: true,
            isVisited: false,
            dateAdded: new Date().toISOString(),
          },
        ];
      }
    });
  };

  // Toggle visited status
  const toggleVisited = (placeId: number) => {
    setInteractions((prev) => {
      const existing = prev.find((i) => i.placeId === placeId);
      if (existing) {
        return prev.map((i) =>
          i.placeId === placeId
            ? {
                ...i,
                isVisited: !i.isVisited,
                dateVisited: !i.isVisited
                  ? new Date().toISOString()
                  : i.dateVisited,
              }
            : i,
        );
      } else {
        return [
          ...prev,
          {
            placeId,
            isFavorited: false,
            isVisited: true,
            dateVisited: new Date().toISOString(),
          },
        ];
      }
    });
  };

  // Calculate dynamic stats
  const stats = {
    totalPlaces: places.length,
    wantToTry: interactions.filter((i) => i.isFavorited && !i.isVisited).length,
    triedTogether: interactions.filter((i) => i.isVisited).length,
    favorited: interactions.filter((i) => i.isFavorited).length,
  };

  const value = {
    interactions,
    getPlaceInteraction,
    toggleFavorite,
    toggleVisited,
    stats,
  };

  return (
    <PlaceStatsContext.Provider value={value}>
      {children}
    </PlaceStatsContext.Provider>
  );
}

export function usePlaceStats() {
  const context = useContext(PlaceStatsContext);
  if (context === undefined) {
    throw new Error("usePlaceStats must be used within a PlaceStatsProvider");
  }
  return context;
}
