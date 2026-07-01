"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Typography from "../typography/Typography";
import Button from "../ui/Button";

import { useTheme } from "@/components/theme-provider";

export default function InstallBanner() {
  const { focusMode } = useTheme();
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  /* ponytail: minimal native PWA check & 5-minute cooldown timer loop */
  useEffect(() => {
    if (focusMode) return;

    let timer: NodeJS.Timeout;

    const checkAndShowBanner = (prompt: any) => {
      if (!prompt) return;

      try {
        const dismissedUntil = localStorage.getItem("pwa_install_dismissed_until");
        if (dismissedUntil) {
          const remainingTime = parseInt(dismissedUntil) - Date.now();
          if (remainingTime > 0) {
            // Dismissed, check back when timer expires
            timer = setTimeout(() => {
              checkAndShowBanner(prompt);
            }, remainingTime);
            return;
          }
        }

        const visitCount = parseInt(localStorage.getItem("visit_count") || "0");
        localStorage.setItem("visit_count", (visitCount + 1).toString());

        // Show banner only on second visit or later
        if (visitCount >= 1) {
          setShowBanner(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Expose globally so components like Footer can trigger it
      (window as any).deferredAppInstallPrompt = e;
      checkAndShowBanner(e);
    };

    // Hide if installed externally (e.g. from footer link)
    const handleInstalledExternally = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("pwa-installed", handleInstalledExternally);

    // Run fallback check if event already fired prior to component mount
    if ((window as any).deferredAppInstallPrompt) {
      const e = (window as any).deferredAppInstallPrompt;
      setDeferredPrompt(e);
      checkAndShowBanner(e);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("pwa-installed", handleInstalledExternally);
      if (timer) clearTimeout(timer);
    };
  }, [focusMode]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install choice outcome: ${outcome}`);
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      (window as any).deferredAppInstallPrompt = null;
      window.dispatchEvent(new CustomEvent("pwa-installed"));
    }
    setShowBanner(false);
  };

  const handleLater = () => {
    setShowBanner(false);
    try {
      const cooldownTime = 5 * 60 * 1000; // 5 minutes
      const cooldownExpiry = Date.now() + cooldownTime;
      localStorage.setItem("pwa_install_dismissed_until", cooldownExpiry.toString());

      // Set timeout to show again on current session if still browsing
      setTimeout(() => {
        if ((window as any).deferredAppInstallPrompt) {
          setShowBanner(true);
        }
      }, cooldownTime);
    } catch (err) {
      console.error(err);
    }
  };

  if (pathname?.startsWith('/studio') || focusMode) return null;
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm rounded-xl border border-border-primary bg-bg-card p-5 shadow-2xl animate-fade-in transition-colors">
      <div className="space-y-3">
        <Typography variant="h3" className="text-xs font-bold text-text-h">Add to Home Screen</Typography>
        <Typography variant="small" className="leading-4 block text-text-secondary">
          Install TheAskt on your device for offline reading, quick app access, and opportunities updates.
        </Typography>
        <div className="flex gap-2 pt-1">
          <Button onClick={handleInstall} variant="primary" size="sm">
            Install App
          </Button>
          <Button onClick={handleLater} variant="outline" size="sm">
            Later
          </Button>
        </div>
      </div>
    </div>
  );
}
