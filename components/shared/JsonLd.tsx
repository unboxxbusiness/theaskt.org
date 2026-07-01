"use client";

import React from "react";

interface JsonLdProps {
  schema: Record<string, any> | Array<Record<string, any>>;
}

export default function JsonLd({ schema }: JsonLdProps) {
  /* ponytail: dynamic client-safe JSON-LD structured data injector */
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
