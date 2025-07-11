// Automatic URL-based sharing system
import type { PlaceInteraction } from "@/contexts/PlaceStatsContext";

// Compress and encode data for URL sharing
export const encodeDataForUrl = (interactions: PlaceInteraction[]): string => {
  try {
    // Compress the data by only storing essential info
    const compressed = interactions.map((i) => ({
      p: i.placeId, // place id
      f: i.isFavorited ? 1 : 0, // favorited
      v: i.isVisited ? 1 : 0, // visited
      d: i.dateAdded || i.dateVisited || Date.now(), // date
    }));

    // Convert to JSON and encode
    const jsonStr = JSON.stringify(compressed);
    return btoa(jsonStr); // Base64 encode
  } catch (error) {
    console.log("Error encoding data:", error);
    return "";
  }
};

// Decode data from URL
export const decodeDataFromUrl = (encoded: string): PlaceInteraction[] => {
  try {
    const jsonStr = atob(encoded); // Base64 decode
    const compressed = JSON.parse(jsonStr);

    // Expand back to full format
    return compressed.map((c: any) => ({
      placeId: c.p,
      isFavorited: c.f === 1,
      isVisited: c.v === 1,
      dateAdded: c.f === 1 ? new Date(c.d).toISOString() : undefined,
      dateVisited: c.v === 1 ? new Date(c.d).toISOString() : undefined,
    }));
  } catch (error) {
    console.log("Error decoding data:", error);
    return [];
  }
};

// Update URL with current data (automatic)
export const updateUrlWithData = (interactions: PlaceInteraction[]): void => {
  try {
    if (interactions.length === 0) return;

    const encoded = encodeDataForUrl(interactions);
    if (encoded.length > 1000) {
      // URL too long, skip
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("shared", encoded);

    // Update URL without page reload
    window.history.replaceState({}, "", url.toString());
  } catch (error) {
    console.log("Error updating URL:", error);
  }
};

// Load data from URL (automatic)
export const loadDataFromUrl = (): PlaceInteraction[] => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const shared = urlParams.get("shared");

    if (shared) {
      console.log("🔗 Loading shared data from URL");
      return decodeDataFromUrl(shared);
    }
  } catch (error) {
    console.log("Error loading from URL:", error);
  }

  return [];
};

// Generate shareable link
export const generateShareableLink = (
  interactions: PlaceInteraction[],
): string => {
  const encoded = encodeDataForUrl(interactions);
  const url = new URL(window.location.origin);
  url.searchParams.set("shared", encoded);
  return url.toString();
};

// Copy shareable link to clipboard
export const copyShareableLink = (interactions: PlaceInteraction[]): void => {
  const link = generateShareableLink(interactions);
  navigator.clipboard
    .writeText(link)
    .then(() => {
      console.log("🔗 Shareable link copied to clipboard!");
      alert(
        "🎉 Link copied! Share this link with others to sync your favorites and visited places!",
      );
    })
    .catch(() => {
      console.log("📝 Shareable link:", link);
      alert(`📝 Copy this link to share:\n\n${link}`);
    });
};
