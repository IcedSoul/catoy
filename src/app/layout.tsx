import './globals.css'
import React from "react";
import Providers from "@/app/Providers";

export const metadata = {
  title: 'Catoy',
  description: 'Some interesting toys',
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
