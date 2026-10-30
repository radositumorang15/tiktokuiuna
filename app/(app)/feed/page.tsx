"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/feed/TopBar";
import { FeedColumn } from "@/components/feed/FeedColumn";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"mengikuti" | "untukkita">("untukkita");

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Top Bar Floating over Feed with 120px gradient scrim */}
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Vertical Snap Scroll Feed Column */}
      <FeedColumn />
    </div>
  );
}
