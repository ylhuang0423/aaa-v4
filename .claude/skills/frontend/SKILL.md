---
name: frontend
description: React 元件與 Tailwind 開發規範。開發 renderer 層時參照。
---

## 元件宣告

```tsx
// 主元件：export default function，props 永遠 inline
export default function WidgetName({ label, value }: { label: string; value: string }) {
  return <div>...</div>;
}

// Private components 在主元件下方，用 function declaration（hoisting）
function LoadingSkeleton() {
  return <div className="h-12 animate-pulse rounded bg-stone-200" />;
}
```

- **Props 永遠 inline**，不獨立宣告 interface
- **主元件在檔案最上方**
- **Private components 在下方**，利用 function declaration hoisting

## 檔案路徑慣例

```
src/renderer/src/components/
└── <page>/                   # 按頁面分資料夾
    └── <WidgetName>.tsx      # PascalCase，無 index.tsx 模式
```

- 目錄名對應頁面（kebab-case）
- 檔名為 PascalCase component 名稱
- 每個 component 一個 `.tsx` 檔案

## Import

使用 `@/` alias，禁止相對路徑：

```tsx
// 1. React core
import { useEffect, useState } from 'react';
// 2. Third-party
import { twMerge } from 'tailwind-merge';
// 3. Local
import { useSomething } from '@/hooks/useSomething';
```

## Styling

### 基本原則

- Tailwind 4：無 `tailwind.config.js`，全局設定在 `src/renderer/src/styles/global.css`（`@theme`, `@layer base`）
- 直接使用 Tailwind utility classes
- className 組合複雜或需條件判斷時，用 `twMerge()`
- **字重限制**：主字體微軟正黑體只有 normal 與 bold 兩種粗細。加重時一律用 `font-bold`，禁止 `font-medium`、`font-semibold`、`font-extrabold` 等中間值（視覺上無效果）

```tsx
// 簡單：直接寫
<div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">

// 條件判斷：twMerge
<p className={twMerge(
  'text-2xl font-bold text-stone-900',
  variant === 'positive' && 'text-success',
  variant === 'negative' && 'text-error',
)}>
```

### 用色優先度

1. **Semantic color variables**（`global.css` `@theme` 定義）— 狀態相關元素
   - `text-info`, `bg-success`, `text-warning`, `text-error`
2. **Tailwind 內建色** — 一般 styling
   - `text-stone-500`, `bg-stone-100`, `border-stone-200`
3. **自定義 utilities** — 僅在必要時使用

### Style Tokens

重複出現的 pattern，直接套用以維持一致性：

| Token        | Classes                                                | 用途         |
| ------------ | ------------------------------------------------------ | ------------ |
| Card 容器    | `rounded-xl border border-stone-200 bg-white shadow-sm` | 卡片外框     |
| Card padding | `p-4`                                                  | 卡片內距     |
| 標題         | `text-lg font-bold text-stone-900`                      | 區塊標題     |
| 標籤         | `text-sm text-stone-500`                                | 次要說明文字 |

> 此表隨開發持續擴充。新增 pattern 前先查表，避免重複定義。

## Null / Loading 處理

資料尚未載入時，component 應顯示 loading 狀態。Loading UI 應與正常狀態保持相同尺寸，避免 layout shift。

```tsx
if (!data) return <LoadingSkeleton />;
```

## SKILL 自身的更新

開發過程中若遇到本 SKILL 未涵蓋但屬於前端開發通則的情境，應提醒回頭更新 SKILL 再繼續，而非 ad hoc 處理。
