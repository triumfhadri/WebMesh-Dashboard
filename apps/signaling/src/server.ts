import { WebSocketServer, WebSocket } from 'ws';
import { SignalingMessage, PeerInfo } from './protocol';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const wss = new WebSocketServer({ port: PORT });

interface ClientSession {
  ws: WebSocket;
  info: PeerInfo;
  roomId?: string;
}

const clients = new Map<string, ClientSession>();
const rooms = new Map<string, Set<string>>();

console.log(`[WebMesh Signaling Core] Server running on ws://localhost:${PORT}`);

wss.on('connection', (ws: WebSocket) => {
  let currentPeerId: string | null = null;

  ws.on('message', (rawMessage: string) => {
    try {
      const message: SignalingMessage = JSON.parse(rawMessage.toString());
      handleMessage(ws, message);
    } catch (err) {
      console.error('[Signaling Error] Failed to parse payload:', err);
    }
  });

  ws.on('close', () => {
    if (currentPeerId) {
      handleDisconnect(currentPeerId);
    }
  });

  function handleMessage(socket: WebSocket, msg: SignalingMessage) {
    switch (msg.type) {
      case 'register': {
        const peerId = msg.peerId || `node-${Math.random().toString(36).substring(2, 8)}`;
        currentPeerId = peerId;
        clients.set(peerId, {
          ws: socket,
          info: {
            id: peerId,
            name: msg.payload?.name || `Peer-${peerId.substring(5, 9).toUpperCase()}`,
            region: msg.payload?.region || 'EU-Central',
            joinedAt: Date.now(),
          },
        });

        socket.send(
          JSON.stringify({
            type: 'register',
            peerId,
            payload: { status: 'active', activePeers: clients.size },
            timestamp: Date.now(),
          })
        );
        console.log(`[Peer Connected] ID: ${peerId}`);
        break;
      }

      case 'join-room': {
        if (!currentPeerId) return;
        const roomId = msg.roomId || 'global-mesh';
        const session = clients.get(currentPeerId);
        if (session) session.roomId = roomId;

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        const roomPeers = rooms.get(roomId)!;
        roomPeers.add(currentPeerId);

        const peerList: PeerInfo[] = Array.from(roomPeers)
          .filter((id) => id !== currentPeerId)
          .map((id) => clients.get(id)!.info);

        socket.send(
          JSON.stringify({
            type: 'room-peers',
            roomId,
            payload: { peers: peerList },
            timestamp: Date.now(),
          })
        );

        broadcastToRoom(roomId, currentPeerId, {
          type: 'peer-joined',
          peerId: currentPeerId,
          roomId,
          payload: session?.info,
          timestamp: Date.now(),
        });
        break;
      }

      case 'offer':
      case 'answer':
      case 'ice-candidate':
      case 'swarm-bitfield': {
        if (msg.targetPeerId && clients.has(msg.targetPeerId)) {
          const targetWs = clients.get(msg.targetPeerId)!.ws;
          if (targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify(msg));
          }
        } else if (msg.roomId) {
          broadcastToRoom(msg.roomId, currentPeerId || '', msg);
        }
        break;
      }

      case 'ping': {
        socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      }
    }
  }

  function broadcastToRoom(roomId: string, senderId: string, message: SignalingMessage) {
    const room = rooms.get(roomId);
    if (!room) return;
    const serialized = JSON.stringify(message);

    room.forEach((peerId) => {
      if (peerId !== senderId) {
        const client = clients.get(peerId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(serialized);
        }
      }
    });
  }

  function handleDisconnect(peerId: string) {
    const session = clients.get(peerId);
    if (session && session.roomId) {
      const room = rooms.get(session.roomId);
      if (room) {
        room.delete(peerId);
        broadcastToRoom(session.roomId, peerId, {
          type: 'peer-left',
          peerId,
          roomId: session.roomId,
          timestamp: Date.now(),
        });
      }
    }
    clients.delete(peerId);
    console.log(`[Peer Disconnected] ID: ${peerId}`);
  }
});
