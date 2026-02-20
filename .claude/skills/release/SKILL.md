---
name: release
description: 封裝 Windows x64 免安裝版並輸出以日期命名的資料夾與 zip。
---

## 前置條件

- 確認所有變動已 commit（`git status` 乾淨）
- 確認 typecheck + lint 通過
- 確認 `build/icon.ico` 存在且與 `build/icon.png` 同步（若不存在或 png 較新，先執行 `/icon` skill 生成）

## 流程

1. **確認日期** - 使用今天日期（YYYYMMDD），如用戶指定其他日期則依用戶
2. **清理舊產出** - 刪除 `dist/` 資料夾（如存在）
3. **封裝** - 執行以下指令：
   ```bash
   npm run build && npx electron-builder --win --x64 --dir
   ```
4. **重新命名** - 將 `dist/win-unpacked` 改名為 `dist/aaa-v4-{日期}`
5. **壓縮** - 在 `dist/` 下產出 zip：
   ```bash
   cd dist && zip -r aaa-v4-{日期}.zip aaa-v4-{日期}/
   ```
6. **確認產出** - 列出 exe 與 zip 的檔案大小

## 重要

- 必須指定 `--x64`，macOS ARM 預設會打出 `win-arm64`
- `dist/` 已在 `.gitignore`，不需要 commit
- `package.json` version 與發佈日期無關，version 使用 semver 人工維護
