import { ITrigger, ITriggerConfig } from './ITrigger';
import { IEntity } from '../entities/IEntity';
import { IGameEvent } from './IGameEvent';
import { EventType, TriggerPriority } from '../../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 基础扳机实现
 * 提供了ITrigger接口的默认实现
 */
export abstract class BaseTrigger implements ITrigger {
  id: string;
  entity: IEntity;
  eventType: EventType;
  condition?: (event: IGameEvent) => boolean;
  priority: TriggerPriority;
  isEnabled: boolean;
  isOneTime: boolean;
  triggerCount: number;
  maxTriggers: number;

  constructor(
    entity: IEntity,
    eventType: EventType,
    condition?: (event: IGameEvent) => boolean,
    priority: TriggerPriority = TriggerPriority.NORMAL,
    isOneTime: boolean = false,
    maxTriggers: number = 0
  ) {
    this.id = uuidv4();
    this.entity = entity;
    this.eventType = eventType;
    this.condition = condition;
    this.priority = priority;
    this.isEnabled = true;
    this.isOneTime = isOneTime;
    this.triggerCount = 0;
    this.maxTriggers = maxTriggers;
  }

  /**
   * 触发扳机
   */
  abstract onTrigger(event: IGameEvent): IGameEvent[] | void;

  /**
   * 启用扳机
   */
  enable(): void {
    this.isEnabled = true;
  }

  /**
   * 禁用扳机
   */
  disable(): void {
    this.isEnabled = false;
  }

  /**
   * 重置扳机状态
   */
  reset(): void {
    this.triggerCount = 0;
    this.isEnabled = true;
  }

  /**
   * 克隆扳机
   */
  clone(): ITrigger {
    // 由具体的子类实现
    throw new Error('Method not implemented');
  }

  /**
   * 检查是否可以触发
   */
  protected canTrigger(event: IGameEvent): boolean {
    if (!this.isEnabled) {
      return false;
    }

    if (this.eventType !== event.type) {
      return false;
    }

    if (this.maxTriggers > 0 && this.triggerCount >= this.maxTriggers) {
      return false;
    }

    if (this.condition && !this.condition(event)) {
      return false;
    }

    return true;
  }

  /**
   * 增加触发计数
   */
  protected incrementTriggerCount(): void {
    this.triggerCount++;
    if (this.isOneTime && this.triggerCount >= 1) {
      this.disable();
    }
  }
}

/**
 * 简单扳机实现
 * 用于简单的回调式扳机
 */
export class SimpleTrigger extends BaseTrigger {
  private handler: (event: IGameEvent) => IGameEvent[] | void;

  constructor(
    entity: IEntity,
    eventType: EventType,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    condition?: (event: IGameEvent) => boolean,
    priority: TriggerPriority = TriggerPriority.NORMAL,
    isOneTime: boolean = false,
    maxTriggers: number = 0
  ) {
    super(entity, eventType, condition, priority, isOneTime, maxTriggers);
    this.handler = handler;
  }

  onTrigger(event: IGameEvent): IGameEvent[] | void {
    if (!this.canTrigger(event)) {
      return;
    }

    this.incrementTriggerCount();
    return this.handler(event);
  }

  clone(): ITrigger {
    return new SimpleTrigger(
      this.entity,
      this.eventType,
      this.handler,
      this.condition,
      this.priority,
      this.isOneTime,
      this.maxTriggers
    );
  }
}

/**
 * 伤害扳机
 */
export class DamageTrigger extends BaseTrigger {
  constructor(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    condition?: (event: IGameEvent) => boolean,
    priority: TriggerPriority = TriggerPriority.NORMAL,
    isOneTime: boolean = false,
    maxTriggers: number = 0
  ) {
    super(entity, EventType.DAMAGE, condition, priority, isOneTime, maxTriggers);
  }

