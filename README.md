# 龙智斌 · 自我介绍 V2

一个基于本人图文自我介绍与自拍制作的响应式个人网站。

## 浏览体验

- 首屏自拍人物卡、ENTJ 性格贴纸与第一印象选择。
- 滚动揭示、小卡片展开、六组兴趣切换。
- 近期目标与未来愿景分别展示。
- 单独呈现「我能提供的价值」：倾听与陪伴、交流与支持、AI 经验分享。
- 六幕一分钟动态介绍，可暂停、切换、静音和重播。
- 轻柔起步、渐渐上扬再舒缓回落的循环音乐；使用浏览器合成与无缝循环，无外部音频依赖。
- 手机号复制、拨号和主页分享。
- 键盘操作及减少动画偏好支持。

## 使用

直接打开 `index.html` 即可浏览。此站不需要 npm 安装或构建。

GitHub Pages 推荐设置：Settings → Pages → Deploy from a branch → main → /(root)。

仓库为 `Kr-Long/self-intro` 时，网址为 `https://kr-long.github.io/self-intro/`，以 GitHub 实际部署结果为准。

也提供了 `.github/workflows/pages.yml`，可在将 Pages 来源改为 GitHub Actions 后使用。两种部署方式任选一种。

## 内容维护

- `index.html`：主体介绍、联系方式。
- `app.js`：兴趣内容、动态介绍、交互与音乐控制。
- `music.js`：约 46 秒的轻柔渐进配乐和循环处理。
- `style.css`：页面布局和动态效果。
- `assets/portrait.jpg`：本人提供的自拍。

所有事实以本人提供的图片和后续补充为准。页面中的光电、认知科技、火箭等内容是未来愿景。
