import { submitToFirestore } from "./firebase";

const DB_NAME = "askt-offline-sync";
const STORE_NAME = "submissions";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported on this platform."));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueOfflineSubmission(collectionName: string, data: Record<string, string>) {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add({
        collectionName,
        data,
        timestamp: Date.now()
      });
      request.onsuccess = () => {
        console.log(`[offlineSync] Queued offline submission for collection: ${collectionName}`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to queue offline submission:", err);
  }
}

export async function syncOfflineSubmissions() {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = async () => {
      const items = getAllRequest.result;
      if (!items || items.length === 0) return;

      console.log(`[offlineSync] Attempting to sync ${items.length} queued offline form submissions...`);
      for (const item of items) {
        try {
          // Submit to Firestore, passing bypassQueue=true to prevent infinite loop
          await submitToFirestore(item.collectionName, item.data, true);
          
          // On success, remove from IndexedDB
          const deleteTx = db.transaction(STORE_NAME, "readwrite");
          deleteTx.objectStore(STORE_NAME).delete(item.id);
          console.log(`[offlineSync] Synced and deleted queue item: ${item.id}`);
        } catch (e) {
          console.error(`[offlineSync] Failed to sync queued item ${item.id}:`, e);
        }
      }
    };
  } catch (err) {
    console.error("Failed to sync offline submissions:", err);
  }
}

// Automatically sync when online event fires in browser window
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    syncOfflineSubmissions();
  });
}
