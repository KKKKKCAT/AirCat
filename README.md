<div align="center">
  <h1>🐱 AirCat</h1>
  <p><strong>A Minimalist, Blazing-Fast P2P File Transfer & Discovery Tool.</strong></p>
  <p>Securely share files and messages directly between devices without leaving a trace.</p>
</div>

---

## 🚀 Overview

**AirCat** is a lightweight, fully open-source peer-to-peer (P2P) file and message sharing application. It is designed with performance, accessibility, and zero-configuration in mind. 

By default, AirCat operates entirely in the browser using WebRTC, meaning **it can run completely serverless**. Files are transferred directly from device to device (E2EE by nature of WebRTC) without ever touching a centralized storage server.

For advanced use cases, such as robust cross-network discovery behind strict NATs, an optional lightweight Node.js **Signaling Server** is provided.

## ✨ Features

- **True P2P Transfers**: Direct device-to-device transfers via WebRTC using PeerJS.
- **Serverless by Default**: Deploy the static frontend (`/web`) to any CDN, GitHub Pages, or Cloudflare Workers—no backend required.
- **Cross-Platform & Multi-Device**: Works seamlessly on mobile, tablet, and desktop browsers. Includes multi-select and broadcast features.
- **QR Code Pairing**: Effortlessly connect mobile devices with a built-in, optimized QR code scanner.
- **Performance Obsessed**: Zero render-blocking resources. CSS is entirely compiled and inlined. JavaScript is optimized and dynamically loaded. Achieves near-perfect PageSpeed Insights scores.
- **Secure**: Native `helmet` integration on the optional signaling server with intelligent dead-connection pruning to prevent DDoS and memory leaks.
- **Internationalization (i18n)**: Out-of-the-box support for English, Traditional Chinese (`zh-TW`), and Simplified Chinese (`zh-CN`).

---

## 🛠 Architecture Modes

AirCat is highly flexible and can be deployed in two distinct modes depending on your infrastructure:

### Mode 1: Serverless (Frontend Only)
You do not need to run `server.js` to use AirCat. The vanilla HTML/JS frontend falls back to standard WebRTC routing.
- **Deployment**: Simply host the `web/` directory on any static file host (Vercel, Netlify, Cloudflare Pages, S3).
- **Setup**: Zero configuration required.

### Mode 2: Self-Hosted Signaling Server (Recommended for restrictive networks)
If users are on heavily restricted corporate networks or cellular data where standard TURN/STUN discovery fails, you can spin up the custom WebSocket Signaling Server.
- **Capabilities**: Enables "Custom Group Rooms" and instant device discovery across isolated networks.
- **Deployment**: Node.js or Docker.

---

## 💻 Getting Started

### Running the Frontend (Serverless)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/aircat.git
   cd aircat
   ```
2. Serve the `web/` directory using any local web server:
   ```bash
   npx serve web/
   # The application is now running on http://localhost:3000
   ```
*(Note: Change the WebSocket connection URL in `web/script.js` and `web/index.html`'s CSP if you intend to connect to a custom signaling server instead of the public defaults).*

### Running the Custom Signaling Server

If you wish to host your own discovery server for enhanced connectivity:

1. Navigate to the root folder:
   ```bash
   cd aircat
   ```
2. Install dependencies:
   ```bash
   npm install express ws helmet
   ```
3. Start the server (defaults to port `3000`):
   ```bash
   node server.js
   ```

**Environment Variables for the Server:**
- `PORT`: (Default: `3000`) The port the WebSocket server runs on.
- `STATS_TOKEN`: (Optional) Set a secure string. Allows you to access the `/stats?token=YOUR_TOKEN` endpoint for server health metrics.

---

## 🛡 Security Highlights

- **Anti-Log Spoofing**: The WebSocket server silently drops invalid JSON payloads to prevent malicious actors from filling up your server's disk space with error logs.
- **Dead Connection Pruning**: Implements an active `ping/pong` heartbeat pattern to gracefully drop disconnected clients, preventing memory leaks scaling up to thousands of concurrent users.
- **Strict Content-Security-Policy (CSP)**: The frontend utilizes robust CSP headers to mitigate XSS attacks and disallow unauthorized third-party scripts.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/yourusername/aircat/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
