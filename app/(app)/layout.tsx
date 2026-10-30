import React from "react";
import { BottomNav } from "@/components/feed/BottomNav";
import { Wordmark } from "@/components/ui/Wordmark";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full min-h-[100dvh] bg-black flex items-center justify-center overflow-hidden">
      {/* Optional Desktop Sidebar (visible only on large screens > 768px) */}
      <aside className="hidden lg:flex flex-col justify-between w-[280px] h-[844px] p-8 mr-12 select-none">
        <div>
          <Wordmark size="lg" showCake />
          <p className="text-[14px] leading-[22px] text-[#a8a8a8] mt-3">
            Sebuah hadiah kejutan ulang tahun kecil yang dirancang khusus untuk seseorang yang paling istimewa.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#161823] border border-[#3a3a3a] text-[13px] text-white/80 space-y-2">
          <p className="font-semibold text-primary">📱 Tip Pengalaman:</p>
          <p>
            Buka link ini di HP (iOS Safari / Android Chrome) untuk pengalaman snap-scroll, getaran haptic, dan audio terbaik!
          </p>
        </div>
      </aside>

      {/* Main 9:16 Phone Frame (390x844 reference, 100dvh mobile) */}
      <main className="relative w-full h-[100dvh] max-w-[480px] lg:h-[min(100dvh,900px)] lg:aspect-[9/16] bg-black overflow-hidden shadow-2xl lg:border lg:border-[#3a3a3a] lg:rounded-2xl">
        {children}
        <BottomNav isHomeOverlay />
      </main>
    </div>
  );
}
