import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";
import { Header } from "@/components/Header";
import { getAllTerms } from "@/lib/terms";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Theologia — Theological Dictionary",
    template: "%s · Theologia",
  },
  description:
    "A pocket dictionary of theological terms. 498 concise definitions from the Pocket Dictionary by Grenz, Guretzki & Nordling.",
  openGraph: {
    title: "Theologia — Theological Dictionary",
    description:
      "498 theological terms, clearly defined. From a posteriori to Zwingli.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Theologia — Theological Dictionary",
    description: "498 theological terms, clearly defined.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const terms = getAllTerms();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${garamond.variable} ${inter.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <div className="flex min-h-screen flex-col" style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}>
          <Header terms={terms} />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-8 text-center text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-ink-faint)", fontFamily: "var(--font-sans)" }}>
            <p>
              Definitions from <em style={{ fontFamily: "var(--font-serif)" }}>Pocket Dictionary of Theological Terms</em> by Grenz, Guretzki &amp; Nordling.
            </p>
            <p className="mt-4" style={{ fontSize: "0.625rem", opacity: 0.55 }}>
              <a
                href="https://github.com/aaronloh16/theologia"
                target="_blank"
                rel="noopener noreferrer"
                title="Star on GitHub if helpful"
                className="hover:underline"
                style={{ color: "inherit" }}
              >
                by Aaron Loh ⭐
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
