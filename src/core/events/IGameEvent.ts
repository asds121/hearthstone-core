import { IEntity } from '../entities/IEntity';
import { EventType } from '../../types';

/**
 * 游戏事件接口
 * 所有游戏事件都实现此接口
 */
export interface IGameEvent {
  /**
   * 事件类型
   */
  type: EventType;

  /**
   * 事件来源实体
   */
  source: IEntity;

  /**
   * 事件目标实体列表
   */
  targets: IEntity[];

  /**
   * 事件发生的时间戳
   */
  timestamp: number;

  /**
   * 事件附加数据
   */
  data?: any;

  /**
   * 事件ID（用于追踪）
   */
  eventId?: string;

  /**
   * 父事件ID（用于事件链追踪）
   */
  parentEventId?: string;

  /**
   * 事件处理深度（防止无限递归）
   */
  depth?: number;
}

/**
 * 伤害事件接口
 */
export interface IDamageEvent extends IGameEvent {
  type: EventType.DAMAGE;
  data: {
    amount: number;
    isSpellDamage: boolean;
    isCombatDamage: boolean;
    isFatigue?: boolean;
  };
}

/**
 * 治疗事件接口
 */
export interface IHealEvent extends IGameEvent {
  type: EventType.HEAL;
  data: {
    amount: number;
    isSpellHeal?: boolean;
  };
}

/**
 * 召唤事件接口
 */
export interface ISummonEvent extends IGameEvent {
  type: EventType.SUMMON;
  data: {
    isPlayed: boolean;
    position?: number;
  };
}

/**
 * 死亡事件接口
 */
export interface IDeathEvent extends IGameEvent {
  type: EventType.DEATH;
  data: {
    wasDestroyed: boolean;
    wasSacrificed: boolean;
    wasTransformed?: boolean;
  };
}

/**
 * 使用卡牌事件接口
 */
export interface IPlayCardEvent extends IGameEvent {
  type: EventType.PLAY_CARD;
  data: {
    card: IEntity;
    wasPlayed: boolean;
    target?: IEntity;
    position?: number;
  };
}

/**
 * 战斗事件接口
 */
export interface ICombatEvent extends IGameEvent {
  type: EventType.COMBAT;
  data: {
    attacker: IEntity;
    defender: IEntity;
    attackerDamage: number;
    defenderDamage: number;
  };
}

/**
 * 区域移动事件接口
 */
export interface IZoneMoveEvent extends IGameEvent {
  type: EventType.ZONE_MOVE;
  data: {
    fromZone: ZoneType;
    toZone: ZoneType;
    fromPosition: number;
    toPosition: number;
  };
}

/**
 * 回合开始事件接口
 */
export interface ITurnStartEvent extends IGameEvent {
  type: EventType.TURN_START;
  data: {
    turn: number;
    player: IEntity;
  };
}

/**
 * 回合结束事件接口
 */
export interface ITurnEndEvent extends IGameEvent {
  type: EventType.TURN_END;
  data: {
    turn: number;
    player: IEntity;
  };
}

/**
 * 变形事件接口
 */
export interface ITransformEvent extends IGameEvent {
  type: EventType.TRANSFORM;
  data: {
    fromCardId: string;
    toCardId: string;
    retainedEnchantments?: IEntity[];
  };
}

/**
 * 控制权变更事件接口
 */
export interface IControlChangeEvent extends IGameEvent {
  type: EventType.CONTROL_CHANGE;
  data: {
    fromController: PlayerId;
    toController: PlayerId;
  };
}

/**
 * 光环更新事件接口
 */
export interface IAuraUpdateEvent extends IGameEvent {
  type: EventType.AURA_UPDATE;
  data: {
    reason: string;
    affectedEntities?: IEntity[];
  };
}

// 导入ZoneType和PlayerId类型
import { ZoneType, PlayerId } from '../../types';
