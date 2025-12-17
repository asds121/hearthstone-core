/**
 * 随机数服务
 * 提供可预测的随机数生成，支持游戏回放
 */
export class RandomService {
  private sequence: number[] = [];
  private index: number = 0;
  private isRecording: boolean = true;

  /**
   * 创建随机数服务
   * @param seed 随机种子（可选）
   */
  constructor(seed?: number) {
    if (seed !== undefined) {
      this.isRecording = false;
    } else {
      this.isRecording = true;
    }
  }

  /**
   * 获取随机整数
   * @param min 最小值（包含）
   * @param max 最大值（包含）
   * @returns 随机整数
   */
  getRandomInt(min: number, max: number): number {
    if (min > max) {
      [min, max] = [max, min];
    }

    const range = max - min + 1;
    let randomValue: number;

    if (this.isRecording) {
      // 录制模式：生成真正的随机数并记录
      randomValue = Math.floor(Math.random() * range) + min;
      this.sequence.push(randomValue);
    } else {
      // 回放模式：从序列中读取
      if (this.index >= this.sequence.length) {
        throw new Error('Random sequence exhausted');
      }
      randomValue = this.sequence[this.index];
      this.index++;
    }

    return randomValue;
  }

  /**
   * 获取随机浮点数
   * @param min 最小值（包含）
   * @param max 最大值（不包含）
   * @returns 随机浮点数
   */
  getRandomFloat(min: number, max: number): number {
    const range = max - min;
    let randomValue: number;

    if (this.isRecording) {
      randomValue = Math.random() * range + min;
      this.sequence.push(randomValue);
    } else {
      if (this.index >= this.sequence.length) {
        throw new Error('Random sequence exhausted');
      }
      randomValue = this.sequence[this.index];
      this.index++;
    }

    return randomValue;
  }

  /**
   * 从数组中随机选择元素
   * @param array 数组
   * @returns 随机选择的元素
   */
  getRandomElement<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot select from empty array');
    }
    const index = this.getRandomInt(0, array.length - 1);
    return array[index];
  }

  /**
   * 从数组中随机选择多个元素（不重复）
   * @param array 数组
   * @param count 要选择的数量
   * @returns 随机选择的元素数组
   */
  getRandomElements<T>(array: T[], count: number): T[] {
    if (count >= array.length) {
      return [...array];
    }

    if (count <= 0) {
      return [];
    }

    const shuffled = [...array];
    const selected: T[] = [];

    for (let i = 0; i < count; i++) {
      const index = this.getRandomInt(0, shuffled.length - 1);
      selected.push(shuffled.splice(index, 1)[0]);
    }

    return selected;
  }

  /**
   * 打乱数组顺序
   * @param array 数组
   * @returns 打乱后的数组（原数组会被修改）
   */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.getRandomInt(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * 进行概率判断
   * @param probability 概率（0-1之间）
   * @returns 是否成功
   */
  checkProbability(probability: number): boolean {
    if (probability <= 0) {
      return false;
    }
    if (probability >= 1) {
      return true;
    }
    return this.getRandomFloat(0, 1) < probability;
  }

  /**
   * 进行加权随机选择
   * @param items 带权重的项目数组
   * @returns 选中的项目
   */
  getWeightedRandom<T>(items: Array<{ item: T; weight: number }>): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const randomValue = this.getRandomFloat(0, totalWeight);

    let currentWeight = 0;
    for (const item of items) {
      currentWeight += item.weight;
      if (randomValue <= currentWeight) {
        return item.item;
      }
    }

    // 理论上不会到达这里
    return items[items.length - 1].item;
  }

  /**
   * 获取随机序列（用于回放）
   * @returns 随机数序列
   */
  getSequence(): number[] {
    return [...this.sequence];
  }

  /**
   * 设置随机序列（用于回放）
   * @param sequence 随机数序列
   */
  setSequence(sequence: number[]): void {
    this.sequence = [...sequence];
    this.index = 0;
    this.isRecording = false;
  }

  /**
   * 开始录制
   */
  startRecording(): void {
    this.isRecording = true;
  }

  /**
   * 停止录制
   */
  stopRecording(): void {
    this.isRecording = false;
  }

  /**
   * 重置随机序列
   */
  reset(): void {
    this.sequence = [];
    this.index = 0;
    this.isRecording = true;
  }

  /**
   * 获取当前序列索引
   */
  getCurrentIndex(): number {
    return this.index;
  }

  /**
   * 检查是否还有可用的随机数
   */
  hasMoreRandomValues(): boolean {
    return this.index < this.sequence.length;
  }

  /**
   * 获取剩余随机数数量
   */
  getRemainingCount(): number {
    return this.sequence.length - this.index;
  }
}

/**
 * 全局随机数服务实例
 */
export const globalRandomService = new RandomService();
