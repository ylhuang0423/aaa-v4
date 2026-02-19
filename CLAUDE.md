# AAA-V4 專案 - Claude 協作指南

## 專案概述

三黃三家的家庭照片分類管理系統，第四代重構。舊專案 aaa3 建於 2018 年（Electron + Vue 2），目標用戶是開發者的爸媽（非技術人員），用於回憶與索引家庭照片。

## 架構

```
src/
├── main/           # Electron 主進程（Node.js，fs 操作）
├── preload/        # Preload bridge（contextBridge）
├── shared/         # 跨進程共用型別（main、preload、renderer 皆可 import）
└── renderer/       # React SPA（純前端）
    └── src/
        ├── App.tsx
        ├── main.tsx
        └── styles/global.css
```

三個 TypeScript 配置對應三個進程：

| 配置                 | 涵蓋                    | 環境        |
| -------------------- | ----------------------- | ----------- |
| `tsconfig.node.json` | main + preload + shared | Node.js     |
| `tsconfig.web.json`  | renderer + shared       | DOM + React |
| `tsconfig.json`      | root（project refs）    | —           |

Renderer 使用 `@/` alias（→ `src/renderer/src/`）和 `@shared/` alias（→ `src/shared/`）。

## 技術堆疊

- **Electron** + **electron-vite** + **React 19** + **Tailwind CSS v4** + **TypeScript strict**
- **ESLint 9**（flat config，10.x plugin 生態系尚未就緒）+ **Prettier 3**
- 資料持久化：**localStorage**（不需要資料庫）

## 開發慣例

- React 元件與 Tailwind 開發細則見 `.claude/skills/frontend/SKILL.md`
- Commit message：英文
- 文件：中文（專有名詞保留英文）

## 封裝

目標平台為 **Windows x64**。封裝流程見 `/release` skill。

## 相關文件

| 檔案              | Git | 用途                                      |
| ----------------- | --- | ----------------------------------------- |
| `NOTE.md`         | ✓   | aaa3 資料模型與 mutations、照片資料夾結構 |
| `NOTE.local.md`   | ✗   | 用戶訪談紀錄、功能決策、待辦事項          |
| `CLAUDE.local.md` | ✗   | 本機外部參考路徑                          |
