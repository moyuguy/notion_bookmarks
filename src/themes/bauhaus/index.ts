import { type ThemeConfig } from '@/types/theme';
import './style.css';

export const bauhausTheme: ThemeConfig = {
  name: 'bauhaus',
  displayName: '包豪斯三原色',
  modes: ['light'],
  styles: {
    light: {
      primary: 'hsl(358 86% 53%)',
      'primary-foreground': 'hsl(44 100% 96%)',
      background: 'hsl(44 100% 97%)',
      'background-foreground': 'hsl(0 0% 5%)',
      muted: 'hsl(43 68% 89%)',
      'muted-foreground': 'hsl(0 0% 22%)',
      accent: 'hsl(47 96% 54%)',
      'accent-foreground': 'hsl(0 0% 4%)',
      card: 'hsl(42 100% 98%)',
      'card-foreground': 'hsl(0 0% 5%)',
      border: 'hsl(0 0% 5%)',
      popover: 'hsl(42 100% 98%)',
      'popover-foreground': 'hsl(0 0% 5%)',

      'font-family': '"Noto Sans SC", "Arial Black", Arial, system-ui, sans-serif',
      'font-size-base': '1rem',
      'font-size-sm': '0.875rem',
      'font-size-lg': '1.125rem',
      'font-weight-normal': '500',
      'font-weight-medium': '700',
      'font-weight-bold': '800',
      'line-height': '1.35',

      'card-padding': '1rem',
      'card-radius': '0.375rem',
      'card-shadow': '5px 6px 0 hsl(0 0% 5%)',
      'card-hover-shadow': '7px 8px 0 hsl(0 0% 5%)',
      'card-border-width': '3px',
      'card-border-style': 'solid',

      'border-radius-sm': '0.25rem',
      'border-radius-md': '0.375rem',
      'border-radius-lg': '0.5rem',
      'border-width': '3px',
      'border-style': 'solid',

      'spacing-xs': '0.5rem',
      'spacing-sm': '0.75rem',
      'spacing-md': '1rem',
      'spacing-lg': '1.5rem',
      'spacing-xl': '2rem',

      'transition-duration': '160ms',
      'transition-timing': 'cubic-bezier(0.2, 0, 0, 1)',

      'shadow-sm': '3px 4px 0 hsl(0 0% 5%)',
      'shadow-md': '5px 6px 0 hsl(0 0% 5%)',
      'shadow-lg': '7px 8px 0 hsl(0 0% 5%)',
      'shadow-hover': '7px 8px 0 hsl(0 0% 5%)'
    }
  }
};
