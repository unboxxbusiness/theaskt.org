import React from "react";
import Button from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  /* ponytail: pagination control with previous/next locks */
  return (
    <nav className={`flex items-center justify-center gap-2 select-none ${className}`} aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Prev</span>
      </Button>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-h px-2">
        <span>Page {currentPage} of {totalPages}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
