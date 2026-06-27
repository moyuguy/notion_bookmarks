# Notion 导航站


## 更新说明
🎉更新内容及更新方法见[保姆级教程](https://moyuguy.github.io/docs_notion_bookmarks/guide/getting-started.html)

<details>
  <summary> 2026/6/27</summary>
 - 2026/6/27 新增包豪斯经典三原色主题，使用红、黄、蓝和粗黑线条构建更鲜明的仪表盘视觉风格。</br>
 - 优化主题切换、桌面侧边导航、移动端顶部导航、一级分类标题和二级分类选中态，选中层级更清晰。</br>
 - 优化天气、空气质量、热榜、链接卡片等组件在包豪斯主题下的可读性和一致性。</br>
 - 热榜可恢复抓取失败改为调试日志，避免开发环境被可降级错误打断。</br>
</details>

<details>
  <summary> 2026/6/23</summary>
 - 2026/6/23 修复网站图标加载异常：远程图标请求超时或失败时会停止加载动画，并显示本地默认图标兜底；如果远程图标随后加载成功，会自动恢复真实图标。</br>
 - 移除未使用的 axios 依赖，处理 GitHub Dependabot 的 axios 安全告警。</br>
 - 项目继续使用 pnpm 管理依赖，请保留 `pnpm-lock.yaml`，不要提交 `package-lock.json`。</br>
</details>

<details>
  <summary> 2025/5/19</summary>
 - 2025/5/19 新增小组件功能，简易时钟/天气/圆形时钟/IP信息/热搜</br>
  <img width="800" alt="demo" src="https://github.com/user-attachments/assets/d81be672-06b9-4df9-b1ec-a80d406284c0" />
  <img width="800" alt="demo" src="https://github.com/user-attachments/assets/31266996-f917-4e6e-8f04-1f6743c9bf32" />
</details>

<details>
  <summary> 2025/3/7</summary>
 - 2025/3/7 新增主题配置，新增赛博朋克主题 </br>
  <img width="800" alt="demo" src="https://github.com/user-attachments/assets/c94456fc-fc4f-4d10-bd64-1a0df53af1ba" />
</details>

## 项目预览
> 🔗 [在线演示](https://portal.ezho.top/)
![项目预览](https://github.com/user-attachments/assets/1d864d20-44b3-4678-b649-6ba96821f1c4)



## 项目简介
这是一个使用 Notion 作为数据库后端的个人导航网站项目。通过 Notion 数据库管理书签和导航链接，并以清晰现代的网页界面呈现。

### 主要特性
- 使用 Notion 作为数据库，无需部署数据库
- 清晰现代的网页界面
- 支持多级分类导航
- 响应式设计，支持桌面和移动端
- 支持多主题切换（简约主题、赛博朋克主题、包豪斯经典三原色主题）
- 一键部署到 Vercel

## 快速开始
[保姆级教程](https://ezho.top/code/2025/02/21/notion-bookmarks-handbook)

### 本地开发

```bash
pnpm install
pnpm dev
```

常用检查命令：

```bash
pnpm test
pnpm lint
pnpm build
```
