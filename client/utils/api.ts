// API utilities with proper fallback chain
export const fetchInteractions = async (): Promise<any[]> => {
  // Try Netlify Functions first (production)
  try {
    const response = await fetch("/.netlify/functions/interactions");
    if (
      response.ok &&
      response.headers.get("content-type")?.includes("application/json")
    ) {
      return await response.json();
    }
  } catch (error) {
    // Netlify Functions not available (probably development)
  }

  // Fallback to static file
  try {
    const fallbackResponse = await fetch(
      "/client/data/shared-interactions.json",
    );
    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      console.log("📄 Loaded shared data from static file");
      return data;
    }
  } catch (error) {
    console.log("📄 Static file not available");
  }

  // Final fallback to empty array
  console.log("🔄 Using empty interactions array");
  return [];
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
