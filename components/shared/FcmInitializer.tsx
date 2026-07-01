"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { submitToFirestore } from "@/lib/firebase";
import { Bell } from "lucide-react";
import Button from "../ui/Button";
import Typography from "../typography/Typography";

import { useTheme } from "@/components/theme-provider";

export default function FcmInitializer() {
  const pathname = usePathname();
  const { focusMode } = useTheme();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith('/studio') || focusMode) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPermission(Notification.permission);

    if (Notification.permission !== "default") return;

    // 1. Trigger if user has already read 2+ articles
    try {
      const stored = localStorage.getItem("previously_read_articles");
      const list = stored ? JSON.parse(stored) : [];
      if (list.length >= 2) {
        setShowPrompt(true);
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Global trigger handle for brochure download or newsletter signup
    (window as any).triggerPushPrompt = () => {
      if (Notification.permission === "default") {
        setShowPrompt(true);
      }
    };

    // 3. Scroll 70% threshold trigger
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0 && (scrollTop / scrollHeight) >= 0.70) {
        setShowPrompt(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // 4. 60 seconds meaningful session duration trigger
    const sessionTimer = setTimeout(() => {
      setShowPrompt(true);
    }, 60000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(sessionTimer);
      if (typeof window !== "undefined") {
        delete (window as any).triggerPushPrompt;
      }
    };
  }, [pathname, focusMode]);

  const requestPermission = async () => {
    try {
      const reqPermission = await Notification.requestPermission();
      setPermission(reqPermission);
      setShowPrompt(false);

      if (reqPermission === "granted") {
        // Prevent duplicate subscription entries and Firestore writes
        const existingToken = localStorage.getItem("fcm_subscription_token");
        if (existingToken) {
          return;
        }

        // Generate a mock FCM token using native window APIs or custom generation
        const fcmToken = "mock_fcm_" + Math.random().toString(36).substring(2) + "_" + Date.now();
        localStorage.setItem("fcm_subscription_token", fcmToken);
        
        // Save to firestore collection pushSubscribers using our native REST helper
        await submitToFirestore("pushSubscribers", {
          token: fcmToken,
          timestamp: new Date().toISOString(),
          status: "subscribed"
        });

        // Show a native browser notification as a confirmation/feedback loop
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Opportunities Enabled!", {
            body: "You will now receive updates from TheAskt.",
          });
        }
      }
    } catch (error) {
      console.error("Notification Registration Error:", error);
    }
  };

  if (pathname?.startsWith('/studio') || focusMode) return null;
  if (!showPrompt) return null;

  /* ponytail: FcmInitializer with smart engagement hooks triggers */
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-border-primary bg-bg-card p-5 shadow-2xl animate-fade-in transition-colors">
      <div className="flex gap-4">
        <div className="rounded-lg bg-bg-secondary p-2.5 h-fit text-text-h">
          <Bell className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <Typography variant="h3" className="text-xs font-bold">Enable Opportunities Push</Typography>
          <Typography variant="small" className="leading-4 block">
            Receive instant push notifications for new articles, newsletters, and exclusive AI career program updates.
          </Typography>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={requestPermission}
              variant="primary"
              size="sm"
            >
              Allow Notifications
            </Button>
            <Button
              onClick={() => setShowPrompt(false)}
              variant="outline"
              size="sm"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
