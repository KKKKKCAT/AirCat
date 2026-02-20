<div align="center">
  <h1>🐱 AirCat</h1>
  <p><strong>一款极简、极速的 P2P 文件传输与设备发现工具。</strong></p>
  <p>无需留下任何痕迹，安全地在设备间直接分享文件与消息。</p>
</div>

---

## 🚀 项目介绍

**AirCat** 是一个轻量级、完全开源的 P2P（点对点）文件与消息共享应用程序。设计理念以高性能、易用性以及零配置为核心。

默认情况下，AirCat 完全基于浏览器的 WebRTC 运行，这意味着**它可以完全在无服务器 (Serverless) 的模式下运作**。文件通过设备对设备直接传输（基于 WebRTC 原生的点对点加密 (E2EE)），数据绝对不会经过任何中心化的存储服务器。

针对进阶使用场景（例如：在严格的 NAT 网络架构下需要更稳定的跨网段设备发现功能），我们也提供了一个选配的轻量级 Node.js **信令服务器 (Signaling Server)**。

<div style="display: flex;">
  <img src="./img/aircat_001.webp" width="30%">
  <img src="./img/aircat_003.webp" width="30%">
  <img src="./img/aircat_002.webp" width="30%">
</div>

## ✨ 核心特色

- **纯 P2P 传输**：使用 PeerJS 建立 WebRTC 连接，设备间直接传送文件。
- **默认无服务器 (Serverless)**：可将静态前端文件 (`/web`) 部署至任何 CDN、GitHub Pages 或 Cloudflare Workers — 完全不需要后端。
- **跨平台与多设备支持**：在手机、平板与桌面浏览器皆可无缝运作，支持多选与广播发送功能。
- **QR Code 快速配对**：内置经过优化的 QR Code 扫描器，移动设备配对轻而易举。
- **极致的性能优化**：无任何阻塞渲染 (Render-blocking) 的资源。CSS 已完全编译并内联 (Inlined)，JavaScript 经优化且动态载入，在 PageSpeed Insights 上获得近乎完美的评分。
- **安全可靠**：选配的信令服务器原生集成 `helmet`，并具备智能死连接清除机制，有效防止 DDoS 攻击与内存泄漏。
- **多国语言支持 (i18n)**：开箱即用，支持英文、繁体中文 (`zh-TW`) 以及简体中文 (`zh-CN`)。

---

## 🛠 架构模式

AirCat 具备高度灵活性，可根据您的基础设施架构选择两种不同的部署模式：

### 模式一：无服务器 (仅前端)
您不需要执行 `server.js` 也能使用 AirCat。纯 HTML/JS 前端会自动回退使用标准 WebRTC 路由。
- **部署方式**：只需将 `web/` 目录托管在任何静态文件主机上（如 Vercel, Netlify, Cloudflare Pages, S3）。
- **配置要求**：无需任何配置，开箱即用。

### 模式二：自建信令服务器 (推荐受限网络环境使用)
如果用户处于限制严格的企业网络或部分移动数据环境，导致标准 TURN/STUN 发现机制失效，您可以启动自定义的 WebSocket 信令服务器。
- **进阶功能**：启用“自定义房间码”以及在隔离网段间的实时设备发现。
- **部署方式**：支持 Node.js 或 Docker 部署。

---

## 💻 快速开始

### 运行前端 (无服务器模式)

1. 克隆项目源码：
   ```bash
   git clone https://github.com/KKKKKCAT/AirCat.git
   cd AirCat
   ```
2. 使用任何本地服务器来提供 `web/` 目录：
   ```bash
   npx serve web/
   # 应用程序现在已运行于 http://localhost:3000
   ```
*(注：若您打算连接至自建的信令服务器而非默认公开服务器，请修改 `web/script.js` 中的 WebSocket 连接网址以及 `web/index.html` 的 CSP 设置)。*

### 运行自建信令服务器

若您希望架设专属的信令服务器以获得更好的连接体验：

1. 进入项目根目录：
   ```bash
   cd AirCat
   ```
2. 安装依赖包：
   ```bash
   npm install express ws helmet
   ```
3. 启动服务器（默认使用 `3000` 端口）：
   ```bash
   node server.js
   ```

**服务器环境变量：**
- `PORT`: (默认：`3000`) WebSocket 服务器的运行端口。
- `STATS_TOKEN`: (选填) 设定一组安全的字符串。允许您通过 `/stats?token=您的TOKEN` 端点查看服务器健康状态。

---

## 🛡 安全亮点

- **防御恶意日志写入**：WebSocket 服务器会静默丢弃无效的 JSON 请求，防止恶意攻击者发送垃圾消息塞满服务器的错误日志或硬盘空间。
- **清除无效连接**：实现了主动的 `ping/pong` 心跳包机制，能优雅地断开失去响应的客户端，确保即便扩展到数千名同时在线用户也能防止内存泄漏。
- **严格的内容安全策略 (CSP)**：前端使用了严谨的 CSP 标头，有效减缓 XSS 攻击的风险并封锁未经授权的第三方脚本。

## 🤝 参与贡献

欢迎任何形式的贡献、问题反馈以及功能请求！
请随时查看 [Issues 页面](https://github.com/KKKKKCAT/AirCat/issues)。

1. Fork 本项目
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送至您的分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 授权条款

本项目采用 MIT 授权条款 - 详见 `LICENSE` 文件。
