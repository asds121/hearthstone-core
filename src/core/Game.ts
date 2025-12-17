import { IGameState } from './GameState';
import { IEntity } from './entities/IEntity';
import {
  GameEntity,
  PlayerEntity,
  HeroEntity,
  HeroPowerEntity,
  CardEntity,
} from './entities/BaseEntity';
import { EntityManager } from '../systems/entity/EntityManager';
import { EventManager } from '../systems/event/EventManager';
import { ZoneManager } from '../systems/zone/ZoneManager';
import { SequenceManager } from '../systems/sequence/SequenceManager';
import {
  GameId,
  PlayerId,
  EntityId,
  GameState as GameStateEnum,
  CreateGameConfig,
  EventType,
  TagType,
} from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 炉石传说游戏主类
 * 协调各个系统，提供游戏的核心功能
 */
export class Game implements IGameState {
  readonly id: GameId;
  gameEntity!: GameEntity;
  players!: PlayerEntity[];
  currentPlayer: PlayerId;
  state: GameStateEnum;
  startTime: number;
  endTime?: number;

  // 系统组件
  private readonly entityManager: EntityManager;
  private readonly eventManager: EventManager;
  private readonly zoneManager: ZoneManager;
  private readonly sequenceManager: SequenceManager;

  constructor(config: CreateGameConfig) {
    this.id = uuidv4();
    this.startTime = Date.now();
    this.state = GameStateEnum.WAITING;
    this.currentPlayer = 1 as PlayerId;

    // 初始化系统组件
    this.entityManager = new EntityManager();
    this.eventManager = new EventManager();
    this.zoneManager = new ZoneManager(this.entityManager);
    this.sequenceManager = new SequenceManager();

    // 初始化游戏
    this.initialize(config);
  }

  /**
   * 初始化游戏
   */
  private initialize(config: CreateGameConfig): void {
    // 创建游戏实体
    this.gameEntity = this.entityManager.createGameEntity({
      id: 1,
      turn: 1,
      step: 0,
      state: 1, // RUNNING
    }) as GameEntity;

    // 创建玩家
    this.players = [];
    this.createPlayer(config.player1, 1 as PlayerId);
    this.createPlayer(config.player2, 2 as PlayerId);

    // 设置游戏状态为等待中（游戏开始后会变成RUNNING）
    this.state = GameStateEnum.WAITING;
  }

  /**
   * 创建玩家
   */
  private createPlayer(playerData: any, playerId: PlayerId): void {
    // 创建玩家实体
    const player = this.entityManager.createPlayerEntity({
      id: playerId + 1, // 玩家1 ID=2, 玩家2 ID=3
      name: playerData.name,
      controller: playerId,
      owner: playerId,
    }) as unknown as PlayerEntity;

    // 创建英雄
    const hero = this.entityManager.createHeroEntity({
      controller: playerId,
      owner: playerId,
      health: 30,
      maxHealth: 30,
      armor: 0,
      attack: 0,
      baseAttack: 0,
      isExhausted: true,
      canAttack: false,
    }) as HeroEntity;
    player.hero = hero;

    // 创建英雄技能
    const heroPower = this.entityManager.createHeroPowerEntity({
      controller: playerId,
      owner: playerId,
      cost: 2,
      isExhausted: true,
      canUse: true,
    }) as HeroPowerEntity;
    player.heroPower = heroPower;

    // 初始化其他属性
    player.mana = 0;
    player.maxMana = 0;
    player.overload = 0;
    player.pendingOverload = 0;
    player.hand = [];
    player.deck = [];
    player.graveyard = [];
    player.secrets = [];

    // 创建牌库
    this.createDeck(player, playerData.deck);

    this.players.push(player);
  }

  /**
   * 创建牌库
   */
  private createDeck(player: PlayerEntity, deckData: any[]): void {
    for (let i = 0; i < deckData.length; i++) {
      const cardData = deckData[i];
      const card = this.entityManager.createCardEntity({
        cardId: cardData.id,
        name: cardData.name,
        cost: cardData.cost,
        controller: player.controller,
        owner: player.owner,
        zone: 'DECK',
        zonePosition: i + 1,
      }) as CardEntity;
      player.deck.push(card);
    }
  }

  /**
   * 获取指定玩家
   */
  getPlayer(playerId: PlayerId): PlayerEntity | null {
    return this.players.find(p => p.controller === playerId) ?? null;
  }

