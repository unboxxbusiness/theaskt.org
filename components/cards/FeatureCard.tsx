import React from "react";
import Typography from "../typography/Typography";

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  /* ponytail: generic card block for listing benefits and capabilities in grids */
  return (
    <div className={`p-5 border border-border-primary bg-bg-secondary rounded-xl space-y-2 hover:-translate-y-1 hover:border-link hover:shadow-lg transition-all duration-300 cursor-default ${className}`}>
      {icon && <div className="text-link mb-1">{icon}</div>}
      <Typography variant="h3" className="text-xs font-bold">{title}</Typography>
      <Typography variant="small">{description}</Typography>
    </div>
  );
}
