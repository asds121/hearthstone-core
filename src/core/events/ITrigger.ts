import { IEntity } from '../entities/IEntity';
import { IGameEvent } from './IGameEvent';
import { EventType, TriggerPriority } from '../../types';

/**
 * 扳机接口
 * 所有事件扳机都实现此接口
 */
export interface ITrigger {
  /**
   * 扳机ID
   */
  id: string;

  /**
   * 扳机所属的实体
   */
  entity: IEntity;

  /**
   * 监听的事件类型
   */
  eventType: EventType;

  /**
   * 触发条件函数
   */
  condition?: (event: IGameEvent) => boolean;

  /**
   * 扳机优先级
   */
  priority: TriggerPriority;

  /**
   * 扳机是否启用
   */
  isEnabled: boolean;

  /**
   * 扳机是否只触发一次
   */
  isOneTime: boolean;

  /**
   * 扳机触发次数
   */
  triggerCount: number;

  /**
   * 最大触发次数（0表示无限制）
   */
  maxTriggers: number;

  /**
   * 触发扳机
   * @param event 触发的事件
   * @returns 新产生的事件列表（如果有）
   */
  onTrigger(event: IGameEvent): IGameEvent[] | void;

  /**
   * 启用扳机
   */
  enable(): void;

  /**
   * 禁用扳机
   */
  disable(): void;

  /**
   * 重置扳机状态
   */
  reset(): void;

  /**
   * 克隆扳机
   */
  clone(): ITrigger;
}

/**
 * 扳机上下文接口
 */
export interface ITriggerContext {
  /**
   * 触发事件的实体
   */
  source: IEntity;

  /**
   * 事件目标
   */
  target?: IEntity;

  /**
   * 事件数据
   */
  data?: any;

  /**
   * 游戏状态
   */
  gameState: any;

  /**
   * 玩家状态
   */
  playerState: any;
}

/**
 * 扳机配置接口
 */
export interface ITriggerConfig {
  /**
   * 扳机ID
   */
  id?: string;

  /**
   * 触发条件
   */
  condition?: (event: IGameEvent) => boolean;

  /**
   * 扳机优先级
   */
  priority?: TriggerPriority;

  /**
   * 是否只触发一次
   */
  isOneTime?: boolean;

  /**
   * 最大触发次数
   */
  maxTriggers?: number;

  /**
   * 额外数据
   */
  data?: any;
}

/**
 * 扳机工厂接口
 */
export interface ITriggerFactory {
  /**
   * 创建扳机
   */
  createTrigger(
    entity: IEntity,
    eventType: EventType,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    config?: ITriggerConfig
  ): ITrigger;

  /**
   * 创建伤害扳机
   */
  createDamageTrigger(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    config?: ITriggerConfig
  ): ITrigger;

  /**
   * 创建治疗扳机
   */
  createHealTrigger(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    config?: ITriggerConfig
  ): ITrigger;

  /**
   * 创建召唤扳机
   */
  createSummonTrigger(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    config?: ITriggerConfig
  ): ITrigger;

  /**
   * 创建死亡扳机
   */
  createDeathTrigger(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    config?: ITriggerConfig
  ): ITrigger;

  /**
   * 创建回合开始扳机
   */
  createTurnStartTrigger(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    config?: ITriggerConfig
  ): ITrigger;

  /**
   * 创建回合结束扳机
   */
  createTurnEndTrigger(
    entity: IEntity,
    handler: (event: IGameEvent) => IGameEvent[] | void,
    config?: ITriggerConfig
  ): ITrigger;
}