  /**
   * 获取指定实体
   */
  getEntity(entityId: EntityId): IEntity | null {
    return this.entityManager.getEntity(entityId);
  }

  /**
   * 获取所有实体
   */
  getAllEntities(): IEntity[] {
    return this.entityManager.getAllEntities();
  }

  /**
   * 获取当前回合玩家
   */
  getCurrentPlayer(): PlayerEntity {
    return this.getPlayer(this.currentPlayer)!;
  }

  /**
   * 获取对手玩家
   */
  getOpponentPlayer(): PlayerEntity {
    const opponentId = this.currentPlayer === 1 ? 2 : 1;
    return this.getPlayer(opponentId as PlayerId)!;
  }

  /**
   * 获取指定玩家的实体
   */
  getPlayerEntities(playerId: PlayerId): IEntity[] {
    const player = this.getPlayer(playerId);
    if (!player) {
      return [];
    }

    const entities: IEntity[] = [];
    entities.push(player.hero);
    entities.push(player.heroPower);
    // entities.push(...player.minions); // minions属性不存在
    entities.push(...player.hand);
    entities.push(...player.deck);
    entities.push(...player.graveyard);
    entities.push(...player.secrets);
    if (player.weapon) {
      entities.push(player.weapon);
    }
    return entities;
  }

  /**
   * 添加实体
   */
  addEntity(entity: IEntity): void {
    this.entityManager.createEntity(entity.type, entity.toJSON());
  }

  /**
   * 移除实体
   */
  removeEntity(entityId: EntityId): void {
    this.entityManager.destroyEntity(entityId);
  }

  /**
   * 更新实体
   */
  updateEntity(entityId: EntityId, updates: Partial<IEntity>): void {
    this.entityManager.updateEntity(entityId, updates);
  }

  /**
   * 设置当前回合玩家
   */
  setCurrentPlayer(playerId: PlayerId): void {
    this.currentPlayer = playerId;
    this.gameEntity.setTag(TagType.CURRENT_PLAYER as any, playerId);
  }

  /**
   * 设置游戏状态
   */
  setState(state: GameStateEnum): void {
    this.state = state;
    this.gameEntity.setTag(TagType.PLAYSTATE as any, state);
    if (state === GameStateEnum.COMPLETE && !this.endTime) {
      this.endTime = Date.now();
    }
  }

  /**
   * 游戏是否进行中
   */
  isRunning(): boolean {
    return this.state === GameStateEnum.RUNNING;
  }

  /**
   * 游戏是否结束
   */
  isComplete(): boolean {
    return this.state === GameStateEnum.COMPLETE;
  }

  /**
   * 开始游戏
   */
  start(): void {
    this.state = GameStateEnum.RUNNING;
    // 触发游戏开始事件
    this.eventManager.triggerEvent({
      type: EventType.GAME_START,
      source: this.gameEntity,
      targets: [this.gameEntity],
      timestamp: Date.now(),
    });
  }

  /**
   * 结束游戏
   */
  end(winner?: PlayerId): void {
    this.state = GameStateEnum.COMPLETE;
    this.endTime = Date.now();

    // 触发游戏结束事件
    this.eventManager.triggerEvent({
      type: EventType.GAME_END,
      source: this.gameEntity,
      targets: [this.gameEntity],
      timestamp: Date.now(),
      data: {
        winner,
        duration: this.endTime - this.startTime,
      },
    });
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): any {
    return {
      id: this.id,
      gameEntity: this.gameEntity.toJSON(),
      players: this.players.map(p => p.toJSON()),
      currentPlayer: this.currentPlayer,
      state: this.state,
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }

  /**
   * 从JSON对象恢复
   */
  fromJSON(): void {
    // 这里需要实现从JSON恢复游戏状态的逻辑
    // 由于涉及复杂的系统状态恢复，暂时留空
    throw new Error('Game state restoration not implemented');
  }

  /**
   * 获取实体管理器
   */
  getEntityManager(): EntityManager {
    return this.entityManager;
  }

  /**
   * 获取事件管理器
   */
  getEventManager(): EventManager {
    return this.eventManager;
  }

  /**
   * 获取区域管理器
   */
  getZoneManager(): ZoneManager {
    return this.zoneManager;
  }

  /**
   * 获取序列管理器
   */
  getSequenceManager(): SequenceManager {
    return this.sequenceManager;
  }
}
