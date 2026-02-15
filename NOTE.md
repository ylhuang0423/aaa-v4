# AAA-V4 專案筆記

## 舊專案 (aaa3) 詳細分析

### 專案概述

這是一個**家庭照片分類管理系統**，使用 Electron 桌面應用框架建構，版本 v1.8.4 Beta（2018年5月）。

### 核心功能

- **照片目錄掃描** - 讀取本地文件系統的照片（使用 Node.js fs 模組）
- **列表/相冊分類** - 兩層結構組織照片（List → Album → Photos）
- **標籤系統** - 為相冊添加標籤和顏色
- **搜索與過濾** - 按名稱搜索、按標籤顏色過濾
- **瀏覽歷史** - 記錄查看過的相冊
- **備忘錄** - 簡單的筆記功能
- **位置記憶** - 記住滾動位置
- **已查看追蹤** - 記錄哪些照片/相冊已經看過

### 技術堆疊（2018年）

| 類別     | 技術                           |
| -------- | ------------------------------ |
| 框架     | Electron v1.8.4                |
| 前端     | Vue 2.x + Vue Router + Vuex    |
| 語言     | TypeScript 2.6.2               |
| UI       | Semantic UI CSS v2.2.12        |
| 資料庫   | lowdb（JSON 檔案）             |
| HTTP     | Axios                          |
| 打包     | electron-packager              |
| 開發工具 | nodemon, ts-node, vue-devtools |

### 頁面/路由結構

1. **Home 頁面** (`/`) - 主頁面
2. **List 頁面** (`/:list`) - 照片列表頁面（按相冊分組）
3. **Album 頁面** (`/:list/:album`) - 相冊詳情頁面
4. **Warning 頁面** (`/warning`) - 警告/錯誤提示頁面

### 資料模型

```javascript
state: {
  photoRoot: string,              // 照片根目錄路徑
  rawLists: [                     // 原始列表數據
    {
      name: string,               // 相冊列表名稱
      albums: [
        {
          name: string,           // 相冊名稱
          photos: [string],       // 照片文件路徑數組（file:// URL 格式）
          label: string           // 相冊標籤/分類
        }
      ]
    }
  ],
  seens: {},                      // 已查看照片跟蹤（二維結構）
  labels: [                       // 所有標籤
    { name: string, color: string }
  ],
  query: string,                  // 搜索查詢字符串
  listPosition: number,           // 列表滾動位置
  albumColumn: number,            // 相冊列數配置
  histories: [                    // 瀏覽歷史
    { list: string, album: string, timestamp: number }
  ],
  memo: string                    // 備忘錄內容
}
```

### Vuex Mutations

- `setPhotoRoot(path)` - 設置照片根目錄
- `loadFiles()` - 加載文件系統中的照片
- `setSeen(list, album)` - 標記已查看
- `search(query)` - 搜索功能
- `filter(color)` - 按標籤顏色過濾
- `clearFilter()` - 清除過濾
- `setAlbumLabel(label)` - 設置相冊標籤
- `setAlbumColumn(col)` - 設置相冊列數
- `saveListPosition(pos)` - 保存列表位置
- `saveHistory(history)` - 保存瀏覽歷史
- `cleanHistories()` - 清除歷史記錄
- `updateMemo(memo)` - 更新備忘錄

### 持久化數據（lowdb）

- `photoRoot` - 照片目錄路徑
- `albumColumn` - 相冊列數配置
- `albumLabel` - 相冊標籤配置
- `histories` - 瀏覽歷史
- `memo` - 備忘錄內容

### 目錄結構

```
aaa3/
├── resources/app/               # Electron 應用核心源代碼
│   ├── src/index.ts            # Electron 主進程入口
│   ├── dist/index.js           # 編譯後的主進程代碼
│   ├── public/
│   │   ├── index.html          # 前端 HTML 入口
│   │   ├── app.js              # Webpack 打包後的前端應用
│   │   ├── app.css             # 樣式表
│   │   └── res/                # 靜態資源（字體、圖片）
│   ├── package.json
│   ├── tsconfig.json
│   └── yarn.lock
├── locales/                     # 本地化文件目錄
├── aaa3 beta.exe               # Windows 可執行文件
└── version                      # 版本文件（v1.8.4）
```

### 樣式特點

- 中文字體：WenQuanYi Zen Hei, PingFang TC, Microsoft JhengHei
- 頁面背景色：淺黃色 (lightyellow)
- 隱藏水平滾動條

---

## Photo 資料夾結構

### 結構

```
photo/
├── 106/                                          ← Shelf（通常是民國年份）
│   ├── 1060101炸醃肉+糖醋魚+炸甜粿+詩捷農地/    ← Album
│   │   ├── IMG_1202.JPG                          ← Photo
│   │   ├── IMG_1203.JPG
│   │   └── ...
│   ├── 1060103香煎班頭魚+胡椒白菜雞+農地晨霧/
│   ├── 1060104黑番茄+玉米+茄花/
│   └── ...
├── 107/
│   └── ...
└── ...
```

### 命名習慣

資料夾由人工管理，以下僅為常見慣例，系統不依賴特定命名格式：

- **Shelf** — 通常以民國年份命名（如 `106`、`107`）
- **Album** — 通常以日期加事件描述命名（如 `1060104黑番茄+玉米+茄花`）
- **Photo** — 相機原始檔名（如 `IMG_1202.JPG`）

### 預估規模

- 年份範圍：民國 99 年至今，持續更新（超過 15 年）
- 每年相簿數量：100 本以上（逐年增加）
- 圖檔總量：可能破萬
- 單頁顯示照片：控制在 100-200 張
- 圖檔大小：經過人工輸出控管（不會太大）

---

## V4 架構設計

完整計畫見 `.claude/plans/groovy-mapping-kettle.md`。以下為摘要。

### 資料模型

```typescript
interface Photo {
  name: string;
  url: string;
}
interface Album {
  name: string;
  photos: Photo[];
}
interface Shelf {
  name: string;
  albums: Album[];
}
type PhotoLibrary = Shelf[];
```

命名變更：aaa3 `rawLists` → `PhotoLibrary`、`list` → `Shelf`（抽象容器，不綁年份語意）、`seens` → `viewed`。

### IPC

Main process 暴露兩個 API：`selectDirectory()`（原生資料夾對話框）、`scanDirectory(rootPath)`（非同步遞迴掃描）。

### 路由（HashRouter）

| 路由             | 頁面      | 職責                   |
| ---------------- | --------- | ---------------------- |
| `/`              | HomePage  | 選資料夾、瀏覽歷史     |
| `/:shelf`        | ShelfPage | 相簿列表 + viewed 標示 |
| `/:shelf/:album` | AlbumPage | 照片瀑布流             |

### 持久化（localStorage）

`photoRoot`, `viewed`, `history`, `scrollPositions`, `albumColumns`, `searchHistory`

### 排序與搜尋

- 預設降序（Z→A），新的年份/日期在上
- 多關鍵詞 OR 搜尋（空格分隔）
- 搜尋歷史保留最近 20 筆

### 版面

Toolbar（fixed top）+ Sidebar（shelf 列表）+ Main Content（router outlet）
