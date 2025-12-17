import { IEntity } from '../../core/entities/IEntity';
import {
  GameEntity,
  PlayerEntity,
  HeroEntity,
  MinionEntity,
  SpellEntity,
  WeaponEntity,
  HeroPowerEntity,
  EnchantmentEntity,
  CardEntity,
} from '../../core/entities/BaseEntity';
import { EntityType, EntityId } from '../../types';

/**
 * 实体管理器
 * 负责创建、管理和销毁游戏中的所有实体
 */
export class EntityManager {
  private readonly entities: Map<EntityId, IEntity>;
  private nextId: EntityId;
  private idPool: EntityId[];

  constructor() {
    this.entities = new Map<EntityId, IEntity>();
    this.nextId = 1 as EntityId;
    this.idPool = [];
  }

  /**
   * 创建实体
   */
  createEntity(type: EntityType, attributes?: any): IEntity {
    const id = this.acquireId();
    let entity: IEntity;

    switch (type) {
      case EntityType.GAME:
        entity = this.createGameEntity(attributes);
        break;
      case EntityType.PLAYER:
        entity = this.createPlayerEntity(attributes);
        break;
      case EntityType.HERO:
        entity = this.createHeroEntity(attributes);
        break;
      case EntityType.MINION:
        entity = this.createMinionEntity(attributes);
        break;
      case EntityType.SPELL:
        entity = this.createSpellEntity(attributes);
        break;
      case EntityType.WEAPON:
        entity = this.createWeaponEntity(attributes);
        break;
      case EntityType.HERO_POWER:
        entity = this.createHeroPowerEntity(attributes);
        break;
      case EntityType.ENCHANTMENT:
        entity = this.createEnchantmentEntity(attributes);
        break;
      case EntityType.CARD:
        entity = this.createCardEntity(attributes);
        break;
      default:
        throw new Error(`Unknown entity type: ${type}`);
    }

    this.entities.set(id, entity);
    return entity;
  }

  /**
   * 获取实体
   */
  getEntity(id: EntityId): IEntity | null {
    return this.entities.get(id) ?? null;
  }

  /**
   * 更新实体
   */
  updateEntity(id: EntityId, updates: Partial<IEntity>): void {
    const entity = this.getEntity(id);
    if (entity) {
      Object.assign(entity, updates);
      entity.updateTimestamp();
    }
  }

  /**
   * 销毁实体
   */
  destroyEntity(id: EntityId): void {
    const entity = this.getEntity(id);
    if (entity) {
      this.entities.delete(id);
      this.releaseId(id);
    }
  }

  /**
   * 获取所有实体
   */
  getAllEntities(): IEntity[] {
    return Array.from(this.entities.values());
  }

  /**
   * 查询实体
   */
  queryEntities(predicate: (entity: IEntity) => boolean): IEntity[] {
    return this.getAllEntities().filter(predicate);
  }

  /**
   * 获取实体数量
   */
  getEntityCount(): number {
    return this.entities.size;
  }

  /**
   * 清空所有实体
   */
  clear(): void {
    this.entities.clear();
    this.nextId = 1;
    this.idPool = [];
  }

  /**
   * 创建游戏实体
   */
  createGameEntity(attributes?: any): GameEntity {
    const entity = new GameEntity(this.acquireId());
    this.applyAttributes(entity, attributes);
    this.entities.set(entity.id, entity);
    return entity;
  }

  /**
   * 创建玩家实体
   */
  createPlayerEntity(attributes?: any): PlayerEntity {
    const entity = new PlayerEntity(this.acquireId());
    this.applyAttributes(entity, attributes);
    this.entities.set(entity.id, entity);
    return entity;
  }

  /**
   * 创建英雄实体
   */
  createHeroEntity(attributes?: any): HeroEntity {
    const entity = new HeroEntity(this.acquireId());
    this.applyAttributes(entity, attributes);
    this.entities.set(entity.id, entity);
    return entity;
  }

  /**
   * 创建随从实体
   */
  createMinionEntity(attributes?: any): MinionEntity {
    const entity = new MinionEntity(this.acquireId());
    this.applyAttributes(entity, attributes);
    this.entities.set(entity.id, entity);
    return entity;
  }

  /**
   * 创建法术实体
   */
  createSpellEntity(attributes?: any): SpellEntity {
    const entity = new SpellEntity(this.acquireId());
    this.applyAttributes(entity, attributes);
    this.entities.set(entity.id, entity);
    return entity;
  }

  /**
   * 创建武器实体
   */
  createWeaponEntity(attributes?: any): WeaponEntity {
    const entity = new WeaponEntity(this.acquireId());
    this.applyAttributes(entity, attributes);
    this.entities.set(entity.id, entity);
    return entity;
  }

