import './theme.css'
import { simpleTheme } from './simple';
import {
  getAllThemes,
  getThemeMode,
  themes,
  type Theme
} from './registry';

export { themes, getAllThemes, getThemeMode, type Theme };

// 应用主题样式
export function applyTheme(themeName: string) {
  // 确保主题名称有效
  if (!themes.find(t => t.name === themeName)) {
    themeName = 'simple-light'
  }

  document.documentElement.setAttribute('data-theme', themeName)
  // 保存到 localStorage
  localStorage.setItem('theme', themeName)
  // 触发主题变化事件
  window.dispatchEvent(new Event('themeChange'))
}

export { simpleTheme } from './simple';
export { cyberpunkTheme } from './cyberpunk';
export { bauhausTheme } from './bauhaus';

export const defaultTheme = simpleTheme;
