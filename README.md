# aaa-v4

三黃三家的家庭照片分類管理系統，第四代。

一個純本地的 Electron 桌面應用，讓爸媽可以瀏覽、回憶、索引家庭照片。

## 專案族譜

從爸爸的手作網頁發展至今的第四代，aaa 這個名字已經成為家族情感的一部分。

### aaa（初代）

- **時期**：2017 以前
- **作者**：爸爸
- **技術**：Dreamweaver 手工製作的靜態 HTML 網頁
- **使用方式**：本地用瀏覽器直接開啟預覽
- **命名由來**：沒有特別意義的名字，但經歷四代後已成為有家族情感的名稱

### aaa2（二代）

- **時期**：約 2017
- **作者**：兒子（開發者）獨立用前端技術開發
- **技術**：Vue 2 + Vue Router + Vuex + Webpack 1 + Semantic UI CSS + Sass + Pug
- **使用方式**：純靜態 SPA，用瀏覽器開啟 `index.html`
- **照片資料**：用 Node.js 腳本（`babel-node aaa.js`）掃描檔案系統產生 `photo.json`，再由 Webpack 打包進應用
- **痛點**：目標電腦需要 Node.js 環境，每次照片更新都要手動跑腳本重新產生 JSON，隨著照片規模膨脹很快不敷使用

### aaa3（三代）

- **時期**：2018 年 5 月（v1.8.4 Beta）
- **作者**：兒子與朋友 [andy23512](https://github.com/andy23512) 合作開發
- **技術**：Electron v1.8.4 + Vue 2 + Vue Router + Vuex + TypeScript 2.6 + Semantic UI CSS + lowdb
- **重大改進**：
  - All-in-one 封裝在 Electron，不需要 Node.js 環境
  - 直接調用 OS 的資料夾選取工具選擇 photoRoot
  - 即時掃描檔案系統，不需要手動產生 JSON
  - 重新設計 UI/UX，加入實驗性功能（標籤、備忘錄、瀏覽歷史等）
- **評價**：大致獲得好評，間隔多年未更新因為堪用好用多於不好用

### aaa-v4（四代，本專案）

- **時期**：2026 年 2 月
- **技術**：Electron + Vite + React 19 + Tailwind CSS v4 + TypeScript strict
- **目標**：專案正式工程化、AI 協作治理化

## 開發

```bash
npm install
npm run dev
npm run build        # electron-vite build
npm run build:win    # electron-builder package
npm run typecheck
npm run lint
npm run format
```

## 技術堆疊

Electron + electron-vite / React 19 / Tailwind CSS v4 / TypeScript strict / ESLint 9 + Prettier 3

本專案使用 [Claude Code](https://claude.ai/claude-code) 進行開發。
