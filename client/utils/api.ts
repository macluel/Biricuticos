// API utilities with development fallback
export const API_BASE = import.meta.env.DEV
  ? "/api" // Development fallback
  : "/.netlify/functions";

export const fetchInteractions = async (): Promise<any[]> => {
  try {
    // Try API endpoint first
    const response = await fetch(`${API_BASE}/interactions`);

    if (
      response.ok &&
      response.headers.get("content-type")?.includes("application/json")
    ) {
      return await response.json();
    }

    throw new Error("API not available");
  } catch (error) {
    console.log("API not available, using fallback");

    // Fallback to static file
    try {
      const fallbackResponse = await fetch(
        "/client/data/shared-interactions.json",
      );
      if (fallbackResponse.ok) {
        return await fallbackResponse.json();
      }
    } catch (fallbackError) {
      console.log("Static file not available");
    }

    return [];
  }
};

export const syncInteractions = async (data: any[]): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/interactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (
      response.ok &&
      response.headers.get("content-type")?.includes("application/json")
    ) {
      const result = await response.json();
      console.log("✅ Data synced:", result.message);
      return true;
    }

    console.log("⚠️ Sync endpoint not available");
    return false;
  } catch (error) {
    console.log("⚠️ Sync failed:", error.message);
    return false;
  }
};
