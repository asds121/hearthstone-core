// 导出核心类型
export * from './types';

// 导出核心实体
export * from './core/entities/IEntity';
export * from './core/entities/BaseEntity';

// 导出核心事件
export * from './core/events/IGameEvent';
export * from './core/events/ITrigger';
export * from './core/events/BaseTrigger';

// 导出核心区域
export * from './core/zones/IZone';

// 导出游戏状态
export * from './core/GameState';

// 导出游戏主类
export { Game } from './core/Game';

// 导出系统组件
export { EntityManager } from './systems/entity/EntityManager';
export { EventManager } from './systems/event/EventManager';
export { ZoneManager } from './systems/zone/ZoneManager';
export { SequenceManager } from './systems/sequence/SequenceManager';

// 导出工具类
export * from './utils/Logger';
export * from './utils/RandomService';

// 版本信息
export const VERSION = '1.0.0';

// 默认导出
import { Game } from './core/Game';
import { EntityManager } from './systems/entity/EntityManager';
import { EventManager } from './systems/event/EventManager';
import { ZoneManager } from './systems/zone/ZoneManager';
import { SequenceManager } from './systems/sequence/SequenceManager';

export default {
  VERSION,
  Game,
  EntityManager,
  EventManager,
  ZoneManager,
  SequenceManager,
};
