import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Parachute Trains Puzzle",
  description: "Visual simulation of the parachute trains puzzle - two trains on an infinite railway line must find each other",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
