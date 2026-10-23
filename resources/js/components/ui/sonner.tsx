"use client"

import { useSyncExternalStore } from "react"
import { Toaster as Sonner, ToasterProps } from "sonner"

// Reads the dark class directly from the <html> tag
function useSystemTheme() {
  return useSyncExternalStore(
    (callback) => {
      const observer = new MutationObserver(callback)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
      return () => observer.disconnect()
    },
    () => (document.documentElement.classList.contains("dark") ? "dark" : "light"),
    () => "light" // Server fallback
  )
}


const Toaster = ({ ...props }: ToasterProps) => {
   const theme = useSystemTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
