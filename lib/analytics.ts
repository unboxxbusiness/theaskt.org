const TRACKER_KEY = "askt_offline_events";

export function trackEvent(name: string, payload: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  const event = { name, payload, timestamp: Date.now() };

  // If offline, queue event in localStorage
  if (!navigator.onLine) {
    try {
      const stored = localStorage.getItem(TRACKER_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.push(event);
      localStorage.setItem(TRACKER_KEY, JSON.stringify(list));
      console.log(`[analytics] Queued offline event: ${name}`);
    } catch (e) {
      console.error("Failed to queue offline analytics event:", e);
    }
    return;
  }

  // Online: Dispatch event immediately
  console.log(`[analytics] Event dispatched: ${name}`, payload);
}

export function syncOfflineAnalytics() {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(TRACKER_KEY);
    if (stored) {
      const list = JSON.parse(stored);
      if (list.length === 0) return;
      console.log(`[analytics] Syncing ${list.length} queued offline analytics events...`);
      // Simulating dispatching queued elements
      localStorage.removeItem(TRACKER_KEY);
    }
  } catch (e) {
    console.error("Failed to sync offline analytics:", e);
  }
}

// Register online event handler to sync analytics on network recovery
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    syncOfflineAnalytics();
  });
}
