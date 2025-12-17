import { EntityId, EntityType, PlayerId, ZoneType, TagType } from '../../types';

/**
 * 基础实体接口
 * 所有游戏实体的基类，定义了实体的基本属性和行为
 */
export interface IEntity {
  /**
   * 实体唯一标识符
   */
  readonly id: EntityId;

  /**
   * 实体类型
   */
  readonly type: EntityType;

  /**
   * 实体当前所在区域
   */
  zone: ZoneType;

  /**
   * 实体在区域中的位置
   */
  zonePosition: number;

  /**
   * 实体的控制者
   */
  controller: PlayerId;

  /**
   * 实体的所有者
   */
  owner: PlayerId;

  /**
   * 实体的标签集合
   */
  tags: Map<TagType, any>;

  /**
   * 实体附魔列表
   */
  enchantments: IEntity[];

  /**
   * 创建时间戳
   */
  createdAt: number;

  /**
   * 最后更新时间戳
   */
  updatedAt: number;

  /**
   * 检查实体是否有指定标签
   */
  hasTag(tag: TagType): boolean;

  /**
   * 获取标签值
   */
  getTag(tag: TagType): any;

  /**
   * 设置标签值
   */
  setTag(tag: TagType, value: any): void;

  /**
   * 移除标签
   */
  removeTag(tag: TagType): void;

  /**
   * 更新实体的最后更新时间戳
   */
  updateTimestamp(): void;

  /**
   * 克隆实体（浅拷贝）
   */
  clone(): IEntity;

  /**
   * 深拷贝实体
   */
  deepClone(): IEntity;

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
 * 游戏实体接口
 */
export interface IGameEntity extends IEntity {
  type: EntityType.GAME;
  turn: number;
  step: number;
  state: number;
}

/**
 * 玩家实体接口
 */
export interface IPlayerEntity extends IEntity {
  type: EntityType.PLAYER;
  name: string;
  hero: IHeroEntity;
  heroPower: IHeroPowerEntity;
  mana: number;
  maxMana: number;
  overload: number;
  pendingOverload: number;
  hand: ICardEntity[];
  deck: ICardEntity[];
  graveyard: IEntity[];
  secrets: ISecretEntity[];
  weapon?: IWeaponEntity;
}

/**
 * 英雄实体接口
 */
export interface IHeroEntity extends IEntity {
  type: EntityType.HERO;
  health: number;
  maxHealth: number;
  armor: number;
  attack: number;
  baseAttack: number;
  isExhausted: boolean;
  canAttack: boolean;
}

/**
 * 随从实体接口
 */
export interface IMinionEntity extends IEntity {
  type: EntityType.MINION;
  attack: number;
  health: number;
  maxHealth: number;
  cost: number;
  baseAttack: number;
  baseHealth: number;
  race?: string;
  isExhausted: boolean;
  canAttack: boolean;
  hasTaunt: boolean;
  hasStealth: boolean;
  hasDivineShield: boolean;
  hasPoisonous: boolean;
  hasLifesteal: boolean;
  hasCharge: boolean;
  hasRush: boolean;
  hasWindfury: boolean;
  hasDeathrattle: boolean;
  hasBattlecry: boolean;
}

/**
 * 法术实体接口
 */
export interface ISpellEntity extends IEntity {
  type: EntityType.SPELL;
  cost: number;
  spellSchool?: string;
  targetType: string;
}

/**
 * 武器实体接口
 */
export interface IWeaponEntity extends IEntity {
  type: EntityType.WEAPON;
  attack: number;
  durability: number;
  maxDurability: number;
  isExhausted: boolean;
  canAttack: boolean;
}

/**
 * 英雄技能实体接口
 */
export interface IHeroPowerEntity extends IEntity {
  type: EntityType.HERO_POWER;
  cost: number;
  isExhausted: boolean;
  canUse: boolean;
}

/**
 * 奥秘实体接口
 */
export interface ISecretEntity extends IEntity {
  type: EntityType.SPELL;
  spellSchool: string;
  isRevealed: boolean;
}

/**
 * 附魔实体接口
 */
export interface IEnchantmentEntity extends IEntity {
  type: EntityType.ENCHANTMENT;
  target: IEntity;
  source: IEntity;
  isVisible: boolean;
  isAura: boolean;
  apply(): void;
  remove(): void;
}

/**
 * 卡牌实体接口
 */
export interface ICardEntity extends IEntity {
  cardId: string;
  name: string;
  cost: number;
  rarity?: string;
  text?: string;
}

/**
 * 实体工厂接口
 */
export interface IEntityFactory {
  createEntity(type: EntityType, attributes?: any): IEntity;
  createGameEntity(attributes?: any): IGameEntity;
  createPlayerEntity(attributes?: any): IPlayerEntity;
  createHeroEntity(attributes?: any): IHeroEntity;
  createMinionEntity(attributes?: any): IMinionEntity;
  createSpellEntity(attributes?: any): ISpellEntity;
  createWeaponEntity(attributes?: any): IWeaponEntity;
  createHeroPowerEntity(attributes?: any): IHeroPowerEntity;
  createEnchantmentEntity(attributes?: any): IEnchantmentEntity;
  createCardEntity(attributes?: any): ICardEntity;
}
