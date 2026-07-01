// ponytail: Replaced the heavy Firebase Web SDK with a lightweight native fetch REST client.
// This resolves the 'Module not found: Can't resolve firebase/app' error and reduces bundle size.

export async function submitToFirestore(
  collectionName: string,
  data: Record<string, string>,
  bypassQueue = false
) {
  // Intercept offline states to store form submissions in IndexedDB
  if (typeof window !== "undefined" && !navigator.onLine && !bypassQueue) {
    const { queueOfflineSubmission } = await import("./offlineSync");
    await queueOfflineSubmission(collectionName, data);
    return { success: true, offline: true };
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "theaskt";

  // Map JS object fields to Firestore REST API Document format
  // Since all of our submitted fields are string types (email, name, message, goals, timestamp),
  // we can map all of them directly to stringValue.
  const fields: Record<string, { stringValue: string }> = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = { stringValue: value };
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}${apiKey ? `?key=${apiKey}` : ""}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Firestore REST submission failed: ${errorText}`);
    throw new Error(`Failed to save data to Firestore REST API.`);
  }

  return response.json();
}

export async function getFirestoreDocuments(collectionName: string): Promise<Array<Record<string, string>>> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "theaskt";
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}${apiKey ? `?key=${apiKey}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Firestore REST fetch failed: ${errorText}`);
    return [];
  }

  const data = await response.json();
  if (!data.documents || !Array.isArray(data.documents)) return [];

  return data.documents.map((doc: any) => {
    const fields: Record<string, string> = {};
    if (doc.fields) {
      for (const [key, value] of Object.entries(doc.fields)) {
        if (value && typeof value === "object" && "stringValue" in value) {
          fields[key] = (value as any).stringValue;
        }
      }
    }
    return fields;
  });
}

export async function sendFcmNotification(
  tokens: string[],
  title: string,
  body: string,
  clickUrl: string
) {
  const serverKey = process.env.FIREBASE_MESSAGING_SERVER_KEY;
  
  if (!serverKey) {
    console.warn("FIREBASE_MESSAGING_SERVER_KEY environment variable is not defined. Queueing notification inside Firestore collection 'notificationsQueue' instead.");
    
    // Save to Firestore notificationsQueue instead so background functions can send
    await submitToFirestore("notificationsQueue", {
      title,
      body,
      clickUrl,
      timestamp: new Date().toISOString(),
      status: "queued",
      recipientCount: tokens.length.toString()
    });
    return { success: true, queued: true };
  }

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `key=${serverKey}`
    },
    body: JSON.stringify({
      registration_ids: tokens,
      notification: {
        title,
        body,
        icon: "/logo.png",
        click_action: clickUrl
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`FCM REST notification dispatch failed: ${errorText}`);
    throw new Error("Failed to dispatch push notifications via FCM Legacy API.");
  }

  return response.json();
}
