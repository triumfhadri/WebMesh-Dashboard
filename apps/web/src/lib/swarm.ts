/**
 * BitTorrent 64-Piece Chunk Swarm Manager
 */

export interface PieceState {
  index: number;
  status: 'empty' | 'downloading' | 'verifying' | 'completed';
  seeder: 'Alpha 🇺🇸' | 'Beta 🇩🇪' | 'Gamma 🇸🇬' | 'Local Peer';
  iv?: string;
  size: number;
}

export class SwarmManager {
  private pieces: PieceState[] = [];
  private totalPieces = 64;

  constructor() {
    this.reset();
  }

  public reset() {
    this.pieces = Array.from({ length: this.totalPieces }, (_, i) => ({
      index: i,
      status: 'empty',
      seeder: i % 3 === 0 ? 'Alpha 🇺🇸' : i % 3 === 1 ? 'Beta 🇩🇪' : 'Gamma 🇸🇬',
      size: 64 * 1024,
    }));
  }

  public getPieces(): PieceState[] {
    return [...this.pieces];
  }

  public updatePiece(index: number, update: Partial<PieceState>) {
    if (this.pieces[index]) {
      this.pieces[index] = { ...this.pieces[index], ...update };
    }
  }

  public getProgress(): number {
    const completed = this.pieces.filter((p) => p.status === 'completed').length;
    return Math.round((completed / this.totalPieces) * 100);
  }
}
