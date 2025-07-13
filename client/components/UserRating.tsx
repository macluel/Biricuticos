import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";
import { cn } from "@/lib/utils";

interface UserRatingProps {
  placeId: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function UserRating({
  placeId,
  size = "md",
  showLabel = false,
}: UserRatingProps) {
  const { getUserRating, setUserRating } = usePlaceStats();
  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = getUserRating(placeId);

  const handleRating = (rating: number) => {
    setUserRating(placeId, rating);
  };

  const getStarSize = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-6 w-6";
      default:
        return "h-5 w-5";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hoverRating || currentRating || 0);
          return (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={cn(
                "transition-colors duration-150 hover:scale-110 transform",
                isActive
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600",
              )}
            >
              <Star
                className={cn(getStarSize(), isActive ? "fill-current" : "")}
              />
            </button>
          );
        })}
      </div>

      {showLabel && (
        <span className={cn("text-gray-600 dark:text-gray-400", getTextSize())}>
          {currentRating ? `${currentRating}/5` : "Avaliar"}
        </span>
      )}

      {currentRating && size !== "sm" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setUserRating(placeId, 0)}
          className="h-auto p-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Limpar
        </Button>
      )}
    </div>
  );
}

interface StaticRatingDisplayProps {
  rating: number;
  userRating?: number | null;
  size?: "sm" | "md" | "lg";
  showBoth?: boolean;
}

export function StaticRatingDisplay({
  rating,
  userRating,
  size = "md",
  showBoth = false,
}: StaticRatingDisplayProps) {
  const getStarSize = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-6 w-6";
      default:
        return "h-5 w-5";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* User Rating - Primary display */}
      {userRating && (
        <div className="flex items-center gap-1">
          <Star className={cn(getStarSize(), "text-yellow-400 fill-current")} />
          <span
            className={cn(
              "font-semibold text-gray-900 dark:text-gray-100",
              getTextSize(),
            )}
          >
            {userRating}
          </span>
          <span
            className={cn("text-gray-500 dark:text-gray-400", getTextSize())}
          >
            (sua avaliação)
          </span>
        </div>
      )}

      {/* Static Rating - Secondary display */}
      {(showBoth || !userRating) && (
        <div className="flex items-center gap-1">
          <Star
            className={cn(
              getStarSize(),
              userRating ? "text-gray-400" : "text-yellow-400 fill-current",
            )}
          />
          <span
            className={cn(
              userRating
                ? "text-gray-500 dark:text-gray-400"
                : "font-semibold text-gray-900 dark:text-gray-100",
              getTextSize(),
            )}
          >
            {rating}
          </span>
          {userRating && (
            <span
              className={cn("text-gray-400 dark:text-gray-500", getTextSize())}
            >
              (original)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
