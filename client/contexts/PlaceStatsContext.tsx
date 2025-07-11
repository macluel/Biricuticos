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

  // Load shared data from JSON file and localStorage
  useEffect(() => {
    loadSharedData();
  }, []);

  const loadSharedData = async () => {
    try {
      // Load from the shared JSON file first
      const response = await fetch("/client/data/shared-interactions.json");
      let sharedData: PlaceInteraction[] = [];

      if (response.ok) {
        sharedData = await response.json();
      }

      // Load from localStorage (user's local changes)
      const localData = localStorage.getItem("biricuticos-interactions");
      let localInteractions: PlaceInteraction[] = [];

      if (localData) {
        try {
          localInteractions = JSON.parse(localData);
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }

      // Merge shared data with local data (local takes priority for conflicts)
      const mergedData = mergeInteractions(sharedData, localInteractions);
      setInteractions(mergedData);
    } catch (error) {
      console.error("Error loading shared data:", error);
      // Fallback to localStorage only
      const saved = localStorage.getItem("biricuticos-interactions");
      if (saved) {
        try {
          setInteractions(JSON.parse(saved));
        } catch (error) {
          console.error("Error loading place interactions:", error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Merge function to combine shared and local interactions
  const mergeInteractions = (
    shared: PlaceInteraction[],
    local: PlaceInteraction[],
  ): PlaceInteraction[] => {
    const merged = [...shared];

    // Add or update with local data
    local.forEach((localInteraction) => {
      const existingIndex = merged.findIndex(
        (item) => item.placeId === localInteraction.placeId,
      );
      if (existingIndex >= 0) {
        // Update existing with local data (local takes priority)
        merged[existingIndex] = localInteraction;
      } else {
        // Add new local interaction
        merged.push(localInteraction);
      }
    });

    return merged;
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
