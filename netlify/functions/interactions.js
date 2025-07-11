const fs = require("fs");
const path = require("path");

// Simple file-based storage for interactions data
const DATA_FILE = path.join(
  process.cwd(),
  "client",
  "data",
  "shared-interactions.json",
);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    if (event.httpMethod === "GET") {
      // Read current shared data
      let data = [];
      try {
        if (fs.existsSync(DATA_FILE)) {
          const fileContent = fs.readFileSync(DATA_FILE, "utf8");
          data = JSON.parse(fileContent);
        }
      } catch (error) {
        console.error("Error reading data file:", error);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      };
    }

    if (event.httpMethod === "POST" || event.httpMethod === "PUT") {
      // Update shared data
      const newData = JSON.parse(event.body);

      // Validate data structure
      if (!Array.isArray(newData)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Data must be an array" }),
        };
      }

      // Read existing data
      let existingData = [];
      try {
        if (fs.existsSync(DATA_FILE)) {
          const fileContent = fs.readFileSync(DATA_FILE, "utf8");
          existingData = JSON.parse(fileContent);
        }
      } catch (error) {
        console.error("Error reading existing data:", error);
      }

      // Merge new data with existing (new data takes priority)
      const mergedData = [...existingData];

      newData.forEach((newInteraction) => {
        const existingIndex = mergedData.findIndex(
          (item) => item.placeId === newInteraction.placeId,
        );
        if (existingIndex >= 0) {
          // Update existing with new data
          mergedData[existingIndex] = newInteraction;
        } else {
          // Add new interaction
          mergedData.push(newInteraction);
        }
      });

      // Write merged data back to file
      try {
        // Ensure directory exists
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(mergedData, null, 2));

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: "Data synced successfully",
            totalInteractions: mergedData.length,
          }),
        };
      } catch (error) {
        console.error("Error writing data file:", error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Failed to save data" }),
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
