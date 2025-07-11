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

  // Auto-sync functionality
  useEffect(() => {
    loadSharedData();
    setupAutoSync();
  }, []);

  const loadSharedData = async () => {
    try {
      // Load from the API endpoint (Netlify Function) or fallback to static file
      let sharedData: PlaceInteraction[] = [];

      try {
        const response = await fetch("/.netlify/functions/interactions");
        if (
          response.ok &&
          response.headers.get("content-type")?.includes("application/json")
        ) {
          sharedData = await response.json();
        } else {
          throw new Error("API not available or returned non-JSON");
        }
      } catch (apiError) {
        console.log("API not available, falling back to static file");
        // Fallback to static JSON file
        try {
          const fallbackResponse = await fetch(
            "/client/data/shared-interactions.json",
          );
          if (fallbackResponse.ok) {
            sharedData = await fallbackResponse.json();
          }
        } catch (fallbackError) {
          console.log("Static file also not available, using empty array");
        }
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

  const syncDataToServer = async (data: PlaceInteraction[]) => {
    try {
      const response = await fetch("/.netlify/functions/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Data synced automatically:", result.message);
      } else {
        console.error("❌ Failed to sync data to server");
      }
    } catch (error) {
      console.error("❌ Error syncing data:", error);
    }
  };

  const setupAutoSync = () => {
    // Auto-sync when user leaves the page
    const handleBeforeUnload = () => {
      const data = localStorage.getItem("biricuticos-interactions");
      if (data) {
        try {
          const interactions = JSON.parse(data);
          // Use sendBeacon for reliable delivery even when page is closing
          const blob = new Blob([JSON.stringify(interactions)], {
            type: "application/json",
          });
          navigator.sendBeacon("/.netlify/functions/interactions", blob);
        } catch (error) {
          console.error("Error syncing on page unload:", error);
        }
      }
    };

    // Auto-sync when page becomes hidden (tab switch, minimize, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const data = localStorage.getItem("biricuticos-interactions");
        if (data) {
          try {
            const interactions = JSON.parse(data);
            syncDataToServer(interactions);
          } catch (error) {
            console.error("Error syncing on visibility change:", error);
          }
        }
      }
    };

    // Auto-sync periodically (every 5 minutes if there are changes)
    let lastSyncData = "";
    const handlePeriodicSync = () => {
      const data = localStorage.getItem("biricuticos-interactions") || "[]";
      if (data !== lastSyncData) {
        try {
          const interactions = JSON.parse(data);
          syncDataToServer(interactions);
          lastSyncData = data;
        } catch (error) {
          console.error("Error in periodic sync:", error);
        }
      }
    };

    // Set up event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Periodic sync every 5 minutes
    const syncInterval = setInterval(handlePeriodicSync, 5 * 60 * 1000);

    // Cleanup function
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(syncInterval);
    };
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

  // Save to localStorage whenever interactions change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(
        "biricuticos-interactions",
        JSON.stringify(interactions),
      );
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
