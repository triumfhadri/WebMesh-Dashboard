export type MessageType =
  | 'register'
  | 'join-room'
  | 'leave-room'
  | 'offer'
  | 'answer'
  | 'ice-candidate'
  | 'room-peers'
  | 'peer-joined'
  | 'peer-left'
  | 'ping'
  | 'pong'
  | 'swarm-bitfield'
  | 'telemetry-broadcast'
  | 'error';

export interface SignalingMessage {
  type: MessageType;
  peerId?: string;
  targetPeerId?: string;
  roomId?: string;
  payload?: any;
  timestamp?: number;
}

export interface PeerInfo {
  id: string;
  name: string;
  region: string;
  joinedAt: number;
  bitfield?: string;
}
