import type { Metadata, Viewport } from "next";
import "./globals.css";
import { EffectPortal } from "@/components/effects/EffectPortal";
import { WishToast } from "@/components/ui/WishToast";
import { CommentSheet } from "@/components/sheets/CommentSheet";
import { ShareSheet } from "@/components/sheets/ShareSheet";
import { InviteDrawer } from "@/components/sheets/InviteDrawer";
import { FinaleDialog } from "@/components/sheets/FinaleDialog";
import { SongSheet } from "@/components/sheets/SongSheet";
import { SecretMessageSheet } from "@/components/sheets/SecretMessageSheet";

export const metadata: Metadata = {
  title: "ForUs — Spesial Untukmu",
  description: "Hadiah ulang tahun terindah untuk Una tersayang ❤️",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="bg-black text-white antialiased overflow-x-hidden select-none">
        {children}

        {/* Global Overlays & Modals */}
        <EffectPortal />
        <WishToast />
        <CommentSheet />
        <ShareSheet />
        <InviteDrawer />
        <FinaleDialog />
        <SongSheet />
        <SecretMessageSheet />
      </body>
    </html>
  );
}

