'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import "@radix-ui/themes/styles.css"
import { Theme } from "@radix-ui/themes"
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}><Theme appearance="light">{children}</Theme></NextThemesProvider>
}
