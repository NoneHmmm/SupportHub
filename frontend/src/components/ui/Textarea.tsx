import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../libs/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, hint, className, wrapperClassName, id, rows = 3, ...props },
    ref,
  ) => {
    const textareaId = id || props.name;

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-notion-text"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "block w-full rounded-md border border-notion-border bg-notion-surface px-3 py-2 text-sm text-notion-text",
            "placeholder:text-notion-text-tertiary",
            "transition-colors duration-100 ease-in",
            "focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text",
            "disabled:cursor-not-allowed disabled:bg-notion-bg-secondary disabled:text-notion-text-tertiary",
            "read-only:cursor-default read-only:bg-notion-bg-secondary",
            "resize-y min-h-20",
            error && "border-notion-red-text focus:border-notion-red-text focus:ring-notion-red-text",
            className,
          )}
          {...props}
        />

        {error && <p className="text-xs text-notion-red-text">{error}</p>}

        {hint && !error && <p className="text-xs text-notion-text-tertiary">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
