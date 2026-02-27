# Android App 打包完成报告

## 已完成工作

### 1. Capacitor 初始化
- 安装了 `@capacitor/core`、`@capacitor/cli`、`@capacitor/android`
- 初始化 [capacitor.config.json](file:///Users/ericmao/work/old_cat/exam-prep/capacitor.config.json)，配置 appId = `com.shenzhen.examprep`，appName = `深圳小升初备考`
- 成功添加 Android 平台，生成了完整的 `android/` 工程目录

### 2. 目录结构调整
```
exam-prep/
├── www/                    ← Web 源文件（Capacitor webDir）
│   ├── index.html          ← 已添加移动端 meta 标签 + 底部导航栏
│   ├── css/style.css       ← 已添加移动端响应式适配
│   ├── js/app.js           ← 已更新 navigate() 同步底部导航
│   └── data/               ← 题库数据（原样）
├── android/                ← Android 工程（Capacitor 生成）
│   └── app/src/main/assets/public/  ← Web 文件同步位置
├── capacitor.config.json
└── package.json            ← 已添加便捷 scripts
```

### 3. 移动端适配
- **底部 Tab 导航栏**：移动端隐藏侧边栏，显示 5 个底部 Tab（主页、知识点、练习、试卷、错题本）
- **触摸区域优化**：按钮 min-height 44px，选项 min-height 48px
- **安全区域适配**：使用 `env(safe-area-inset-*)` 适配刘海屏/圆角屏
- **响应式布局**：统计格子 2列、学科卡片 1列、练习筛选行换行等
- **Android meta 标签**：theme-color、mobile-web-app-capable 等

### 4. npm Scripts
```bash
npm run sync          # 同步 Web 文件到 Android 工程
npm run open:android  # 用 Android Studio 打开工程
npm run build:apk     # 构建 debug APK（需要 Android SDK）
```

---

## 🚀 最后一步：用 Android Studio 构建 APK

> [!IMPORTANT]
> **需要先安装 [Android Studio](https://developer.android.com/studio)**（包含 JDK + Android SDK）

### 方法一：用 Android Studio 打开工程（推荐）

1. 安装 Android Studio 并完成首次 SDK 下载
2. 在项目目录运行：
   ```bash
   npm run open:android
   ```
3. Android Studio 打开后，等待 Gradle sync 完成
4. 菜单 **Build → Build Bundle(s) / APK(s) → Build APK(s)**
5. APK 生成位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### 方法二：命令行构建

安装 Android Studio 并配置好环境变量后：
```bash
# 设置 ANDROID_HOME（如果还没设置）
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# 同步并构建
npm run sync
npm run build:apk
```

### 安装到手机

1. 手机开启「开发者模式」→「USB 调试」，或
2. 直接将 `app-debug.apk` 传至手机 → 打开「文件管理器」→ 安装

> [!NOTE]
> 安装时手机会提示"来自未知来源的应用"，需要在设置中允许安装。
> APK 大小约 5-10MB（包含 WebView 和 Web 资源）。

---

## App 信息

| 项目 | 内容 |
|------|------|
| App 名称 | 深圳小升初备考 |
| 包名 | com.shenzhen.examprep |
| 最低 Android 版本 | Android 5.0（API 21）|
| 数据存储 | localStorage（本地持久化）|
| 支持功能 | 全部功能（知识点、练习、试卷、错题本、学习报告）|
