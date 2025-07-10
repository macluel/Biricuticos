// Utility function to clear all user data and start fresh
export function clearAllUserData() {
  // Clear localStorage data
  localStorage.removeItem("biricuticos-user");
  localStorage.removeItem("biricuticos-users");
  localStorage.removeItem("user-added-places");
  localStorage.removeItem("place-interactions");

  // Clear any other user-related data
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (
      key.startsWith("biricuticos-") ||
      key.startsWith("place-") ||
      key.startsWith("user-")
    ) {
      localStorage.removeItem(key);
    }
  });

  console.log("All user data cleared. Please refresh the page.");

  // Refresh the page to reset all contexts
  window.location.reload();
}

// Function to clear just the favorites and visited status
export function clearUserInteractions() {
  localStorage.removeItem("place-interactions");

  // Also clear from any logged-in user
  const savedUser = localStorage.getItem("biricuticos-user");
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      user.preferences = {
        favorites: [],
        visited: [],
        wantToTry: [],
      };
      localStorage.setItem("biricuticos-user", JSON.stringify(user));
    } catch (error) {
      console.error("Error clearing user preferences:", error);
    }
  }

  // Also clear from users database
  const users = localStorage.getItem("biricuticos-users");
  if (users) {
    try {
      const usersList = JSON.parse(users);
      usersList.forEach((u: any) => {
        u.preferences = {
          favorites: [],
          visited: [],
          wantToTry: [],
        };
      });
      localStorage.setItem("biricuticos-users", JSON.stringify(usersList));
    } catch (error) {
      console.error("Error clearing users preferences:", error);
    }
  }

  console.log("User interactions cleared. Please refresh the page.");
  window.location.reload();
}
