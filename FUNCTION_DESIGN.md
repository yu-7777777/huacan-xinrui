# 功能页面定稿落实

依据已确认的淡景版三页设计图 `exec-c626237f-2e9a-41c4-80de-e264f4201270.png`。

## 背景对应

- 节日共叙：用户提供的橙蓝夕照山水 → `frontend/assets/function-culture.jpg`。
- 同物异名：用户提供的青绿金箔雪景 → `frontend/assets/function-words.jpg`。
- 同一场风：用户提供的青绿高峰云海 → `frontend/assets/function-storm.jpg`。

原图按顺序复制，网页通过 CSS 轻微模糊、降低饱和度并设置约 0.3 透明度；第三张按背景层放大，避开照片查看器的黑边。地图、按钮、正文不会随背景模糊。

## 卷轴

使用内置 ImageGen，以用户提供的卷轴素材图为参考，制作两张透明的空白故事承托面：

- `frontend/assets/story-scroll-green.webp`：青绿边、竹叶、上下木轴，浅色宣纸中心留白。
- `frontend/assets/story-scroll-ochre.webp`：暖赭边、淡水墨山影、上下木轴，浅色宣纸中心留白。

共同提示：front-facing vertical story-card frame, transparent outside, wooden roller rods top and bottom, very light ivory textured paper, central 70% empty for live UI text, full scroll visible; no text, calligraphy, symbols, watermark or background. 青绿款添加 celadon silk edging and bamboo at lower left；暖赭款添加 ochre silk edging and ink mountains across bottom。

## 结构

保留原功能节点与事件处理器：词语页使用一个半透明工作区；节日故事显示在双卷轴上，下载与共创表单在下；地图与地区档案仍采用真实数据，家人关怀区保留复制功能。目录的一屏布局与首页书卷不在此次功能页面改版范围内。

## Fidelity correction 2026-11-26
Built-in imagegen produced wooden-blossom.webp from approved board reference: two warm carved wood type blocks bearing 同 / 懂, with white plum blossom branches, transparent background; no UI. Prompt requested the middle-header decoration, photorealistic wood/watercolor, preserving exact characters. Original exec-c7571b4a-5fb1-4581-9d38-5dc49277fc0f.png.
Built-in imagegen edited user storm screenshot into function-storm-clean.webp: remove only viewer black bands, close icon, counter; retain turquoise/gold mountain/lake composition with no new objects. Original exec-45771559-2f6b-4d26-9a6c-71baafd4f880.png. Both assets copied to frontend/assets; conversion only resized/encoded via Pillow.
Map imagery uses Esri World Imagery geographic tiles with explicit provider attribution; Natural Earth coastlines remain available independently. Route markers remain NOAA IBTrACS geographic records.
