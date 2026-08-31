import type { Metadata, Viewport } from "next"
import { Geist, IBM_Plex_Mono } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { SiteJsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
})

const karrik = localFont({
  src: [
    {
      path: "./fonts/Karrik-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Karrik-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://scidust.art"),
  title: {
    default: "Tatia (Scidust9) — 3D CGI & Biomechanical Artist | Tbilisi, Georgia",
    template: "%s | Tatia (Scidust9) — 3D Artist",
  },
  description:
    "Official portfolio of Tatia (Scidust9), 3D CGI artist and digital sculptor in Tbilisi, Georgia. Surreal biomechanical worlds, visceral anatomies, metallic relics, and futuristic concepts.",
  keywords: [
    "Tatia",
    "Tatia 3D",
    "Tatia artist",
    "Tatia Georgia",
    "Scidust",
    "Scidust9",
    "3D artist Georgia",
    "3D work Georgia",
    "3D artist Tbilisi",
    "CGI artist Tbilisi Georgia",
    "3D concept artist Georgia",
    "biomechanical 3D art",
    "surreal 3D portfolio",
    "digital sculptor Georgia",
    "dark sci-fi 3D artist",
    "CGI portfolio Tbilisi",
    "3D visual artist Georgia",
  ],
  authors: [{ name: "Tatia", url: "https://scidust.art" }],
  creator: "Tatia (Scidust9)",
  publisher: "Tatia",
  applicationName: "Scidust",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://scidust.art",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scidust.art",
    siteName: "Scidust — Tatia 3D Art Portfolio",
    title: "Tatia (Scidust9) — 3D CGI & Biomechanical Artist | Tbilisi, Georgia",
    description:
      "Surreal biomechanical worlds, visceral anatomies, and cinematic CGI relics by Tatia (Scidust9), 3D artist based in Tbilisi, Georgia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tatia (Scidust9) — 3D CGI & Biomechanical Artist | Tbilisi, Georgia",
    description:
      "Surreal biomechanical worlds, visceral anatomies, and cinematic CGI relics by Tatia (Scidust9), 3D artist based in Tbilisi, Georgia.",
    creator: "@scidust9",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Visual Arts & 3D Design",
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#051519",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-[#051519] antialiased",
        fontSans.variable,
        ibmPlexMono.variable,
        karrik.variable
      )}
    >
      <body className="bg-[#051519] font-sans">
        <SiteJsonLd />
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
