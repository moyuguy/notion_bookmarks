'use client'

import React, { useState, useEffect, memo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import * as Icons from 'lucide-react'
import { WebsiteConfig } from '@/types'
import { useTheme } from 'next-themes'

interface Category {
  id: string
  name: string
  iconName?: string
  subCategories: {
    id: string
    name: string
  }[]
}

interface NavigationProps {
  categories: Category[]
  config: WebsiteConfig
}

const defaultConfig: WebsiteConfig = {
  SOCIAL_GITHUB: '',
  SOCIAL_BLOG: '',
  SOCIAL_X: '',
  SOCIAL_JIKE: '',
  SOCIAL_WEIBO: ''
}

const Navigation = memo(function Navigation({ categories, config = defaultConfig }: NavigationProps) {
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const { theme } = useTheme(); // Get current theme

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }, []);

  const scrollToElement = useCallback((elementId: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const element = document.getElementById(elementId);

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      window.scrollTo({
        top: rect.top + scrollTop - 100,
        behavior: 'smooth'
      });
    }
  }, []);

  // 处理导航点击
  const handleNavClick = useCallback((categoryId: string, subCategoryId?: string) => {
    const elementId = subCategoryId ? `${categoryId}-${subCategoryId}` : categoryId;
    setActiveCategory(elementId);
    scrollToElement(elementId);
  }, [scrollToElement]);

  const handleCategoryToggle = useCallback((categoryId: string) => {
    toggleCategory(categoryId);
    handleNavClick(categoryId);
  }, [handleNavClick, toggleCategory]);

  // Set default active category on mount
  useEffect(() => {
    if (categories.length > 0 && activeCategory === '') {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  return (
    <>
      {/* 移动端顶部导航 */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-background border-b">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-2">
            <Icons.Rocket className="w-5 h-5 text-foreground" />
            <span className="neon-title">{config.SITE_TITLE}</span>
          </div>
          {config.SHOW_THEME_SWITCHER !== 'false' && <ThemeSwitcher />}
        </div>
        <div className="overflow-x-auto flex items-center h-12 border-t scrollbar-none">
          <div className="flex px-4 min-w-full">
            <div className="flex space-x-2 mx-auto">
              {categories.map((category) => {
                const isMobileCategoryActive =
                  activeCategory === category.id ||
                  activeCategory.startsWith(`${category.id}-`);

                return (
                  <button
                    key={category.id}
                    onClick={() => handleNavClick(category.id)}
                    className={cn(
                      "mobile-nav-category-button whitespace-nowrap px-3 py-1.5 text-sm rounded-full transition-colors shrink-0",
                      isMobileCategoryActive
                        ? theme === 'bauhaus-primary'
                          ? "mobile-nav-category-active font-medium"
                          : theme === 'simple-dark'
                          ? "mobile-nav-category-active bg-accent text-foreground font-medium"
                          : "mobile-nav-category-active bg-primary text-white font-medium"
                        : theme === 'simple-dark'
                          ? "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* 桌面端边导航 */}
      <nav className="hidden lg:block w-[280px] flex-shrink-0 h-screen sticky top-0 p-4 overflow-y-auto border-r">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Icons.Rocket className="w-5 h-5 text-foreground" />
            <span className="neon-title">{config.SITE_TITLE}</span>
          </div>
          {config.SHOW_THEME_SWITCHER !== 'false' && <ThemeSwitcher />}
        </div>
        <ul className="space-y-1 pb-24">
          {categories.map((category) => {
            const IconComponent = category.iconName && (category.iconName in Icons)
              ? (Icons[category.iconName as keyof typeof Icons] as React.ComponentType)
              : Icons.Globe;
            const isCategoryActive =
              activeCategory === category.id ||
              activeCategory.startsWith(`${category.id}-`);
            const isCategoryExpanded = expandedCategories.has(category.id);

            return (
              <li key={category.id}>
                <div className="flex flex-col">
                  <button
                    onClick={() => handleCategoryToggle(category.id)}
                    className={cn(
                      "nav-category-button w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors",
                      isCategoryActive
                        ? theme === 'simple-dark'
                          ? "nav-category-active bg-accent text-foreground font-medium"
                          : "nav-category-active bg-primary text-white font-medium"
                        : isCategoryExpanded
                        ? "nav-category-expanded bg-accent"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      {/* IconComponent type mismatch handled */}
                      <IconComponent className="w-4 h-4" />
                      <span>{category.name}</span>
                    </div>
                    <Icons.ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                      expandedCategories.has(category.id) ? "rotate-180" : ""
                      )}
                    />
                  </button>
                  {isCategoryExpanded && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {category.subCategories.map((subCategory) => (
                        <li key={subCategory.id}>
                          <button
                            onClick={() => handleNavClick(category.id, subCategory.id)}
                            className={cn(
                              "nav-subcategory-button w-full text-left px-4 py-2 rounded-lg transition-colors text-sm",
                              activeCategory === `${category.id}-${subCategory.id}`
                                ? theme === 'simple-dark'
                                  ? "nav-subcategory-active bg-accent text-foreground font-medium"
                                  : "nav-subcategory-active bg-primary text-white font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            {subCategory.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
});

export default Navigation;
