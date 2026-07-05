import { cn } from "../../libs/cn";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}

export const StarRating = ({
  value,
  onChange,
  readonly = false,
}: StarRatingProps) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={readonly}
        onClick={() => onChange?.(star)}
        className={cn(
          "transition-colors cursor-pointer",
          readonly ? "cursor-default" : "hover:scale-110",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill={star <= value ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={cn(
            "size-5",
            star <= value
              ? "text-notion-yellow-text"
              : "text-notion-text-tertiary",
          )}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    ))}
  </div>
);
