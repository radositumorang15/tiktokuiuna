"use client";

import React, { useState } from "react";
import { siteConfig } from "@/content/site";
import { wish } from "@/lib/wishes";

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<"aktivitas" | "pesan">("aktivitas");
  const activities = siteConfig.inbox.activities;
  const chatMessages = siteConfig.inbox.chat;

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white flex flex-col select-none overflow-hidden pb-16">
      {/* Top Header: Kotak masuk */}
      <div className="px-4 pt-6 pb-3 border-b border-[#3a3a3a] bg-black shrink-0">
        <h1 className="text-[18px] font-bold text-white text-center">
          Kotak Masuk
        </h1>

        {/* Sub-tabs: Aktivitas | Pesan */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <button
            type="button"
            onClick={() => setActiveTab("aktivitas")}
            className={`text-[15px] font-semibold pb-1.5 transition-colors relative ${
              activeTab === "aktivitas"
                ? "text-white border-b-2 border-white"
                : "text-[#a8a8a8]"
            }`}
          >
            Aktivitas
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("pesan");
              wish("inbox");
            }}
            className={`text-[15px] font-semibold pb-1.5 transition-colors relative ${
              activeTab === "pesan"
                ? "text-white border-b-2 border-white"
                : "text-[#a8a8a8]"
            }`}
          >
            Pesan Cinta
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {activeTab === "aktivitas" ? (
          /* Activity Stream */
          <div className="space-y-1">
            {activities.map((act) => (
              <div
                key={act.id}
                onClick={() => wish("inbox")}
                className="flex items-center gap-3 py-3 border-b border-[#3a3a3a]/40 active:opacity-75 transition-opacity cursor-pointer"
              >
                <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-primary/20 border border-primary shrink-0 flex items-center justify-center">
                  <img
                    src="/avatars/creator.jpg"
                    alt="Rado"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23fe2c55'/%3E%3C/svg%3E";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-[14px] font-semibold text-white truncate">
                    {act.title}
                  </h2>
                  <p className="text-[13px] text-[#a8a8a8] truncate">
                    {act.subtitle}
                  </p>
                </div>

                <span className="text-[12px] text-[#737373] shrink-0">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Scripted Messages Thread */
          <div className="space-y-3 py-2">
            {chatMessages.map((msg) => {
              const isMe = msg.sender === "me";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[78%] px-4 py-2.5 text-[14px] leading-[20px] shadow-sm ${
                      isMe
                        ? "bg-[#fe2c55] text-white rounded-2xl rounded-br-[4px]"
                        : "bg-[#1f1f1f] text-white rounded-2xl rounded-bl-[4px] border border-[#3a3a3a]"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#737373] mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
