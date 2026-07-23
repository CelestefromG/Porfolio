# Celeste Portfolio

沉浸式双语作品集框架，定位为 **Data · UX Research · Visual Storytelling**。

## 已实现

- Three.js 程序化金属银色立体星星
- 首页章节网络与技术图纸式连线
- Hover / 点击“联系方式”掉落工牌
- 中英文切换
- 海报与视频 3D 横向滑动画廊
- 点击作品展开完整项目卡片
- 点击 Data & UX 后，星星向左放大并旋转 180°，右侧展开具体项目分支
- 移动端响应式适配与 reduced-motion 支持

## 本地运行

由于 Three.js 使用 ES Module，请在仓库根目录启动本地服务器：

```bash
python -m http.server 8000
```

浏览器打开 `http://localhost:8000`。

## 替换作品

在 `app.js` 中编辑：

- `posters`：海报、长图和视觉模板
- `videos`：视频与 MMD 项目
- `projects`：Data & UX 项目

目前视觉卡片使用 CSS 生成的占位图案，后续可将真实图片放入 `assets/`，再在项目数据中加入图片路径。

## 发布提醒

工牌当前包含手机号和邮箱。公开部署前，可以删除手机号，仅保留邮箱或改为联系表单。
