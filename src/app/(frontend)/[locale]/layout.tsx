import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

type Locale = "en" | "fi";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
};

export const metadata: Metadata = {
  title: "Payload Demo",
  description: "Built with Payload CMS and Next.js",
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
