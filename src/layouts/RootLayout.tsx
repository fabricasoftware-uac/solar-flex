import type { ReactNode } from "react";
import { Navbar } from "@/components/landing/nav/Navbar";
import { Footer } from "@/components/landing/footer/Footer";
import { CursorLight } from "@/components/ui/CursorLight";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { DebugBadge } from "@/components/ui/DebugBadge";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { BackToTop } from "@/components/ui/BackToTop";
import { ChargeIndicator } from "@/components/ui/ChargeIndicator";
import { HalftoneField } from "@/components/landing/hero/HalftoneField";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import { useLenis } from "@/hooks/useLenis";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  useLenis();
  useAnchorScroll();

  return (
    <div className="w-full max-w-full overflow-x-clip bg-carbon text-light">
      {/* Fondo vivo global: el halftone de la marca deriva con el scroll
          detrás de todas las secciones translúcidas */}
      <div aria-hidden="true" className="fixed inset-0">
        <HalftoneField gap={38} intensity={1.35} drift />
      </div>

      <div className="relative">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>

      <CursorLight />
      <GrainOverlay />
      <CustomCursor />
      <ChargeIndicator />
      <BackToTop />
      <DebugBadge />
    </div>
  );
}
