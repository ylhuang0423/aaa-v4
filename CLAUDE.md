# AAA-V4 專案 - Claude 協作指南

## 專案概述

三黃三家的家庭照片分類管理系統，第四代重構。舊專案 aaa3 建於 2018 年（Electron + Vue 2），目標用戶是開發者的爸媽（非技術人員），用於回憶與索引家庭照片。

## 架構

```
src/
├── main/           # Electron 主進程（Node.js，fs 操作）
├── preload/        # Preload bridge（contextBridge）
└── renderer/       # React SPA（純前端）
    └── src/
        ├── App.tsx
        ├── main.tsx
        └── styles/global.css
```

三個 TypeScript 配置對應三個進程：

| 配置                 | 涵蓋                 | 環境        |
| -------------------- | -------------------- | ----------- |
| `tsconfig.node.json` | main + preload       | Node.js     |
| `tsconfig.web.json`  | renderer             | DOM + React |
| `tsconfig.json`      | root（project refs） | —           |

## 技術堆疊

- **Electron** + **electron-vite** + **React 19** + **Tailwind CSS v4** + **TypeScript strict**
- **ESLint 9**（flat config，10.x plugin 生態系尚未就緒）+ **Prettier 3**
- 資料持久化：**localStorage**（不需要資料庫）

## 開發慣例

- 禁止相對引入，強制 `@/*` 絕對路徑（renderer 區域）
- `import type` 強制分離
- import 按 builtin → external → internal 字母排序
- 元件：`export default function`，props 行內宣告
- 樣式：Tailwind utility + `twMerge()` 動態 class
- Commit message：英文
- 文件：中文（專有名詞保留英文）
- package.json 不設定 version

## 相關文件

| 檔案              | Git | 用途                |
| ----------------- | --- | ------------------- |
| `NOTE.md`         | ✓   | aaa3 分析、照片結構 |
| `NOTE.local.md`   | ✗   | 訪談紀錄、待辦事項  |
| `CLAUDE.local.md` | ✗   | 本機外部參考路徑    |