  /**
   * 创建英雄技能实体
   */
  createHeroPowerEntity(attributes?: any): HeroPowerEntity {
    const entity = new HeroPowerEntity(this.acquireId());
    this.applyAttributes(entity, attributes);
    this.entities.set(entity.id, entity);
    return entity;
  }

  /**
   * 创建附魔实体
   */
  createEnchantmentEntity(attributes?: any): EnchantmentEntity {
    const entity = new EnchantmentEntity(this.acquireId());
    this.applyAttributes(entity, attributes);
    this.entities.set(entity.id, entity);
    return entity;
  }

  /**
   * 创建卡牌实体
   */
  createCardEntity(attributes?: any): CardEntity {
    const entity = new CardEntity(this.acquireId());
    this.applyAttributes(entity, attributes);
    this.entities.set(entity.id, entity);
    return entity;
  }

  /**
   * 获取下一个ID
   */
  private acquireId(): EntityId {
    if (this.idPool.length > 0) {
      return this.idPool.pop()!;
    }
    return this.nextId++;
  }

  /**
   * 释放ID（用于ID重用）
   */
  private releaseId(id: EntityId): void {
    this.idPool.push(id);
  }

  /**
   * 应用属性到实体
   */
  private applyAttributes(entity: IEntity, attributes?: any): void {
    if (!attributes) {
      return;
    }

    // 应用基础属性
    if (attributes.name !== undefined) {
      (entity as any).name = attributes.name;
    }
    if (attributes.controller !== undefined) {
      entity.controller = attributes.controller;
      entity.owner = attributes.controller;
    }
    if (attributes.zone !== undefined) {
      entity.zone = attributes.zone;
    }
    if (attributes.zonePosition !== undefined) {
      entity.zonePosition = attributes.zonePosition;
    }

    // 应用标签
    if (attributes.tags) {
      for (const [key, value] of Object.entries(attributes.tags)) {
        entity.setTag(key as any, value);
      }
    }

    // 应用特定类型属性
    switch (entity.type) {
      case EntityType.MINION:
        this.applyMinionAttributes(entity as MinionEntity, attributes);
        break;
      case EntityType.HERO:
        this.applyHeroAttributes(entity as HeroEntity, attributes);
        break;
      case EntityType.WEAPON:
        this.applyWeaponAttributes(entity as WeaponEntity, attributes);
        break;
      case EntityType.SPELL:
        this.applySpellAttributes(entity as SpellEntity, attributes);
        break;
      case EntityType.CARD:
        this.applyCardAttributes(entity as CardEntity, attributes);
        break;
    }
  }

  /**
   * 应用随从属性
   */
  private applyMinionAttributes(entity: MinionEntity, attributes: any): void {
    if (attributes.attack !== undefined) {
      entity.attack = attributes.attack;
      entity.baseAttack = attributes.attack;
    }
    if (attributes.health !== undefined) {
      entity.health = attributes.health;
      entity.maxHealth = attributes.health;
      entity.baseHealth = attributes.health;
    }
    if (attributes.cost !== undefined) {
      entity.cost = attributes.cost;
    }
    if (attributes.race !== undefined) {
      entity.race = attributes.race;
    }
  }

  /**
   * 应用英雄属性
   */
  private applyHeroAttributes(entity: HeroEntity, attributes: any): void {
    if (attributes.health !== undefined) {
      entity.health = attributes.health;
      entity.maxHealth = attributes.health;
    }
    if (attributes.armor !== undefined) {
      entity.armor = attributes.armor;
    }
  }

  /**
   * 应用武器属性
   */
  private applyWeaponAttributes(entity: WeaponEntity, attributes: any): void {
    if (attributes.attack !== undefined) {
      entity.attack = attributes.attack;
    }
    if (attributes.durability !== undefined) {
      entity.durability = attributes.durability;
      entity.maxDurability = attributes.durability;
    }
  }

  /**
   * 应用法术属性
   */
  private applySpellAttributes(entity: SpellEntity, attributes: any): void {
    if (attributes.cost !== undefined) {
      entity.cost = attributes.cost;
    }
    if (attributes.spellSchool !== undefined) {
      entity.spellSchool = attributes.spellSchool;
    }
  }

  /**
   * 应用卡牌属性
   */
  private applyCardAttributes(entity: CardEntity, attributes: any): void {
    if (attributes.cardId !== undefined) {
      entity.cardId = attributes.cardId;
    }
    if (attributes.name !== undefined) {
      entity.name = attributes.name;
    }
    if (attributes.cost !== undefined) {
      entity.cost = attributes.cost;
    }
    if (attributes.rarity !== undefined) {
      entity.rarity = attributes.rarity;
    }
    if (attributes.text !== undefined) {
      entity.text = attributes.text;
    }
  }
}
