"use client";

import { useEffect, useState } from "react";
import Typography from "../typography/Typography";
import Button from "../ui/Button";

export default function VersionNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.ready.then((reg) => {
      setSwRegistration(reg);

      // Listen for new service worker instances
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        }
      });

      // Check if there is an active worker waiting
      if (reg.waiting) {
        setUpdateAvailable(true);
      }
    });
  }, []);

  const handleRefresh = () => {
    if (!swRegistration || !swRegistration.waiting) return;
    
    // Post SKIP_WAITING to notify service worker to activate immediately
    swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    
    // Trigger window reload once service worker change takes hold
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  };

  if (!updateAvailable) return null;

  /* ponytail: minimal non-obtrusive dynamic refresh version banner */
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm rounded-xl border border-border-primary bg-bg-card p-4 shadow-2xl flex items-center justify-between gap-4 animate-fade-in transition-colors">
      <Typography variant="small" className="font-semibold text-text-h">
        A new version is available.
      </Typography>
      <Button onClick={handleRefresh} variant="accent" size="sm">
        Refresh
      </Button>
    </div>
  );
}
