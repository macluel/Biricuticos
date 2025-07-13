import { cn } from "@/lib/utils";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";

interface FavoriteButtonProps {
  placeId: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FavoriteButton({
  placeId,
  size = "md",
  className,
}: FavoriteButtonProps) {
  const { getPlaceInteraction, toggleFavorite } = usePlaceStats();
  const interaction = getPlaceInteraction(placeId);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Determine which emoji to show based on interaction state
  const getEmoji = () => {
    if (interaction.isVisited && interaction.isFavorited) {
      // Visited and loved = Heart
      return "❤️";
    } else if (interaction.isVisited && !interaction.isFavorited) {
      // Just visited = Checkmark
      return "✅";
    } else if (!interaction.isVisited && interaction.isFavorited) {
      // Want to try = Pin
      return "📌";
    } else {
      // Nothing = Pin (to add to want to try)
      return "📌";
    }
  };

  const getStyles = () => {
    if (interaction.isVisited && interaction.isFavorited) {
      // Loved = Red heart background
      return "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30";
    } else if (interaction.isVisited && !interaction.isFavorited) {
      // Visited = Green checkmark background
      return "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30";
    } else if (!interaction.isVisited && interaction.isFavorited) {
      // Want to try = Blue pin background
      return "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30";
    } else {
      // Default = Gray
      return "hover:bg-blue-50 dark:hover:bg-blue-900/20";
    }
  };

  const getTitle = () => {
    if (interaction.isVisited && interaction.isFavorited) {
      return "💔 Remover dos favoritos";
    } else if (interaction.isVisited && !interaction.isFavorited) {
      return "❤️ Adicionar aos favoritos";
    } else if (!interaction.isVisited && interaction.isFavorited) {
      return "📌 Remover da lista";
    } else {
      return "📌 Adicionar à lista";
    }
  };

  const emoji = getEmoji();
  const styles = getStyles();

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent any parent link clicks
        e.stopPropagation();
        toggleFavorite(placeId);
      }}
      className={cn(
        "p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
        styles.button,
        "shadow-sm hover:shadow-md",
        className,
      )}
      title={getTitle()}
    >
      <span
        className={cn(
          "text-lg transition-all duration-300",
          interaction.isFavorited ? "animate-pulse" : "hover:animate-pulse",
          size === "sm" && "text-sm",
          size === "lg" && "text-xl",
        )}
      >
        {emoji}
      </span>
    </button>
  );
}
