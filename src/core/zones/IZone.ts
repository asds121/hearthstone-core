import { IEntity } from '../entities/IEntity';
import { ZoneType, PlayerId } from '../../types';

/**
 * 区域接口
 * 定义了游戏中区域的基本功能
 */
export interface IZone {
  /**
   * 区域类型
   */
  readonly type: ZoneType;

  /**
   * 区域所属玩家
   */
  readonly playerId: PlayerId;

  /**
   * 区域中的实体列表
   */
  entities: IEntity[];

  /**
   * 区域容量限制
   */
  readonly capacity: number;

  /**
   * 区域当前实体数量
   */
  count: number;

  /**
   * 添加实体到区域
   * @param entity 要添加的实体
   * @param position 添加位置（可选）
   * @returns 是否添加成功
   */
  addEntity(entity: IEntity, position?: number): boolean;

  /**
   * 从区域移除实体
   * @param entity 要移除的实体
   * @returns 是否移除成功
   */
  removeEntity(entity: IEntity): boolean;

  /**
   * 在区域中移动实体位置
   * @param entity 要移动的实体
   * @param newPosition 新位置
   * @returns 是否移动成功
   */
  moveEntity(entity: IEntity, newPosition: number): boolean;

  /**
   * 获取指定位置的实体
   * @param position 位置
   * @returns 实体或null
   */
  getEntityAt(position: number): IEntity | null;

  /**
   * 获取实体的位置
   * @param entity 实体
   * @returns 位置或-1
   */
  getEntityPosition(entity: IEntity): number;

  /**
   * 检查区域是否已满
   */
  isFull(): boolean;

  /**
   * 检查区域是否为空
   */
  isEmpty(): boolean;

  /**
   * 清空区域
   */
  clear(): void;

  /**
   * 获取区域的副本
   */
  getEntities(): IEntity[];

  /**
   * 查找实体
   * @param predicate 查找条件
   * @returns 实体列表
   */
  findEntities(predicate: (entity: IEntity) => boolean): IEntity[];

  /**
   * 检查实体是否在区域中
   * @param entity 实体
   * @returns 是否在区域中
   */
  contains(entity: IEntity): boolean;

  /**
   * 交换两个实体的位置
   * @param entity1 第一个实体
   * @param entity2 第二个实体
   * @returns 是否交换成功
   */
  swapEntities(entity1: IEntity, entity2: IEntity): boolean;

  /**
   * 重新计算所有实体的位置
   */
  recalculatePositions(): void;

  /**
   * 转换为JSON对象
   */
  toJSON(): any;

  /**
   * 从JSON对象恢复
   */
  fromJSON(data: any): void;
}

/**
 * 区域管理器接口
 * 管理所有区域的创建、查询和操作
 */
export interface IZoneManager {
  /**
   * 获取指定区域
   * @param zoneType 区域类型
   * @param playerId 玩家ID
   * @returns 区域实例
   */
  getZone(zoneType: ZoneType, playerId: PlayerId): IZone;

  /**
   * 移动实体到指定区域
   * @param entity 要移动的实体
   * @param newZone 目标区域类型
   * @param newPlayerId 目标玩家ID（如果控制权变更）
   * @param position 目标位置（可选）
   * @returns 移动结果
   */
  moveEntity(
    entity: IEntity,
    newZone: ZoneType,
    newPlayerId?: PlayerId,
    position?: number
  ): MoveResult;

  /**
   * 检查实体是否可以移动到指定区域
   * @param entity 要移动的实体
   * @param newZone 目标区域类型
   * @param newPlayerId 目标玩家ID
   * @returns 是否可以移动
   */
  canMoveToZone(entity: IEntity, newZone: ZoneType, newPlayerId?: PlayerId): boolean;

  /**
   * 获取指定区域中的所有实体
   * @param zoneType 区域类型
   * @param playerId 玩家ID
   * @returns 实体列表
   */
  getZoneEntities(zoneType: ZoneType, playerId: PlayerId): IEntity[];

  /**
   * 获取指定区域中的实体数量
   * @param zoneType 区域类型
   * @param playerId 玩家ID
   * @returns 实体数量
   */
  getZoneCount(zoneType: ZoneType, playerId: PlayerId): number;

  /**
   * 获取实体当前所在的区域
   * @param entity 实体
   * @returns 区域类型和玩家ID
   */
  getEntityZone(entity: IEntity): { zoneType: ZoneType; playerId: PlayerId };

  /**
   * 查找实体
   * @param predicate 查找条件
   * @returns 实体列表
   */
  findEntities(predicate: (entity: IEntity) => boolean): IEntity[];

  /**
   * 创建区域
   * @param zoneType 区域类型
   * @param playerId 玩家ID
   * @returns 区域实例
   */
  createZone(zoneType: ZoneType, playerId: PlayerId): IZone;

  /**
   * 清空指定区域
   * @param zoneType 区域类型
   * @param playerId 玩家ID
   */
  clearZone(zoneType: ZoneType, playerId: PlayerId): void;

  /**
   * 清空所有区域
   */
  clearAllZones(): void;

  /**
   * 区域移动事件
   */
  onZoneChanged(
    entity: IEntity,
    fromZone: ZoneType,
    toZone: ZoneType,
    fromPlayerId: PlayerId,
    toPlayerId: PlayerId
  ): void;
}

/**
 * 区域移动结果枚举
 */
export enum MoveResult {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  MOVED_TO_GRAVEYARD = 'MOVED_TO_GRAVEYARD',
  BURNED = 'BURNED',
}

/**
 * 区域移动处理器接口
 * 处理特殊移动情况（如满区域）
 */
export interface IZoneMoveHandler {
  /**
   * 处理满区域情况
   * @param entity 要移动的实体
   * @param targetZone 目标区域
   * @param targetPlayerId 目标玩家
   * @returns 处理结果
   */
  handleFullZone(entity: IEntity, targetZone: ZoneType, targetPlayerId: PlayerId): MoveResult;

  /**
   * 处理区域溢出
   * @param zone 溢出区域
   * @param playerId 玩家
   * @returns 需要移除的实体列表
   */
  handleZoneOverflow(zone: ZoneType, playerId: PlayerId): IEntity[];
}

/**
 * 区域限制配置接口
 */
export interface IZoneLimits {
  [key: string]: {
    capacity: number;
    overflowHandler: (entity: IEntity, zone: IZone) => MoveResult;
  };
}
