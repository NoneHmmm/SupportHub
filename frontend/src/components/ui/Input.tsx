import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../libs/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, icon, className, wrapperClassName, id, ...props },
    ref,
  ) => {
    const inputId = id || props.name;

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-notion-text"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-notion-text-tertiary">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "block w-full rounded-md border border-notion-border bg-notion-surface px-3 py-2 text-sm text-notion-text",
              "placeholder:text-notion-text-tertiary",
              "transition-colors duration-100 ease-in",
              "focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text",
              "disabled:cursor-not-allowed disabled:bg-notion-bg-secondary disabled:text-notion-text-tertiary",
              "read-only:cursor-default read-only:bg-notion-bg-secondary",
              icon ? "pl-10" : undefined,
              error && "border-notion-red-text focus:border-notion-red-text focus:ring-notion-red-text",
              className,
            )}
            {...props}
          />
        </div>

        {error && <p className="text-xs text-notion-red-text">{error}</p>}

        {hint && !error && <p className="text-xs text-notion-text-tertiary">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
