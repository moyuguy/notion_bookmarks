/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('热榜可恢复抓取失败不触发 dev overlay', () => {
  const routeSource = fs.readFileSync(
    path.join(__dirname, '../app/api/hot-news/route.ts'),
    'utf8'
  );

  assert.equal(routeSource.includes("console.error('Fetching hot news..."), false);
  assert.equal(routeSource.includes("console.error('Failed to fetch"), false);
  assert.equal(routeSource.includes('console.warn('), false);
  assert.equal(routeSource.includes("console.info('Fetching hot news..."), false);
  assert.equal(routeSource.includes("logHotNewsDebug('Fetching hot news..."), true);
});
