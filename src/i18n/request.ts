import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Pre-import messages for faster access
import enMessages from "../messages/en.json";
import fiMessages from "../messages/fi.json";

// Create a simple in-memory cache for messages
const messagesCache = {
  fi: fiMessages,
  en: enMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  // Use pre-cached messages instead of dynamic imports
  return {
    locale,
    messages: messagesCache[locale as keyof typeof messagesCache],
    // Minimize time spent in transformation for better performance
    formats: {
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      },
      number: {
        amount: {
          style: "currency",
          currency: "EUR",
        },
      },
    },
    // Skip unnecessary timeZone detection for better performance
    timeZone: "Europe/Helsinki",
  };
});
