import { IEntity } from './IEntity';
import { EntityId, EntityType, PlayerId, ZoneType, TagType } from '../../types';

/**
 * 基础实体实现
 * 提供了IEntity接口的默认实现
 */
export abstract class BaseEntity implements IEntity {
  // 导出类型供外部使用
  static readonly EntityType = EntityType;
  static readonly ZoneType = ZoneType;
  static readonly TagType = TagType;
  readonly id: EntityId;
  readonly type: EntityType;
  zone: ZoneType;
  zonePosition: number;
  controller: PlayerId;
  owner: PlayerId;
  tags: Map<TagType, any>;
  enchantments: IEntity[];
  createdAt: number;
  updatedAt: number;

  constructor(id: EntityId, type: EntityType) {
    this.id = id;
    this.type = type;
    this.zone = ZoneType.SETASIDE;
    this.zonePosition = 0;
    this.controller = 1 as PlayerId;
    this.owner = 1 as PlayerId;
    this.tags = new Map<TagType, any>();
    this.enchantments = [];
    this.createdAt = Date.now();
    this.updatedAt = this.createdAt;
  }

  /**
   * 检查实体是否有指定标签
   */
  hasTag(tag: TagType): boolean {
    return this.tags.has(tag);
  }

  /**
   * 获取标签值
   */
  getTag(tag: TagType): any {
    return this.tags.get(tag);
  }

  /**
   * 设置标签值
   */
  setTag(tag: TagType, value: any): void {
    this.tags.set(tag, value);
    this.updateTimestamp();
  }

  /**
   * 移除标签
   */
  removeTag(tag: TagType): void {
    this.tags.delete(tag);
    this.updateTimestamp();
  }

  /**
   * 更新实体的最后更新时间戳
   */
  updateTimestamp(): void {
    this.updatedAt = Date.now();
  }

  /**
   * 克隆实体（浅拷贝）
   */
  clone(): IEntity {
    const cloned = Object.create(this.constructor.prototype);
    Object.assign(cloned, this);
    cloned.tags = new Map(this.tags);
    cloned.enchantments = [...this.enchantments];
    return cloned;
  }

