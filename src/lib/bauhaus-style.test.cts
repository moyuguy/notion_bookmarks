/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.join(__dirname, '../..');

function readProjectFile(filePath: string) {
  return fs.readFileSync(path.join(projectRoot, filePath), 'utf8');
}

test('包豪斯主题用语义选择器修复标注区域', () => {
  const css = readProjectFile('src/themes/bauhaus/style.css');
  const themeSwitcher = readProjectFile('src/components/ui/ThemeSwitcher.tsx');
  const linkContainer = readProjectFile('src/components/layout/LinkContainer.tsx');
  const weatherDisplay = readProjectFile('src/components/widgets/Weather/WeatherDisplay.tsx');
  const airQualityBadge = readProjectFile('src/components/widgets/Weather/AirQualityBadge.tsx');
  const linkCard = readProjectFile('src/components/ui/LinkCard.tsx');

  assert.equal(css.includes('[data-theme="bauhaus-primary"] .group span,'), false);
  assert.equal(css.includes('[data-theme="bauhaus-primary"] button,'), false);

  [
    'theme-switcher-trigger',
    'theme-switcher-menu',
    'theme-switcher-option',
    'section-heading-icon',
    'section-heading-title',
    'weather-location-trigger',
    'air-quality-badge',
    'air-quality-category',
    'air-quality-value',
    'link-tag',
    'link-tag-label',
  ].forEach((className) => {
    const source = [
      css,
      themeSwitcher,
      linkContainer,
      weatherDisplay,
      airQualityBadge,
      linkCard,
    ].join('\n');

    assert.ok(source.includes(className), `missing ${className}`);
  });
});

test('包豪斯主题把一级标题和导航选中态收成统一系统', () => {
  const css = readProjectFile('src/themes/bauhaus/style.css');
  const navigation = readProjectFile('src/components/layout/Navigation.tsx');

  [
    '.section-heading::after',
    '.section-heading-title',
    '.section-heading-icon',
    'border: 0',
    'border-radius: 0',
    'gap: 0',
    'padding-bottom: 0.375rem',
    'width: 3.125rem',
    'min-height: 3.125rem',
    '.mobile-nav-category-button',
    'mobile-nav-category-active',
    '.nav-category-button',
    'button.nav-category-button.nav-category-active',
    'button.nav-category-button.nav-category-expanded',
    '.nav-subcategory-button',
    'button.nav-subcategory-button.nav-subcategory-active',
    'background: var(--bauhaus-red) !important',
    'background: var(--bauhaus-yellow) !important',
    'background: var(--bauhaus-paper-strong) !important',
  ].forEach((snippet) => {
    assert.ok(css.includes(snippet), `missing CSS snippet ${snippet}`);
  });

  assert.equal(css.includes('nav button.nav-category-button.nav-category-expanded:not(.nav-category-active) {\n  background: var(--bauhaus-yellow)'), false);
  assert.equal(css.includes('section > .section-heading {\n  position: relative;\n  align-items: flex-end;\n  gap: 0;\n  min-height: 3.625rem;\n  padding-bottom: 0;'), false);
  assert.equal(css.includes('section > .section-heading .section-heading-icon {\n  position: relative;\n  z-index: 1;\n  display: inline-flex;\n  width: 3.625rem;\n  height: 3.625rem;\n  align-items: center;\n  justify-content: center;\n  padding: 0.55rem;\n  background: var(--bauhaus-yellow);\n  border: var(--bauhaus-line)'), false);
  assert.equal(readProjectFile('src/components/layout/LinkContainer.tsx').includes('section-heading flex items-center space-x-3'), false);

  [
    'handleCategoryToggle',
    'isCategoryActive',
    'isMobileCategoryActive',
    "theme === 'bauhaus-primary'",
    'mobile-nav-category-button',
    'mobile-nav-category-active',
    'activeCategory.startsWith(`${category.id}-`)',
    "theme === 'simple-dark'",
    'nav-category-active bg-accent text-foreground font-medium',
    'nav-subcategory-active bg-accent text-foreground font-medium',
    'nav-category-button',
    'nav-category-active',
    'nav-category-expanded',
    'nav-subcategory-button',
    'nav-subcategory-active',
  ].forEach((snippet) => {
    assert.ok(navigation.includes(snippet), `missing Navigation snippet ${snippet}`);
  });
});
