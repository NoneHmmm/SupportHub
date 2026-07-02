import {
  type ButtonHTMLAttributes,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "../../libs/cn";

const variants = {
  primary:
    "bg-notion-accent text-notion-accent-text hover:bg-notion-accent-hover active:opacity-85 disabled:opacity-40",
  secondary:
    "bg-transparent text-notion-text border border-notion-border hover:bg-notion-surface-hover active:bg-notion-bg-secondary disabled:text-notion-text-tertiary disabled:border-notion-border-light",
  ghost:
    "bg-transparent text-notion-text-secondary hover:bg-notion-surface-hover active:bg-notion-bg-secondary disabled:text-notion-text-tertiary",
  link: "bg-transparent text-notion-blue-text hover:text-notion-blue-text hover:underline active:opacity-80 disabled:text-notion-text-tertiary p-0 h-auto",
  danger:
    "bg-transparent text-notion-red-text hover:bg-notion-red-bg active:bg-notion-red-bg/60 disabled:text-notion-text-tertiary",
  primary_ghost:
    "bg-transparent text-notion-blue-text hover:bg-notion-blue-bg active:bg-notion-blue-bg/60 disabled:text-notion-text-tertiary",
};

const sizes = {
  sm: "h-7 px-2.5 text-xs gap-1",
  md: "h-8 px-3 text-sm gap-1.5",
  lg: "h-10 px-4 text-base gap-2",
};

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  asChild?: boolean;
  children?: ReactNode;
}

export const Button = ({
  variant = "secondary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  asChild = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md font-medium",
    "transition-colors duration-100 ease-in",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-notion-accent-ring focus-visible:ring-offset-1",
    "cursor-pointer select-none disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  );

  const content = (
    <>
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : Icon && iconPosition === "left" ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children && <span>{children}</span>}
      {Icon && iconPosition === "right" && !loading ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
    </>
  );

  if (asChild && isValidElement(children)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child = children as React.ReactElement<any>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      disabled: disabled || loading ? true : undefined,
    });
  }

  return (
    <button disabled={disabled || loading} className={classes} {...props}>
      {content}
    </button>
  );
};