  /**
   * 深拷贝实体
   */
  deepClone(): IEntity {
    const cloned = this.clone();
    // 深拷贝附魔
    cloned.enchantments = this.enchantments.map(enchantment => enchantment.deepClone());
    return cloned;
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): any {
    return {
      id: this.id,
      type: this.type,
      zone: this.zone,
      zonePosition: this.zonePosition,
      controller: this.controller,
      owner: this.owner,
      tags: Object.fromEntries(this.tags),
      enchantments: this.enchantments.map(e => e.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * 从JSON对象恢复
   */
  fromJSON(data: any): void {
    this.zone = data.zone;
    this.zonePosition = data.zonePosition;
    this.controller = data.controller;
    this.owner = data.owner;
    this.tags = new Map(Object.entries(data.tags).map(([key, value]) => [key as TagType, value]));
    this.enchantments = data.enchantments.map((e: any) => {
      // 这里需要根据实体类型创建具体的实体实例
      // 暂时使用BaseEntity作为占位符
      const entity = new (class extends BaseEntity {
        constructor() {
          super(e.id, e.type);
        }
      })();
      entity.fromJSON(e);
      return entity;
    });
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

/**
 * 游戏实体
 */
export class GameEntity extends BaseEntity {
  turn: number = 1;
  step: number = 0;
  state: number = 0;

  constructor(id: EntityId) {
    super(id, EntityType.GAME);
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): any {
    const baseJson = super.toJSON();
    return {
      ...baseJson,
      turn: this.turn,
      step: this.step,
      state: this.state,
    };
  }
}

/**
 * 玩家实体
 */
export class PlayerEntity extends BaseEntity {
  name: string = '';
  hero!: HeroEntity;
  heroPower!: HeroPowerEntity;
  mana: number = 0;
  maxMana: number = 0;
  overload: number = 0;
  pendingOverload: number = 0;
  hand: CardEntity[] = [];
  deck: CardEntity[] = [];
  graveyard: IEntity[] = [];
  secrets: SpellEntity[] = [];
  weapon?: WeaponEntity;

  constructor(id: EntityId) {
    super(id, EntityType.PLAYER);
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): any {
    const baseJson = super.toJSON();
    return {
      ...baseJson,
      name: this.name,
      hero: this.hero?.toJSON(),
      heroPower: this.heroPower?.toJSON(),
      mana: this.mana,
      maxMana: this.maxMana,
      overload: this.overload,
      pendingOverload: this.pendingOverload,
      hand: this.hand.map(card => card.toJSON()),
      deck: this.deck.map(card => card.toJSON()),
      graveyard: this.graveyard.map(entity => entity.toJSON()),
      secrets: this.secrets.map(secret => secret.toJSON()),
      weapon: this.weapon?.toJSON(),
    };
  }
}

/**
 * 英雄实体
 */
export class HeroEntity extends BaseEntity {
  health: number = 30;
  maxHealth: number = 30;
  armor: number = 0;
  attack: number = 0;
  baseAttack: number = 0;
  isExhausted: boolean = true;
  canAttack: boolean = false;

  constructor(id: EntityId) {
    super(id, EntityType.HERO);
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): any {
    const baseJson = super.toJSON();
    return {
      ...baseJson,
      health: this.health,
      maxHealth: this.maxHealth,
      armor: this.armor,
      attack: this.attack,
      baseAttack: this.baseAttack,
      isExhausted: this.isExhausted,
      canAttack: this.canAttack,
    };
  }
}

/**
 * 随从实体
 */
export class MinionEntity extends BaseEntity {
  attack: number = 0;
  health: number = 1;
  maxHealth: number = 1;
  cost: number = 0;
  baseAttack: number = 0;
  baseHealth: number = 1;
  race?: string;
  isExhausted: boolean = true;
  canAttack: boolean = false;
  hasTaunt: boolean = false;
  hasStealth: boolean = false;
  hasDivineShield: boolean = false;
  hasPoisonous: boolean = false;
  hasLifesteal: boolean = false;
  hasCharge: boolean = false;
  hasRush: boolean = false;
  hasWindfury: boolean = false;
  hasDeathrattle: boolean = false;
  hasBattlecry: boolean = false;

  constructor(id: EntityId) {
    super(id, EntityType.MINION);
  }
}

/**
 * 法术实体
 */
export class SpellEntity extends BaseEntity {
  cost: number = 0;
  spellSchool?: string;
  targetType: string = 'NONE';

  constructor(id: EntityId) {
    super(id, EntityType.SPELL);
  }
}

/**
 * 武器实体
 */
export class WeaponEntity extends BaseEntity {
  attack: number = 0;
  durability: number = 0;
  maxDurability: number = 0;
  isExhausted: boolean = true;
  canAttack: boolean = false;

  constructor(id: EntityId) {
    super(id, EntityType.WEAPON);
  }
}

/**
 * 英雄技能实体
 */
export class HeroPowerEntity extends BaseEntity {
  cost: number = 2;
  isExhausted: boolean = true;
  canUse: boolean = true;

  constructor(id: EntityId) {
    super(id, EntityType.HERO_POWER);
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): any {
    const baseJson = super.toJSON();
    return {
      ...baseJson,
      cost: this.cost,
      isExhausted: this.isExhausted,
      canUse: this.canUse,
    };
  }
}

/**
 * 附魔实体
 */
export class EnchantmentEntity extends BaseEntity {
  target!: IEntity;
  source!: IEntity;
  isVisible: boolean = true;
  isAura: boolean = false;

  constructor(id: EntityId) {
    super(id, EntityType.ENCHANTMENT);
  }

  apply(): void {
    // 由子类实现具体的应用逻辑
  }

  remove(): void {
    // 由子类实现具体的移除逻辑
  }
}

/**
 * 卡牌实体
 */
export class CardEntity extends BaseEntity {
  cardId: string = '';
  name: string = '';
  cost: number = 0;
  rarity?: string;
  text?: string;

  constructor(id: EntityId) {
    super(id, EntityType.CARD);
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): any {
    const baseJson = super.toJSON();
    return {
      ...baseJson,
      cardId: this.cardId,
      name: this.name,
      cost: this.cost,
      rarity: this.rarity,
      text: this.text,
    };
  }
}
