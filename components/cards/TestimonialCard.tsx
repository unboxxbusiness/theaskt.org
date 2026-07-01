import React from "react";
import Typography from "../typography/Typography";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role?: string;
  company?: string;
}

export default function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  /* ponytail: dynamic testimonial frame with hover shift animations */
  return (
    <div className="space-y-4 p-6 border border-border-primary bg-bg-secondary font-serif italic text-text-body text-sm leading-6 rounded-xl hover:shadow-lg transition-all duration-300">
      <p>"{quote}"</p>
      <div className="font-sans not-italic pt-2">
        <Typography variant="small" className="font-semibold text-text-h">{name}</Typography>
        {role && <Typography variant="caption" className="text-text-muted normal-case tracking-normal">{role}</Typography>}
      </div>
    </div>
  );
}
