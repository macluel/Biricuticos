// Simple browser-based sharing for development and production
import type { PlaceInteraction } from "@/contexts/PlaceStatsContext";

// Use GitHub Gist for reliable sharing (no API key needed for public gists)
const GIST_URL =
  "https://gist.githubusercontent.com/samuelm333/abc123def456789/raw/shared-interactions.json";

export const loadSharedInteractions = async (): Promise<PlaceInteraction[]> => {
  // Try multiple sources in order of preference

  // 1. Try GitHub Gist (most reliable for sharing)
  try {
    const response = await fetch(GIST_URL, {
      cache: "no-cache", // Always get fresh data
    });
    if (response.ok) {
      const data = await response.json();
      console.log(
        "🌐 Loaded shared data from GitHub Gist:",
        data.length,
        "interactions",
      );
      return data;
    }
  } catch (error) {
    console.log("🌐 GitHub Gist not available");
  }

  // 2. Fallback to static file in project
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

  // 3. Final fallback - empty array
  console.log("🔄 No shared data available, starting fresh");
  return [];
};

export const saveSharedInteractions = async (
  interactions: PlaceInteraction[],
): Promise<boolean> => {
  // For now, we'll use localStorage and provide easy export
  // The user can manually update the Gist when needed
  console.log("💾 Data saved locally. Use Ctrl+Shift+A to export for sharing.");
  return true;
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
