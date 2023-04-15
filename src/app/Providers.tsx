'use client';

import React from "react";
import { SessionProvider } from "next-auth/react"
import {MantineProvider} from "@mantine/core";

interface ProvidersProps {
    children: React.ReactNode
}
export default function Providers({ children }: ProvidersProps) {
  return (
      <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
              colorScheme: 'light',
              loader: 'bars'
          }}
      >
        <SessionProvider>
            {children}
        </SessionProvider>
      </MantineProvider>
  )
}