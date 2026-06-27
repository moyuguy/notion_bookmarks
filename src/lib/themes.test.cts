/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const test = require('node:test');
const { getAllThemes, getThemeMode } = require('../themes/registry');

test('注册包豪斯三原色主题', () => {
  const theme = getAllThemes().find((item: { name: string }) => item.name === 'bauhaus-primary');

  assert.ok(theme);
  assert.equal(theme.displayName, '包豪斯三原色');
  assert.equal(getThemeMode('bauhaus-primary'), 'light');
});
