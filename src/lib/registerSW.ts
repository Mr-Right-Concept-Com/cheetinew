// Register service worker for PWA functionality
export const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) return;

  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1";
  const isLovablePreview =
    hostname.includes("lovable.app") ||
    hostname.includes("lovableproject.com");

  // IMPORTANT: on preview/dev domains we disable service workers because caching can
  // mix old/new JS chunks and trigger "Invalid hook call" crashes.
  const shouldDisableSW = isLocalhost || isLovablePreview;

  window.addEventListener("load", async () => {
    if (shouldDisableSW) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));

        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }

        console.info(
          "ServiceWorker disabled on this domain; cleared existing registrations and caches.",
        );
      } catch (error) {
        console.warn(
          "Failed to clear ServiceWorker registrations/caches (non-fatal):",
          error,
        );
      }
      return;
    }

    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registered:", registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed:", error);
      });
  });
};
