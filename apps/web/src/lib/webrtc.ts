/**
 * WebRTC DataChannel Engine with Network Impairment & Token Bucket Rate Limiter
 */

export interface WebRTCConfig {
  signalingUrl: string;
  onStateChange?: (state: string) => void;
  onMetricUpdate?: (rtt: number, mbps: number) => void;
}

export class TokenBucket {
  private capacity: number;
  private tokens: number;
  private refillRate: number;
  private lastRefill: number;

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = performance.now();
  }

  public consume(tokensNeeded: number): boolean {
    const now = performance.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;

    if (this.tokens >= tokensNeeded) {
      this.tokens -= tokensNeeded;
      return true;
    }
    return false;
  }

  public updateRates(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.refillRate = refillRate;
  }
}

export class WebRTCEngine {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private config: WebRTCConfig;
  public latencyOffset = 0;
  public packetLossRate = 0;
  public jitterMs = 0;
  public rateLimiter: TokenBucket;

  constructor(config: WebRTCConfig) {
    this.config = config;
    this.rateLimiter = new TokenBucket(10 * 1024 * 1024, 10 * 1024 * 1024);
  }

  public async initializePeerConnection(): Promise<void> {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    this.peerConnection.onconnectionstatechange = () => {
      if (this.config.onStateChange && this.peerConnection) {
        this.config.onStateChange(this.peerConnection.connectionState);
      }
    };
  }

  public createDataChannel(label = 'webmesh-data'): RTCDataChannel {
    if (!this.peerConnection) throw new Error('PeerConnection not initialized');

    this.dataChannel = this.peerConnection.createDataChannel(label, {
      ordered: true,
      maxRetransmits: 3,
    });

    this.dataChannel.binaryType = 'arraybuffer';
    return this.dataChannel;
  }

  public sendChunk(chunk: ArrayBuffer): boolean {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') return false;

    if (!this.rateLimiter.consume(chunk.byteLength)) {
      console.warn('[Token Bucket Throttling] Rate limit reached');
      return false;
    }

    if (this.packetLossRate > 0 && Math.random() * 100 < this.packetLossRate) {
      console.warn('[Chaos Engineering] Simulating dropped packet chunk');
      return false;
    }

    const totalDelay = this.latencyOffset + (this.jitterMs > 0 ? (Math.random() - 0.5) * 2 * this.jitterMs : 0);

    if (totalDelay > 0) {
      setTimeout(() => {
        this.dataChannel?.send(chunk);
      }, Math.max(0, totalDelay));
      return true;
    }

    this.dataChannel.send(chunk);
    return true;
  }
}
