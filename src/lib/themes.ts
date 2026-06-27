// 从themes/index.ts导出所有主题相关功能
// 这个文件是为了向后兼容，新代码应该直接从@/themes导入

export {
  themes,
  defaultTheme,
  getAllThemes,
  getThemeMode,
} from '@/themes';
