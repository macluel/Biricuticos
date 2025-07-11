import React, { createContext, useContext, useState, useEffect } from "react";
import { places } from "@/data/config";
import {
  loadCloudInteractions,
  saveCloudInteraction,
  mergeCloudAndLocal,
} from "@/utils/cloudSync";

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
      // Load from cloud database
      const cloudData = await loadCloudInteractions();

      // Load from localStorage (backup/offline data)
      const localData = localStorage.getItem("biricuticos-interactions");
      let localInteractions: PlaceInteraction[] = [];

      if (localData) {
        try {
          localInteractions = JSON.parse(localData);
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }

      // Merge cloud and local data (cloud takes priority for newer timestamps)
      const mergedData = mergeCloudAndLocal(cloudData, localInteractions);
      setInteractions(mergedData);
    } catch (error) {
      console.error("Error loading cloud data:", error);
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
    await saveSharedInteractions(data);
  };

  const setupAutoSync = () => {
    // Auto-sync when user leaves the page
    const handleBeforeUnload = () => {
      const data = localStorage.getItem("biricuticos-interactions");
      if (data) {
        try {
          const interactions = JSON.parse(data);
          // Use sendBeacon for reliable delivery even when page is closing
          const formData = new FormData();
          formData.append("data", JSON.stringify(interactions));

          // Try sendBeacon first, fallback to fetch
          const success = navigator.sendBeacon(
            "/.netlify/functions/interactions",
            formData,
          );
          if (!success) {
            // Fallback for development or if sendBeacon fails
            fetch("/.netlify/functions/interactions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(interactions),
              keepalive: true,
            }).catch(() => {
              console.log("⚠️ Final sync failed - data saved locally");
            });
          }
        } catch (error) {
          console.log("⚠️ Error syncing on page unload:", error.message);
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
      let updatedInteraction: PlaceInteraction;

      if (existing) {
        updatedInteraction = {
          ...existing,
          isFavorited: !existing.isFavorited,
          dateAdded: !existing.isFavorited
            ? new Date().toISOString()
            : existing.dateAdded,
        };

        // Automatically sync to cloud
        saveCloudInteraction(updatedInteraction);

        return prev.map((i) =>
          i.placeId === placeId ? updatedInteraction : i,
        );
      } else {
        updatedInteraction = {
          placeId,
          isFavorited: true,
          isVisited: false,
          dateAdded: new Date().toISOString(),
        };

        // Automatically sync to cloud
        saveCloudInteraction(updatedInteraction);

        return [...prev, updatedInteraction];
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
