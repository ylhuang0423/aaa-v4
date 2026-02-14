---
name: commit
description: 建立 commit。根據實際 diff 撰寫 message，讓用戶審閱後執行。
---

## 流程

1. **查看變動** - 執行 `git diff HEAD` 了解實際變動內容
2. **撰寫 message** - 根據 diff 結果（不是對話歷程）撰寫
3. **用戶審閱** - 顯示完整 message 讓用戶確認或修改
4. **執行 commit + push** - 用戶確認後連續執行

## Subject Line 原則

- **統合性描述**：一句話描述核心變動，不是列舉所有檔案
- **不要流水帳**：若有多個獨立變動，寫最重要的那個或建議拆分 commit
- **50 字元內**：遵循 git 慣例
- **英文**：依專案慣例

## 重要

### 根據 Diff 而非對話歷程

Commit message 描述的是「這個版本與前一版的差異」，不是工作過程中的決策歷程。

**情境**：對話中討論命名，從 `dashboard/` 改成 `analytics/`，但這個資料夾對前一版來說根本是新建的。

錯誤（描述過程）：

```
Rename dashboard/ to analytics/
```

正確（描述結果）：

```
Add analytics/ folder structure
```

「rename」是工作過程中的行為，對 diff 來說就是新增。

### 建議拆分的時機

若 diff 包含明顯獨立的變動（例如：修 bug + 加新功能），應主動建議用戶拆分成多個 commit。
