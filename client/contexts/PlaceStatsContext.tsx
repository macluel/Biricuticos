import React, { createContext, useContext, useState, useEffect } from "react";
import { places } from "@/data/config";
import {
  saveSharedData,
  loadSharedData,
  tryDownloadFromWeb,
  mergeInteractionsSimple,
} from "@/utils/simpleSync";

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

  // Ensure interactions is always an array
  const safeInteractions = Array.isArray(interactions) ? interactions : [];

  // Load shared data on mount
  useEffect(() => {
    loadSharedData();
  }, []);

  const loadSharedData = async () => {
    try {
      // Load from simple shared storage
      const sharedData = loadSharedData();

      // Try to get data from web (best effort)
      const webData = await tryDownloadFromWeb();

      // Load current localStorage
      const localData = localStorage.getItem("biricuticos-interactions");
      let localInteractions: PlaceInteraction[] = [];

      if (localData) {
        try {
          localInteractions = JSON.parse(localData);
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }

      // Merge all data sources (local wins for conflicts)
      let mergedData = sharedData;
      if (webData.length > 0) {
        mergedData = mergeInteractionsSimple(mergedData, webData);
      }
      if (localInteractions.length > 0) {
        mergedData = mergeInteractionsSimple(mergedData, localInteractions);
      }

      setInteractions(mergedData);

      // Save merged data back for sharing
      if (mergedData.length > 0) {
        saveSharedData(mergedData);
      }
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

  // Save to localStorage and share whenever interactions change
  useEffect(() => {
    if (!isLoading && interactions.length > 0) {
      localStorage.setItem(
        "biricuticos-interactions",
        JSON.stringify(interactions),
      );
      // Also save for sharing
      saveSharedData(interactions);
    }
  }, [interactions, isLoading]);

  // Get interaction for a specific place
  const getPlaceInteraction = (placeId: number): PlaceInteraction => {
    if (!Array.isArray(interactions)) {
      return {
        placeId,
        isFavorited: false,
        isVisited: false,
      };
    }

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
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find((i) => i.placeId === placeId);
      let updatedInteraction: PlaceInteraction;

      if (existing) {
        updatedInteraction = {
          ...existing,
          isFavorited: !existing.isFavorited,
          dateAdded: !existing.isFavorited
            ? new Date().toISOString()
            : existing.dateAdded,
        };

        return safePrev.map((i) =>
          i.placeId === placeId ? updatedInteraction : i,
        );
      } else {
        updatedInteraction = {
          placeId,
          isFavorited: true,
          isVisited: false,
          dateAdded: new Date().toISOString(),
        };

        return [...safePrev, updatedInteraction];
      }
    });
  };

  // Toggle visited status
  const toggleVisited = (placeId: number) => {
    setInteractions((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find((i) => i.placeId === placeId);
      let updatedInteraction: PlaceInteraction;

      if (existing) {
        updatedInteraction = {
          ...existing,
          isVisited: !existing.isVisited,
          dateVisited: !existing.isVisited
            ? new Date().toISOString()
            : existing.dateVisited,
        };

        return prev.map((i) =>
          i.placeId === placeId ? updatedInteraction : i,
        );
      } else {
        updatedInteraction = {
          placeId,
          isFavorited: false,
          isVisited: true,
          dateVisited: new Date().toISOString(),
        };

        return [...prev, updatedInteraction];
      }
    });
  };

  // Calculate dynamic stats
  const stats = {
    totalPlaces: places.length,
    wantToTry: Array.isArray(interactions)
      ? interactions.filter((i) => i.isFavorited && !i.isVisited).length
      : 0,
    triedTogether: Array.isArray(interactions)
      ? interactions.filter((i) => i.isVisited).length
      : 0,
    favorited: Array.isArray(interactions)
      ? interactions.filter((i) => i.isFavorited).length
      : 0,
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