  onTrigger(event: IGameEvent): IGameEvent[] | void {
    if (!this.canTrigger(event)) {
      return;
    }

    this.incrementTriggerCount();
    // 这里可以添加伤害相关的特殊处理逻辑
    return this.handleDamage(event);
  }

  protected handleDamage(event: IGameEvent): IGameEvent[] | void {
    // 由子类实现具体的伤害处理逻辑
    throw new Error('Method not implemented');
  }

  clone(): ITrigger {
    return new DamageTrigger(
      this.entity,
      this.handler,
      this.condition,
      this.priority,
      this.isOneTime,
      this.maxTriggers
    );
  }

  private handler: (event: IGameEvent) => IGameEvent[] | void;
}

/**
 * 治疗扳机
 */
export class HealTrigger extends BaseTrigger {
  constructor(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    condition?: (event: IGameEvent) => boolean,
    priority: TriggerPriority = TriggerPriority.NORMAL,
    isOneTime: boolean = false,
    maxTriggers: number = 0
  ) {
    super(entity, EventType.HEAL, condition, priority, isOneTime, maxTriggers);
  }

  onTrigger(event: IGameEvent): IGameEvent[] | void {
    if (!this.canTrigger(event)) {
      return;
    }

    this.incrementTriggerCount();
    return this.handleHeal(event);
  }

  protected handleHeal(event: IGameEvent): IGameEvent[] | void {
    // 由子类实现具体的治疗处理逻辑
    throw new Error('Method not implemented');
  }

  clone(): ITrigger {
    return new HealTrigger(
      this.entity,
      this.handler,
      this.condition,
      this.priority,
      this.isOneTime,
      this.maxTriggers
    );
  }

  private handler: (event: IGameEvent) => IGameEvent[] | void;
}

/**
 * 召唤扳机
 */
export class SummonTrigger extends BaseTrigger {
  constructor(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    condition?: (event: IGameEvent) => boolean,
    priority: TriggerPriority = TriggerPriority.NORMAL,
    isOneTime: boolean = false,
    maxTriggers: number = 0
  ) {
    super(entity, EventType.SUMMON, condition, priority, isOneTime, maxTriggers);
  }

  onTrigger(event: IGameEvent): IGameEvent[] | void {
    if (!this.canTrigger(event)) {
      return;
    }

    this.incrementTriggerCount();
    return this.handleSummon(event);
  }

  protected handleSummon(event: IGameEvent): IGameEvent[] | void {
    // 由子类实现具体的召唤处理逻辑
    throw new Error('Method not implemented');
  }

  clone(): ITrigger {
    return new SummonTrigger(
      this.entity,
      this.handler,
      this.condition,
      this.priority,
      this.isOneTime,
      this.maxTriggers
    );
  }

  private handler: (event: IGameEvent) => IGameEvent[] | void;
}

/**
 * 死亡扳机
 */
export class DeathTrigger extends BaseTrigger {
  constructor(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    condition?: (event: IGameEvent) => boolean,
    priority: TriggerPriority = TriggerPriority.NORMAL,
    isOneTime: boolean = false,
    maxTriggers: number = 0
  ) {
    super(entity, EventType.DEATH, condition, priority, isOneTime, maxTriggers);
  }

  onTrigger(event: IGameEvent): IGameEvent[] | void {
    if (!this.canTrigger(event)) {
      return;
    }

    this.incrementTriggerCount();
    return this.handleDeath(event);
  }

  protected handleDeath(event: IGameEvent): IGameEvent[] | void {
    // 由子类实现具体的死亡处理逻辑
    throw new Error('Method not implemented');
  }

  clone(): ITrigger {
    return new DeathTrigger(
      this.entity,
      this.handler,
      this.condition,
      this.priority,
      this.isOneTime,
      this.maxTriggers
    );
  }

  private handler: (event: IGameEvent) => IGameEvent[] | void;
}

// 导入ZoneType和PlayerId类型（如果需要）
import { ZoneType, PlayerId } from '../../types';