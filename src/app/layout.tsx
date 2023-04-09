import './globals.css'
import React from "react";
import Providers from "@/app/Providers";

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
