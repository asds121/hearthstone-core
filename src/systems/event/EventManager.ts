import { IGameEvent } from '../../core/events/IGameEvent';
import { ITrigger } from '../../core/events/ITrigger';

import { EventType } from '../../types';
import { EventEmitter } from 'eventemitter3';

/**
 * 事件管理器
 * 负责管理游戏事件的分发和处理
 */
export class EventManager {
  private eventQueue: IGameEvent[] = [];
  private processingQueue: IGameEvent[] = [];
  private readonly triggers: Map<EventType, ITrigger[]> = new Map();
  private readonly emitter: EventEmitter;
  private processingDepth: number = 0;
  private readonly maxProcessingDepth: number = 100;
  private isPaused: boolean = false;

  constructor() {
    this.emitter = new EventEmitter();
    this.initializeTriggerMaps();
  }

  /**
   * 触发事件
   */
  triggerEvent(event: IGameEvent): void {
    if (this.isPaused) {
      return;
    }

    // 设置事件ID和时间戳
    if (!event.eventId) {
      event.eventId = this.generateEventId();
    }
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // 添加到事件队列
    this.eventQueue.push(event);

    // 立即处理事件
    this.processEvents();
  }

  /**
   * 批量触发事件
   */
  triggerEvents(events: IGameEvent[]): void {
    for (const event of events) {
      this.triggerEvent(event);
    }
  }

  /**
   * 注册扳机
   */
  registerTrigger(trigger: ITrigger): void {
    const eventType = trigger.eventType;

    if (!this.triggers.has(eventType)) {
      this.triggers.set(eventType, []);
    }

    const triggerList = this.triggers.get(eventType)!;
    triggerList.push(trigger);

    // 按优先级排序
    this.sortTriggers(triggerList, null as any);
  }

  /**
   * 注销扳机
   */
  unregisterTrigger(triggerId: string): void {
    for (const [, triggerList] of this.triggers) {
      const index = triggerList.findIndex(t => t.id === triggerId);
      if (index !== -1) {
        triggerList.splice(index, 1);
        break;
      }
    }
  }

  /**
   * 批量注册扳机
   */
  registerTriggers(triggers: ITrigger[]): void {
    for (const trigger of triggers) {
      this.registerTrigger(trigger);
    }
  }

  /**
   * 批量注销扳机
   */
  unregisterTriggers(triggerIds: string[]): void {
    for (const triggerId of triggerIds) {
      this.unregisterTrigger(triggerId);
    }
  }

  /**
   * 处理事件队列
   */
  processEvents(): void {
    if (this.processingDepth > this.maxProcessingDepth) {
      console.error('Event processing depth exceeded maximum');
      return;
    }

    this.processingDepth++;

    try {
      // 继续处理直到两个队列都为空
      while (this.eventQueue.length > 0 || this.processingQueue.length > 0) {
        // 优先处理嵌套队列（新产生的事件）
        if (this.processingQueue.length > 0) {
          const event = this.processingQueue.shift()!;
          this.processEvent(event);
        } else if (this.eventQueue.length > 0) {
          // 然后处理主队列
          const event = this.eventQueue.shift()!;
          this.processEvent(event);
        }
      }
    } finally {
      this.processingDepth--;
    }
  }

  /**
   * 清空事件队列
   */
  clearEvents(): void {
    this.eventQueue = [];
    this.processingQueue = [];
    this.processingDepth = 0;
  }

  /**
   * 暂停事件处理
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * 恢复事件处理
   */
  resume(): void {
    this.isPaused = false;
    this.processEvents();
  }

  /**
   * 获取事件队列
   */
  getEventQueue(): IGameEvent[] {
    return [...this.eventQueue, ...this.processingQueue];
  }

  /**
   * 获取指定类型的扳机
   */
  getTriggers(eventType: EventType): ITrigger[] {
    return this.triggers.get(eventType) ?? [];
  }

  /**
   * 处理单个事件
   */
  private processEvent(event: IGameEvent): void {
    // 设置事件深度
    event.depth = this.processingDepth;

    // 获取响应该事件的扳机
    const triggers = this.getTriggersForEvent(event);

    // 按顺序执行扳机
    for (const trigger of triggers) {
      try {
        const newEvents = trigger.onTrigger(event);
        if (newEvents && newEvents.length > 0) {
          // 新事件插入到队列前端（深度优先）
          this.processingQueue.unshift(...newEvents);
        }
      } catch (error) {
        console.error('Error executing trigger:', error);
        // 错误处理：记录但不中断流程
      }
    }

    // 触发外部事件监听器
    this.emitter.emit(event.type, event);
    this.emitter.emit('event', event);
  }

  /**
   * 获取事件的扳机
   */
  private getTriggersForEvent(event: IGameEvent): ITrigger[] {
    const triggers: ITrigger[] = [];

    // 获取事件类型的扳机
    const eventTriggers = this.getTriggers(event.type);
    triggers.push(...eventTriggers);

    // 按优先级、区域和入场顺序排序
    return this.sortTriggers(triggers, event);
  }

  /**
   * 排序扳机
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  private sortTriggers(triggers: ITrigger[], _event: IGameEvent): ITrigger[] {
    return triggers.sort((a, b) => {
      // 1. 按优先级排序
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      // 2. 按区域排序：场上 > 手牌 > 牌库
      const aZoneOrder = this.getZoneOrder(a.entity);
      const bZoneOrder = this.getZoneOrder(b.entity);
      if (aZoneOrder !== bZoneOrder) {
        return aZoneOrder - bZoneOrder;
      }

      // 3. 按入场顺序
      return a.entity.id - b.entity.id;
    });
  }

  /**
   * 获取区域顺序
   */
  private getZoneOrder(entity: any): number {
    switch ((entity as any).zone) {
      case 'PLAY':
        return 1;
      case 'SECRET':
        return 1;
      case 'HAND':
        return 2;
      case 'DECK':
        return 3;
      default:
        return 4;
    }
  }

  /**
   * 初始化扳机映射
   */
  private initializeTriggerMaps(): void {
    // 初始化所有事件类型的扳机列表
    const allEventTypes = Object.values(EventType);
    for (const eventType of allEventTypes) {
      this.triggers.set(eventType, []);
    }
  }

  /**
   * 生成事件ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 添加事件监听器
   */
  on(eventType: EventType, listener: (event: IGameEvent) => void): void {
    this.emitter.on(eventType, listener);
  }

  /**
   * 移除事件监听器
   */
  off(eventType: EventType, listener: (event: IGameEvent) => void): void {
    this.emitter.off(eventType, listener);
  }

  /**
   * 添加一次性事件监听器
   */
  once(eventType: EventType, listener: (event: IGameEvent) => void): void {
    this.emitter.once(eventType, listener);
  }

  /**
   * 添加通用事件监听器
   */
  onAny(listener: (event: IGameEvent) => void): void {
    this.emitter.on('event', listener);
  }

  /**
   * 移除通用事件监听器
   */
  offAny(listener: (event: IGameEvent) => void): void {
    this.emitter.off('event', listener);
  }
}
