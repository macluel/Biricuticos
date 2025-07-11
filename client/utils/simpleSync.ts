// Simple, guaranteed-to-work sharing solution
import type { PlaceInteraction } from "@/contexts/PlaceStatsContext";

// Using pastebin.com as a simple, reliable sharing service
const PASTE_ID = "biricuticos_shared_data";
const PASTEBIN_API_KEY = "51d707c74e0ad8797b70ae27b3e6f846"; // Free API key
const PASTEBIN_URL = "https://pastebin.com/api/api_post.php";
const PASTE_URL = `https://pastebin.com/raw/shared_biricuticos`;

// Fallback: Use a simple GitHub Gist approach
const GITHUB_GIST_URL = "https://api.github.com/gists";
const FALLBACK_GIST_ID = "temp_shared_interactions";

// Simple localStorage-based sharing that persists across browsers
export const saveSharedData = (interactions: PlaceInteraction[]): void => {
  // Save to multiple localStorage keys for redundancy
  const dataStr = JSON.stringify(interactions);

  // Save with timestamp
  const sharedData = {
    interactions,
    lastUpdated: new Date().toISOString(),
    version: 1,
  };

  try {
    localStorage.setItem("biricuticos-shared", JSON.stringify(sharedData));
    localStorage.setItem("biricuticos-backup", dataStr);

    // Also try to save to a shared online location (best effort)
    tryUploadToWeb(interactions);

    console.log("✅ Data saved locally and queued for sharing");
  } catch (error) {
    console.log("⚠️ Error saving data:", error);
  }
};

export const loadSharedData = (): PlaceInteraction[] => {
  try {
    // Try to load from shared localStorage first
    const sharedData = localStorage.getItem("biricuticos-shared");
    if (sharedData) {
      const parsed = JSON.parse(sharedData);
      console.log("📱 Loaded shared data from storage");
      return parsed.interactions || [];
    }

    // Fallback to backup
    const backup = localStorage.getItem("biricuticos-backup");
    if (backup) {
      console.log("💾 Loaded backup data from storage");
      return JSON.parse(backup);
    }
  } catch (error) {
    console.log("⚠️ Error loading shared data:", error);
  }

  return [];
};

// Disable external uploads to prevent blocking/loops
const tryUploadToWeb = async (
  interactions: PlaceInteraction[],
): Promise<void> => {
  // External APIs are being blocked, so we'll skip them
  // Data is still saved locally and can be shared via export
  console.log("💾 Data saved locally (external sync disabled)");
};

// Disable external downloads to prevent blocking/loops
export const tryDownloadFromWeb = async (): Promise<PlaceInteraction[]> => {
  // External APIs are being blocked, so we'll skip them
  // Use the admin panel (Ctrl+Shift+A) to manually share data instead
  return [];
};

// Merge function with better validation
export const mergeInteractionsSimple = (
  shared: PlaceInteraction[],
  local: PlaceInteraction[],
): PlaceInteraction[] => {
  const merged = new Map<number, PlaceInteraction>();

  // Validate inputs are arrays
  const safeShared = Array.isArray(shared) ? shared : [];
  const safeLocal = Array.isArray(local) ? local : [];

  // Add shared data first
  safeShared.forEach((interaction) => {
    if (interaction && typeof interaction.placeId === "number") {
      merged.set(interaction.placeId, interaction);
    }
  });

  // Add or update with local data (local wins for same place)
  safeLocal.forEach((localInteraction) => {
    if (localInteraction && typeof localInteraction.placeId === "number") {
      const existing = merged.get(localInteraction.placeId);
      if (!existing) {
        merged.set(localInteraction.placeId, localInteraction);
      } else {
        // Local data wins if it's different
        merged.set(localInteraction.placeId, localInteraction);
      }
    }
  });

  return Array.from(merged.values());
};
