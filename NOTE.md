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
├── 105/                              ← List（民國年份）
│   ├── 1060201-1農地清晨小雨後/      ← Album（民國日期 + 事件描述）
│   │   ├── IMG_1202.JPG             ← Photos（JPG 檔案）
│   │   ├── IMG_1203.JPG
│   │   └── ...
│   ├── 1060201-2年初五家族農地聚餐/
│   ├── 1060202高雄漢來午茶+鳳山疊疊樂/
│   └── ...
├── 106/
│   └── ...
└── ...
```

### 命名慣例

- **List 名稱** = 民國年份（如 `105`、`106`）
- **Album 名稱** = `{民國日期}{事件描述}`，同日多事件用 `-1`、`-2` 區分
- **照片檔名** = 相機原始命名（如 `IMG_1202.JPG`）

### 實際規模（用戶提供估計）

- 年份範圍：民國 99 年至今（約 16+ 年）
- 每年相簿數量：100 本以上（逐年增加）
- 圖檔總量：可能破萬
- 單頁顯示照片：控制在 100-200 張
- 圖檔大小：經過人工輸出控管（不會太大）
