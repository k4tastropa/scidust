import type { Viewport } from "next"
import { Geist, IBM_Plex_Mono } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
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
