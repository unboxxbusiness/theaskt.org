import React from "react";
import type { Metadata } from "next";
import LibraryView from "@/components/shared/LibraryView";

export const metadata: Metadata = {
  title: "My Library",
  description: "Manage your bookmarked topics, offline reading downloads, and opportunities reading history.",
};

export default function LibraryPage() {
  return <LibraryView />;
}
