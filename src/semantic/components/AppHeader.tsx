/**
 * AppHeader Component
 *
 * Top navigation bar with page title and action buttons
 */

import React from "react";
import { X } from "lucide-react";

interface AppHeaderProps {
  /** Optional title for the header */
  title?: string;

  /** Optional action buttons */
  actions?: React.ReactNode;

  /** CSS classes for container */
  className?: string;

  /** Optional callback when title changes (makes title editable) */
  onTitleChange?: (newTitle: string) => void;

  /** Optional callback when close button is clicked */
  onClose?: () => void;
}

export function AppHeader({
  title,
  actions,
  className = "",
  onTitleChange,
  onClose,
}: AppHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(title || "");

  React.useEffect(() => {
    setEditedTitle(title || "");
  }, [title]);

  const handleTitleSubmit = () => {
    if (onTitleChange && editedTitle.trim()) {
      onTitleChange(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setEditedTitle(title || "");
      setIsEditingTitle(false);
    }
  };

  return (
    <header
      className={`flex items-center justify-between border-b border-border bg-background px-6 py-2 ${className} `}>
      {/* Left side: Title */}
      <div className="flex items-center gap-6">
        {/* Title */}
        {title && (
          <div className="flex flex-col">
            {isEditingTitle && onTitleChange ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                autoFocus
                className="rounded border border-border bg-muted px-2 py-1 text-lg font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <div
                className={`text-lg font-semibold text-foreground ${onTitleChange ? "cursor-pointer transition-colors hover:text-primary" : ""} `}
                onClick={() => onTitleChange && setIsEditingTitle(true)}
                title={onTitleChange ? "Click to edit page name" : undefined}>
                {title}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side: Actions and Close button */}
      <div className="flex items-center gap-2">
        {actions}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close"
            title="Close">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}

/**
 * Action button for header
 */
interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "primary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function ActionButton({
  onClick,
  children,
  variant = "default",
  disabled = false,
  loading = false,
  icon,
  className = "",
}: ActionButtonProps) {
  const baseStyles = `
    inline-flex items-center gap-2 px-3 py-1.5
    text-sm font-medium rounded-md
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    default: "bg-background text-foreground border border-border hover:bg-accent",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
