---
name: icon
description: 從 build/icon.png 生成 Windows 用的 build/icon.ico。
---

## 原圖位置

`build/icon.png`（建議 1024×1024）

如用戶提供新圖，先複製到 `build/icon.png`。

## 生成 .ico

ICO 是容器格式，可直接內嵌多尺寸 PNG。用 `sips` 縮圖，Node.js 封裝：

```bash
mkdir -p build/_icon_tmp
for size in 16 32 48 256; do
  sips -z $size $size build/icon.png --out build/_icon_tmp/${size}.png
done
```

```bash
node -e "
const fs = require('fs');
const sizes = [16, 32, 48, 256];
const pngs = sizes.map(s => fs.readFileSync('build/_icon_tmp/' + s + '.png'));
const count = pngs.length;
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(count, 4);
const entries = [];
let offset = 6 + 16 * count;
for (const png of pngs) {
  const e = Buffer.alloc(16);
  const dim = png.readUInt32BE(16);
  e.writeUInt8(dim >= 256 ? 0 : dim, 0);
  e.writeUInt8(dim >= 256 ? 0 : dim, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  entries.push(e);
  offset += png.length;
}
fs.writeFileSync('build/icon.ico', Buffer.concat([header, ...entries, ...pngs]));
"
```

```bash
rm -rf build/_icon_tmp
```

## 注意

- `sips` 是 macOS 原生工具，此流程僅適用於 macOS 開發環境
- `build/` 產出物應 commit，確保其他環境不需重新生成即可打包
