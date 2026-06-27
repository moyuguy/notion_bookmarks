"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="data-theme"
      defaultTheme="bauhaus-primary"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  )
}
