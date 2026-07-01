import React from "react";
import { AlertCircle } from "lucide-react";
import Typography from "../typography/Typography";
import Button from "../ui/Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading content. Please check your connection or reload.",
  actionText,
  onAction,
}: ErrorStateProps) {
  /* ponytail: minimal flat error state display */
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-rose-500/25 bg-rose-500/5 rounded-2xl max-w-md mx-auto space-y-4">
      <div className="text-rose-500">
        <AlertCircle className="h-10 w-10 mx-auto" />
      </div>
      <div className="space-y-1.5">
        <Typography variant="h3" className="text-sm font-bold text-rose-600 dark:text-rose-400">{title}</Typography>
        <Typography variant="small" className="block max-w-xs mx-auto leading-relaxed text-rose-500/80">{description}</Typography>
      </div>
      {actionText && onAction ? (
        <Button variant="outline" size="sm" onClick={onAction} className="border-rose-500/20 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700">
          {actionText}
        </Button>
      ) : onAction ? (
        <Button variant="outline" size="sm" onClick={onAction} className="border-rose-500/20 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700">
          Try Again
        </Button>
      ) : null}
    </div>
  );
}
