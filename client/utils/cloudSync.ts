// Automatic cloud syncing using Supabase (free tier)
import type { PlaceInteraction } from "@/contexts/PlaceStatsContext";

// Supabase setup (free tier - no auth needed for this simple use case)
const SUPABASE_URL = "https://pmhkqtfxvdlzrsmgcgfr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtaGtxdGZ4dmRsenJzbWdjZ2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MDU2ODIsImV4cCI6MjA0OTk4MTY4Mn0.XVXjBqQgZPU6eOyiNuSrjsJOJRCDYxSFDjJpBLNIcFI";

// Simple REST API calls to Supabase
const supabaseRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

export const loadCloudInteractions = async (): Promise<PlaceInteraction[]> => {
  try {
    const response = await supabaseRequest("interactions?select=*");

    if (response.ok) {
      const data = await response.json();
      console.log("🌟 Loaded from cloud:", data.length, "interactions");
      return data || [];
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log("☁️ Cloud sync not available:", error.message);
    return [];
  }
};

export const saveCloudInteraction = async (
  interaction: PlaceInteraction,
): Promise<boolean> => {
  try {
    // First try to update existing record
    const updateResponse = await supabaseRequest(
      `interactions?place_id=eq.${interaction.placeId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          place_id: interaction.placeId,
          is_favorited: interaction.isFavorited,
          is_visited: interaction.isVisited,
          date_added: interaction.dateAdded,
          date_visited: interaction.dateVisited,
          updated_at: new Date().toISOString(),
        }),
      },
    );

    if (updateResponse.ok) {
      console.log(
        "✅ Updated cloud interaction for place",
        interaction.placeId,
      );
      return true;
    }

    // If update failed, try to insert new record
    const insertResponse = await supabaseRequest("interactions", {
      method: "POST",
      body: JSON.stringify({
        place_id: interaction.placeId,
        is_favorited: interaction.isFavorited,
        is_visited: interaction.isVisited,
        date_added: interaction.dateAdded,
        date_visited: interaction.dateVisited,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (insertResponse.ok) {
      console.log(
        "✅ Saved new cloud interaction for place",
        interaction.placeId,
      );
      return true;
    }

    throw new Error(`Insert failed: ${insertResponse.status}`);
  } catch (error) {
    console.log("❌ Failed to save to cloud:", error.message);
    return false;
  }
};

export const deleteCloudInteraction = async (
  placeId: number,
): Promise<boolean> => {
  try {
    const response = await supabaseRequest(
      `interactions?place_id=eq.${placeId}`,
      { method: "DELETE" },
    );

    if (response.ok) {
      console.log("🗑️ Deleted cloud interaction for place", placeId);
      return true;
    }

    throw new Error(`Delete failed: ${response.status}`);
  } catch (error) {
    console.log("❌ Failed to delete from cloud:", error.message);
    return false;
  }
};

// Sync all local data to cloud
export const syncAllToCloud = async (
  interactions: PlaceInteraction[],
): Promise<void> => {
  console.log("🔄 Syncing all interactions to cloud...");

  for (const interaction of interactions) {
    await saveCloudInteraction(interaction);
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("✅ All interactions synced to cloud");
};

// Merge cloud and local data (cloud takes priority for newer timestamps)
export const mergeCloudAndLocal = (
  cloudData: PlaceInteraction[],
  localData: PlaceInteraction[],
): PlaceInteraction[] => {
  const merged = new Map<number, PlaceInteraction>();

  // Add cloud data first
  cloudData.forEach((interaction) => {
    merged.set(interaction.placeId, interaction);
  });

  // Add or update with local data (only if local is newer)
  localData.forEach((localInteraction) => {
    const existing = merged.get(localInteraction.placeId);

    if (!existing) {
      // New local interaction
      merged.set(localInteraction.placeId, localInteraction);
    } else {
      // Compare timestamps to see which is newer
      const existingTime = new Date(
        existing.dateAdded || existing.dateVisited || "1970-01-01",
      ).getTime();
      const localTime = new Date(
        localInteraction.dateAdded ||
          localInteraction.dateVisited ||
          "1970-01-01",
      ).getTime();

      if (localTime > existingTime) {
        merged.set(localInteraction.placeId, localInteraction);
      }
    }
  });

  return Array.from(merged.values());
};
