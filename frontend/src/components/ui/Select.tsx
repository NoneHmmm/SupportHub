import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../libs/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  wrapperClassName?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      className,
      wrapperClassName,
      id,
      placeholder,
      children,
      ...props
    },
    ref,
  ) => {
    const selectId = id || props.name;

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {label && (
          <label
            htmlFor={selectId}
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

          <select
            ref={ref}
            id={selectId}
            className={cn(
              "block w-full appearance-none rounded-md border border-notion-border bg-notion-surface px-3 py-2 pr-8 text-sm text-notion-text",
              "transition-colors duration-100 ease-in",
              "focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text",
              "disabled:cursor-not-allowed disabled:bg-notion-bg-secondary disabled:text-notion-text-tertiary",
              icon ? "pl-10" : undefined,
              error && "border-notion-red-text focus:border-notion-red-text focus:ring-notion-red-text",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-notion-text-tertiary">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {error && <p className="text-xs text-notion-red-text">{error}</p>}

        {hint && !error && <p className="text-xs text-notion-text-tertiary">{hint}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
