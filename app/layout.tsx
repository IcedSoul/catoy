import './globals.css'
import React from "react";

export const metadata = {
  title: 'Catoy',
  description: 'Some interesting toys',
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
