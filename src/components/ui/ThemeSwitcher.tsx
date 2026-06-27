"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { IconPalette } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { getAllThemes } from "@/themes/registry"

interface ThemeSwitcherProps {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const themes = React.useMemo(() => getAllThemes(), [])

  // 处理点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current && 
        !dropdownRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  // 确保在客户端渲染
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`theme-switcher relative ${className || ''}`}>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="theme-switcher-trigger p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        aria-label="切换主题"
      >
        <IconPalette className="w-5 h-5" />
      </motion.button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="theme-switcher-menu absolute right-0 mt-2 w-48 py-2 bg-popover border rounded-lg shadow-lg z-[200]"
          onClick={(e) => e.stopPropagation()}
        >
          {themes.map(({ name, displayName }) => (
            <button
              key={name}
              className={`theme-switcher-option w-full text-left px-4 py-2 text-sm rounded-md transition-colors
                        ${theme === name
                          ? 'theme-switcher-option-active bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
              onClick={() => {
                setTheme(name)
                setIsOpen(false)
              }}
            >
              {displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
