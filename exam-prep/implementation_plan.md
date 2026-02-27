# 将「深圳小升初备考系统」打包为 Android App

该项目是一个纯静态 Web 应用（HTML + CSS + JS），无需服务器。
采用 **Capacitor**（Ionic 团队开源）将其打包为原生 Android APK。
Capacitor 会把 Web 文件嵌入 Android WebView，无需重写代码，是最轻量的方案。

## User Review Required

> [!IMPORTANT]
> **需要先手动安装以下环境（当前机器缺少）：**
> 1. **Java JDK 17+**：推荐通过 [Adoptium](https://adoptium.net/) 下载安装，或 `brew install openjdk@17`
> 2. **Android Studio**：从 [developer.android.com/studio](https://developer.android.com/studio) 下载，安装后在 SDK Manager 中安装 Android SDK（API 34+）
>
> 安装完成并设置好 `ANDROID_HOME` 环境变量后，告知我即可继续后续步骤。

> [!NOTE]
> 如果你只需要在手机浏览器上测试，无需安装任何额外工具。
> 如果你有现成的 Android 开发环境（如已安装 Android Studio），也请告知。

---

## Proposed Changes

### Capacitor 初始化

#### [NEW] package.json
在项目根目录初始化 npm，安装 Capacitor 依赖：
```
@capacitor/core
@capacitor/cli
@capacitor/android
```

#### [NEW] capacitor.config.json
```json
{
  "appId": "com.shenzhen.examprep",
  "appName": "深圳小升初备考",
  "webDir": ".",
  "server": { "androidScheme": "https" }
}
```

#### [NEW] android/ 目录
`npx cap add android` 自动生成 Android 工程。

---

### 移动端适配优化

#### [MODIFY] css/style.css
- 优化触摸点击区域（按钮 min-height: 44px）
- 侧边栏在小屏幕下折叠为底部导航栏
- 字体大小移动端适配

#### [MODIFY] index.html
- 添加 `theme-color` meta 标签（Android 状态栏颜色）
- 添加 `apple-mobile-web-app-capable` 等 PWA 相关 meta

---

### Android 工程配置

#### android/app/src/main/AndroidManifest.xml（自动生成后修改）
- App 名称：深圳小升初备考
- 最低 Android 版本：API 21（Android 5.0）
- 目标版本：API 34

#### App 图标（可选）
- 生成一套 App 图标放入 `android/app/src/main/res/` 各 mipmap 目录

---

## Verification Plan

### 自动化验证
```bash
# 检查 Capacitor 是否正确同步
npx cap sync android

# 用 Gradle 构建 debug APK
cd android && ./gradlew assembleDebug
```
构建成功后 APK 位于：
`android/app/build/outputs/apk/debug/app-debug.apk`

### 手动验证
1. 将 `app-debug.apk` 传输到 Android 手机
2. 在手机设置中开启"允许安装未知来源应用"
3. 安装并打开 App，验证以下功能：
   - 主页仪表盘正常显示
   - 知识点全集可以浏览
   - 易错题练习可以答题、提交
   - 模拟试卷可以正常进行
   - 错题本和学习报告正常显示
   - 答题进度通过 localStorage 保存（关闭重开 App 后数据仍在）
