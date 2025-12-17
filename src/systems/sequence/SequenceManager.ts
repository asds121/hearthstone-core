/**
 * 序列管理器
 * 管理游戏中的各种序列（卡牌使用、战斗、回合等）
 */
export class SequenceManager {
  private currentSequence: any | null = null;
  private sequenceQueue: any[] = [];
  private nextSequenceId: number = 1;

  /**
   * 开始序列
   */
  startSequence(sequence: any): void {
    if (this.currentSequence) {
      this.sequenceQueue.push(sequence);
    } else {
      this.currentSequence = sequence;
      sequence.start();
    }
  }

  /**
   * 结束当前序列
   */
  endCurrentSequence(): void {
    this.currentSequence = null;
    
    // 处理队列中的下一个序列
    if (this.sequenceQueue.length > 0) {
      const nextSequence = this.sequenceQueue.shift();
      this.startSequence(nextSequence);
    }
  }

  /**
   * 获取下一个序列ID
   */
  getNextSequenceId(): number {
    return this.nextSequenceId++;
  }

  /**
   * 获取当前序列
   */
  getCurrentSequence(): any | null {
    return this.currentSequence;
  }

  /**
   * 获取序列队列
   */
  getSequenceQueue(): any[] {
    return [...this.sequenceQueue];
  }

  /**
   * 暂停当前序列
   */
  pauseCurrentSequence(): void {
    if (this.currentSequence) {
      this.currentSequence.pause();
    }
  }

  /**
   * 恢复当前序列
   */
  resumeCurrentSequence(): void {
    if (this.currentSequence) {
      this.currentSequence.resume();
    }
  }

  /**
   * 取消当前序列
   */
  cancelCurrentSequence(): void {
    if (this.currentSequence) {
      this.currentSequence.cancel();
      this.endCurrentSequence();
    }
  }

  /**
   * 清空序列队列
   */
  clearQueue(): void {
    this.sequenceQueue = [];
  }
}