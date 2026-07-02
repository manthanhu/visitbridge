import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "VisitBridge — Bridge the Gap Between Campus and Corporate",
  description:
    "Join exclusive company visits at Google, Microsoft, NVIDIA and more. We aggregate student demand across colleges to make incredible industry visits happen.",
  keywords: ["company visits", "internships", "placements", "campus recruitment", "tech companies", "student platform"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
