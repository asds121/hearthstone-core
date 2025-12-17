import { IEntity } from './entities/IEntity';
import { IPlayerEntity, IGameEntity } from './entities/BaseEntity';
import { GameId, PlayerId, EntityId, GameState as GameStateEnum } from './types';

/**
 * 游戏状态接口
 * 管理整个游戏的状态信息
 */
export interface IGameState {
  /**
   * 游戏ID
   */
  readonly id: GameId;

  /**
   * 游戏实体
   */
  gameEntity: IGameEntity;

  /**
   * 玩家列表
   */
  players: IPlayerEntity[];

  /**
   * 当前回合玩家
   */
  currentPlayer: PlayerId;

  /**
   * 游戏状态
   */
  state: GameStateEnum;

  /**
   * 游戏开始时间
   */
  startTime: number;

  /**
   * 游戏结束时间
   */
  endTime?: number;

  /**
   * 获取指定玩家
   */
  getPlayer(playerId: PlayerId): IPlayerEntity | null;

  /**
   * 获取指定实体
   */
  getEntity(entityId: EntityId): IEntity | null;

  /**
   * 获取所有实体
   */
  getAllEntities(): IEntity[];

  /**
   * 获取当前回合玩家
   */
  getCurrentPlayer(): IPlayerEntity;

  /**
   * 获取对手玩家
   */
  getOpponentPlayer(): IPlayerEntity;

  /**
   * 获取指定玩家的实体
   */
  getPlayerEntities(playerId: PlayerId): IEntity[];

  /**
   * 添加实体
   */
  addEntity(entity: IEntity): void;

  /**
   * 移除实体
   */
  removeEntity(entityId: EntityId): void;

  /**
   * 更新实体
   */
  updateEntity(entityId: EntityId, updates: Partial<IEntity>): void;

  /**
   * 设置当前回合玩家
   */
  setCurrentPlayer(playerId: PlayerId): void;

  /**
   * 设置游戏状态
   */
  setState(state: GameStateEnum): void;

  /**
   * 游戏是否进行中
   */
  isRunning(): boolean;

  /**
   * 游戏是否结束
   */
  isComplete(): boolean;

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
 * 玩家状态接口
 */
export interface IPlayerState {
  /**
   * 玩家ID
   */
  playerId: PlayerId;

  /**
   * 玩家实体
   */
  entity: IPlayerEntity;

  /**
   * 英雄
   */
  hero: IHeroEntity;

  /**
   * 英雄技能
   */
  heroPower: IHeroPowerEntity;

  /**
   * 武器
   */
  weapon?: IWeaponEntity;

  /**
   * 手牌
   */
  hand: ICardEntity[];

  /**
   * 牌库
   */
  deck: ICardEntity[];

  /**
   * 墓地
   */
  graveyard: IEntity[];

  /**
   * 奥秘
   */
  secrets: ISecretEntity[];

  /**
   * 战场随从
   */
  minions: IMinionEntity[];

  /**
   * 获取所有实体
   */
  getAllEntities(): IEntity[];

  /**
   * 获取指定实体
   */
  getEntity(entityId: EntityId): IEntity | null;

  /**
   * 添加实体到指定区域
   */
  addEntityToZone(entity: IEntity, zone: string): void;

  /**
   * 从指定区域移除实体
   */
  removeEntityFromZone(entity: IEntity, zone: string): void;

  /**
   * 获取指定区域的实体
   */
  getZoneEntities(zone: string): IEntity[];

  /**
   * 获取指定区域的实体数量
   */
  getZoneCount(zone: string): number;
}

// 导入其他接口
import { IHeroEntity, IHeroPowerEntity, IWeaponEntity, ICardEntity, IMinionEntity } from './entities/BaseEntity';