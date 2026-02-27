# Task: 将 exam-prep Web 项目打包成 Android App

## 阶段一：规划
- [x] 了解项目结构（纯静态 HTML/CSS/JS）
- [x] 制定打包方案（Capacitor）

## 阶段二：环境准备
- [ ] 检查 Node.js / npm 环境
- [ ] 检查 Java / Android SDK 环境
- [ ] 安装 Capacitor CLI

## 阶段三：Capacitor 初始化
- [ ] 在项目目录初始化 npm
- [ ] 安装 @capacitor/core 和 @capacitor/cli
- [ ] 用 capacitor init 初始化项目
- [ ] 添加 Android 平台
- [ ] 修改 capacitor.config（webDir 指向项目根目录）

## 阶段四：适配移动端
- [ ] 检查 meta viewport 标签（已有）
- [ ] 优化移动端 CSS（响应式、触摸友好）
- [ ] 处理 data/ 中 JS 文件引用路径兼容性

## 阶段五：同步 & 构建
- [ ] 执行 npx cap sync android
- [ ] 配置 AndroidManifest（App 名称、图标等）
- [ ] 生成 release APK（或 debug APK）

## 阶段六：验证
- [ ] 确认 APK 可编译
- [ ] 将 APK 提供给用户安装测试
