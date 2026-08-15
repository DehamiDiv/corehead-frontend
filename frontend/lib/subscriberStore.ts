/**
 * In-memory subscriber store per tenant site (`siteSlug`).
 * Keeps track of outside visitors who subscribe to a specific site.
 */

type SubscriberRecord = {
  email: string;
  siteSlug: string;
  subscribedAt: string;
};

// Persistent global subscriber registry across API calls in runtime
const globalSubscribers: SubscriberRecord[] = [];

export function addSubscriber(email: string, siteSlug?: string) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanSlug = (siteSlug || "default").trim().toLowerCase();

  const exists = globalSubscribers.some(
    (s) => s.email === cleanEmail && s.siteSlug === cleanSlug
  );

  if (!exists) {
    globalSubscribers.push({
      email: cleanEmail,
      siteSlug: cleanSlug,
      subscribedAt: new Date().toISOString(),
    });
  }
}

export function getSubscribersForSite(siteSlug?: string): string[] {
  const cleanSlug = (siteSlug || "default").trim().toLowerCase();
  const emails = globalSubscribers
    .filter((s) => s.siteSlug === cleanSlug || cleanSlug === "default" || cleanSlug === "")
    .map((s) => s.email);

  return Array.from(new Set(emails));
}
