const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const helmet = require('helmet');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, maxPayload: 4 * 1024 });

const rooms = new Map();
const MAX_CLIENTS_PER_ROOM = 20;
const MAX_ROOMS = 5000;

function isValidPeerId(id) {
    return typeof id === 'string' && /^AIRCAT-[0-9]{6}$/.test(id);
}

function isValidRoomKey(key) {
    if (typeof key !== 'string') return false;
    if (key.length === 0 || key.length > 64) return false;
    return /^[a-zA-Z0-9\-_\u4e00-\u9fa5]+$/.test(key);
}

function getRealIP(req) {
    const headers = req.headers;
    if (headers['cf-connecting-ip']) return headers['cf-connecting-ip'].split(',')[0].trim();
    if (headers['x-forwarded-for']) return headers['x-forwarded-for'].split(',')[0].trim();
    return req.socket.remoteAddress;
}

wss.on('connection', (ws, req) => {
    const ip = getRealIP(req);
    const existingRoom = rooms.get(ip);
    if (existingRoom && existingRoom.size >= MAX_CLIENTS_PER_ROOM) {
        ws.close(1013, 'Room full');
        return;
    }
    if (!existingRoom && rooms.size >= MAX_ROOMS) {
        ws.close(1013, 'Server full');
        return;
    }

    let currentRoomKey = ip;

    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    function joinRoom(roomKey) {
        if (!rooms.has(roomKey)) rooms.set(roomKey, new Set());
        const room = rooms.get(roomKey);
        room.add(ws);
        currentRoomKey = roomKey;

        const peers = Array.from(room)
            .filter(client => client !== ws && client.peerId)
            .map(client => client.peerId);

        if (peers.length > 0) {
            ws.send(JSON.stringify({ type: 'peers-found', peers }));
            room.forEach(client => {
                if (client !== ws && client.readyState === 1) {
                    client.send(JSON.stringify({ type: 'peer-joined', peerId: ws.peerId }));
                }
            });
        }
    }

    function leaveCurrentRoom() {
        if (currentRoomKey && rooms.has(currentRoomKey)) {
            const room = rooms.get(currentRoomKey);
            room.delete(ws);
            if (room.size === 0) rooms.delete(currentRoomKey);
        }
    }

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'join') {
                if (!isValidPeerId(data.peerId)) {
                    console.warn(`[警告] 拒絕非法 Peer ID: ${data.peerId}`);
                    ws.close(1008, 'Invalid Peer ID');
                    return;
                }

                ws.peerId = data.peerId;

                let roomKey = ip;
                if (data.customRoomKey) {
                    if (isValidRoomKey(data.customRoomKey)) {
                        roomKey = 'CUSTOM_' + data.customRoomKey;
                    } else {
                        console.warn(`[警告] 拒絕非法房間碼: ${data.customRoomKey}`);
                        ws.close(1008, 'Invalid Room Key');
                        return;
                    }
                }

                leaveCurrentRoom();
                joinRoom(roomKey);

                console.log(`[加入] 用戶 ${data.peerId} 加入房間 ${roomKey}`);
            }
        } catch (e) {
        }
    });

    ws.on('close', leaveCurrentRoom);
    ws.on('error', leaveCurrentRoom);
});

setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });

    rooms.forEach((room, key) => {
        if (room.size === 0) rooms.delete(key);
    });
}, 30 * 1000);

app.get('/stats', (req, res) => {
    const token = req.query.token;
    if (!token || token !== process.env.STATS_TOKEN) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const totalClients = Array.from(rooms.values()).reduce((sum, room) => sum + room.size, 0);

    res.json({
        rooms: rooms.size,
        totalClients: totalClients,
        uptime_seconds: Math.floor(process.uptime()),
    });
});

app.get('/', (req, res) => {
    res.send('AirCat Signaling Server is Running Securely.');
});

server.listen(PORT, () => {
    console.log(`[系統] AirCat Server started on port ${PORT}`);
});