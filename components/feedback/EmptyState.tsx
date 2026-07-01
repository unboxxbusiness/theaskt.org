import React from "react";
import { FolderOpen } from "lucide-react";
import Typography from "../typography/Typography";
import Button from "../ui/Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "No matches found",
  description = "There are no items matching this criteria. Try refining your filters or tags.",
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  /* ponytail: minimal flat empty state block */
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border-primary bg-bg-secondary rounded-2xl max-w-md mx-auto space-y-4">
      <div className="text-text-muted">
        {icon || <FolderOpen className="h-10 w-10 mx-auto opacity-60" />}
      </div>
      <div className="space-y-1.5">
        <Typography variant="h3" className="text-sm font-bold text-text-h">{title}</Typography>
        <Typography variant="small" className="block max-w-xs mx-auto leading-relaxed">{description}</Typography>
      </div>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
}
