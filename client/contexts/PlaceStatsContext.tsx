import React, { createContext, useContext, useState, useEffect } from "react";
import { places } from "@/data/config";
import {
  updateUrlWithData,
  loadDataFromUrl,
  copyShareableLink,
} from "@/utils/urlSharing";

// Types for place interactions
export interface PlaceInteraction {
  placeId: number;
  isFavorited: boolean;
  isVisited: boolean;
  dateAdded?: string;
  dateVisited?: string;
  userRating?: number; // User's rating from 1-5
  ratingDate?: string; // When the rating was given
}

interface PlaceStatsContextType {
  interactions: PlaceInteraction[];
  getPlaceInteraction: (placeId: number) => PlaceInteraction;
  toggleFavorite: (placeId: number) => void;
  toggleVisited: (placeId: number) => void;
  setUserRating: (placeId: number, rating: number) => void;
  getUserRating: (placeId: number) => number | null;
  stats: {
    totalPlaces: number;
    wantToTry: number;
    triedTogether: number;
    favorited: number;
    averageRating: number;
    ratedPlaces: number;
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
      // Load from URL first (shared data)
      const urlData = loadDataFromUrl();

      // Load from localStorage (personal data)
      const localData = localStorage.getItem("biricuticos-interactions");
      let localInteractions: PlaceInteraction[] = [];

      if (localData) {
        try {
          localInteractions = JSON.parse(localData);
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }

      // Merge URL data with local data
      let mergedData = localInteractions;
      if (urlData.length > 0) {
        const merged = new Map<number, PlaceInteraction>();

        // Add local data first
        localInteractions.forEach((interaction) => {
          merged.set(interaction.placeId, interaction);
        });

        // Add URL data (overwrites local for same places)
        urlData.forEach((interaction) => {
          merged.set(interaction.placeId, interaction);
        });

        mergedData = Array.from(merged.values());
        console.log("🔗 Merged shared data from URL");
      }

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

  // Save to localStorage and automatically update URL whenever interactions change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(
        "biricuticos-interactions",
        JSON.stringify(safeInteractions),
      );

      // Automatically update URL with current data for sharing
      if (safeInteractions.length > 0) {
        updateUrlWithData(safeInteractions);
      }
    }
  }, [interactions, isLoading, safeInteractions]);

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

        return safePrev.map((i) =>
          i.placeId === placeId ? updatedInteraction : i,
        );
      } else {
        updatedInteraction = {
          placeId,
          isFavorited: false,
          isVisited: true,
          dateVisited: new Date().toISOString(),
        };

        return [...safePrev, updatedInteraction];
      }
    });
  };

  // Set user rating for a place
  const setUserRating = (placeId: number, rating: number) => {
    setInteractions((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find((i) => i.placeId === placeId);
      let updatedInteraction: PlaceInteraction;

      if (existing) {
        updatedInteraction = {
          ...existing,
          userRating: rating,
          ratingDate: new Date().toISOString(),
        };

        return safePrev.map((i) =>
          i.placeId === placeId ? updatedInteraction : i,
        );
      } else {
        updatedInteraction = {
          placeId,
          isFavorited: false,
          isVisited: false,
          userRating: rating,
          ratingDate: new Date().toISOString(),
        };

        return [...safePrev, updatedInteraction];
      }
    });
  };

  // Get user rating for a place
  const getUserRating = (placeId: number): number | null => {
    const interaction = getPlaceInteraction(placeId);
    return interaction.userRating || null;
  };

  // Calculate dynamic stats
  const ratedInteractions = safeInteractions.filter((i) => i.userRating);
  const totalRating = ratedInteractions.reduce(
    (sum, i) => sum + (i.userRating || 0),
    0,
  );
  const averageRating =
    ratedInteractions.length > 0 ? totalRating / ratedInteractions.length : 0;

  const stats = {
    totalPlaces: places.length,
    wantToTry: safeInteractions.filter((i) => i.isFavorited && !i.isVisited)
      .length,
    triedTogether: safeInteractions.filter((i) => i.isVisited).length,
    favorited: safeInteractions.filter((i) => i.isFavorited).length,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    ratedPlaces: ratedInteractions.length,
  };

  const value = {
    interactions: safeInteractions,
    getPlaceInteraction,
    toggleFavorite,
    toggleVisited,
    setUserRating,
    getUserRating,
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
