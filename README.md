# Welcome to your INgress app 👋
INgress地图软件
现在已有功能：

1、添加门泉列表，点击门泉选项卡，可以查看门泉详情。

2、实现了一些简单的地图游戏INgress玩法如：入侵、占领门泉等。

3、集成了高德地图的API，其中高德地图API要自己部署，具体部署方法问AI就行。只要将API密钥输入即可实现地图游戏功能。

## 如何使用

#### 步骤一：配置API密钥
在代码中替换为你的真实密钥：
   ```bash
   const AMAP_API_KEY = '你的真实高德地图API密钥';
   ```

#### 步骤二：快速部署下载依赖(请使用bash或者powershell)：
   ```bash
   # 检查 Node.js 版本（需要 14+）
   node --version

   # 检查 npm 版本
   npm --version

   # 检查 React Native CLI
   npx react-native --version
   ```

   ```bash
   cd your-project-name  先进入项目目录
   ```
步骤1：安装Expo CLI（如果还没有）
```bash
npm install -g expo-cli
```
步骤2：创建新项目
```bash
cd C:\react_native
npx create-expo-app IngressExpo
cd IngressExpo
```
步骤3：安装必要依赖
```bash
npm install react-native-maps
npm install expo-location
npm install expo-device
```
步骤4：启动开发服务器
```bash
npx expo start
```

#### 步骤三：Download the app
命令行执行完之后，终端会返回一个二维码。去Google Play下载一个Expo Go软件，利用Expo Go软件扫描终端中显示的二维码，应用将立即在手机上运行。
之后就可以调试运行了。

