import { Heart } from "lucide-react";
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

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent any parent link clicks
        e.stopPropagation();
        toggleFavorite(placeId);
      }}
      className={cn(
        "p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
        interaction.isFavorited
          ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30"
          : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
        "shadow-sm hover:shadow-md",
        className,
      )}
      title={
        interaction.isFavorited
          ? "💔 Remover dos favoritos"
          : "💖 Adicionar aos favoritos"
      }
    >
      <Heart
        className={cn(
          sizeClasses[size],
          "transition-all duration-300",
          interaction.isFavorited
            ? "fill-current animate-pulse"
            : "hover:animate-pulse",
        )}
      />
    </button>
  );
}
