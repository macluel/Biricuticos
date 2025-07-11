// Simple browser-based sharing for development and production
import type { PlaceInteraction } from "@/contexts/PlaceStatsContext";

const STORAGE_KEY = "biricuticos-shared-interactions";

// Use a simple JSON file hosted service for real sharing
const SHARED_STORAGE_URL =
  "https://api.jsonbin.io/v3/b/67604cd8e41b4d34e4653b1a";
const API_KEY = "$2a$10$VVOPcmhJSH6fhEA.Fb7FXOZRGKc8uFLh5CnOPQn.9hGv7h8ZYmT8i";

export const loadSharedInteractions = async (): Promise<PlaceInteraction[]> => {
  // Try to load from shared online storage first
  try {
    const response = await fetch(`${SHARED_STORAGE_URL}/latest`, {
      headers: {
        "X-Master-Key": API_KEY,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const interactions = data.record || [];
      console.log(
        "🌐 Loaded shared data from online storage:",
        interactions.length,
        "interactions",
      );
      return interactions;
    }
  } catch (error) {
    console.log("🌐 Online storage not available");
  }

  // Fallback to static file
  try {
    const response = await fetch("/client/data/shared-interactions.json");
    if (response.ok) {
      const data = await response.json();
      console.log(
        "📄 Loaded shared data from static file:",
        data.length,
        "interactions",
      );
      return data;
    }
  } catch (error) {
    console.log("📄 Static file not available");
  }

  // Final fallback
  console.log("🔄 No shared data available, starting fresh");
  return [];
};

export const saveSharedInteractions = async (
  interactions: PlaceInteraction[],
): Promise<boolean> => {
  try {
    const response = await fetch(SHARED_STORAGE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
      body: JSON.stringify(interactions),
    });

    if (response.ok) {
      console.log(
        "✅ Data saved to shared storage:",
        interactions.length,
        "interactions",
      );
      return true;
    }
  } catch (error) {
    console.log("❌ Failed to save to shared storage:", error);
  }

  return false;
};

// Merge interactions with priority to newer ones
export const mergeInteractions = (
  shared: PlaceInteraction[],
  local: PlaceInteraction[],
): PlaceInteraction[] => {
  const merged = [...shared];

  local.forEach((localInteraction) => {
    const existingIndex = merged.findIndex(
      (item) => item.placeId === localInteraction.placeId,
    );

    if (existingIndex >= 0) {
      // Compare dates to see which is newer
      const existingDate = new Date(
        merged[existingIndex].dateAdded ||
          merged[existingIndex].dateVisited ||
          "1970-01-01",
      );
      const localDate = new Date(
        localInteraction.dateAdded ||
          localInteraction.dateVisited ||
          "1970-01-01",
      );

      // Use the newer interaction
      if (localDate >= existingDate) {
        merged[existingIndex] = localInteraction;
      }
    } else {
      // Add new interaction
      merged.push(localInteraction);
    }
  });

  return merged;
};
