export interface Theme {
  name: string
  displayName: string
  mode: 'light' | 'dark'
}

export const themes: Theme[] = [
  {
    name: 'simple-light',
    displayName: '简约浅色',
    mode: 'light'
  },
  {
    name: 'simple-dark',
    displayName: '简约深色',
    mode: 'dark'
  },
  {
    name: 'cyberpunk-dark',
    displayName: '赛博朋克',
    mode: 'dark'
  },
  {
    name: 'bauhaus-primary',
    displayName: '包豪斯三原色',
    mode: 'light'
  }
]

export function getAllThemes(): Theme[] {
  return themes
}

export function getThemeMode(themeName: string): 'light' | 'dark' {
  const theme = themes.find(t => t.name === themeName)
  return theme?.mode || 'light'
}
