// 基础类型定义
export type EntityId = number;
export type PlayerId = 1 | 2;
export type GameId = string;
export type CardId = string;
export type TriggerId = string;
export type AuraId = string;

// 实体类型枚举
export enum EntityType {
  GAME = 'GAME',
  PLAYER = 'PLAYER',
  HERO = 'HERO',
  MINION = 'MINION',
  SPELL = 'SPELL',
  WEAPON = 'WEAPON',
  HERO_POWER = 'HERO_POWER',
  ENCHANTMENT = 'ENCHANTMENT',
  CARD = 'CARD',
}

// 区域类型枚举
export enum ZoneType {
  PLAY = 'PLAY', // 战场
  HAND = 'HAND', // 手牌
  DECK = 'DECK', // 牌库
  GRAVEYARD = 'GRAVEYARD', // 墓地
  SECRET = 'SECRET', // 奥秘区
  SETASIDE = 'SETASIDE', // 除外区
  REMOVED = 'REMOVED', // 失效区
}

// 游戏步骤枚举
export enum GameStep {
  INVALID = 0,
  BEGIN_FIRST = 1,
  BEGIN_SHUFFLE = 2,
  BEGIN_DRAW = 3,
  BEGIN_MULLIGAN = 4,
  MAIN_READY = 5,
  MAIN_START_TRIGGERS = 6,
  MAIN_START = 7,
  MAIN_ACTION = 8,
  MAIN_END = 9,
  MAIN_CLEANUP = 10,
  MAIN_NEXT = 11,
  FINAL_WRAPUP = 12,
  FINAL_GAMEOVER = 13,
}

// 事件类型枚举
export enum EventType {
  // 基础事件
  DAMAGE = 'DAMAGE',
  HEAL = 'HEAL',
  SUMMON = 'SUMMON',
  DEATH = 'DEATH',
  PLAY_CARD = 'PLAY_CARD',
  COMBAT = 'COMBAT',
  
  // 回合事件
  TURN_START = 'TURN_START',
  TURN_END = 'TURN_END',
  
  // 区域事件
  ZONE_MOVE = 'ZONE_MOVE',
  
  // 特殊事件
  TRANSFORM = 'TRANSFORM',
  CONTROL_CHANGE = 'CONTROL_CHANGE',
  AURA_UPDATE = 'AURA_UPDATE',
}

// 扳机优先级枚举
export enum TriggerPriority {
  HIGH = 1,
  NORMAL = 2,
  LOW = 3,
  LOWEST = 4,
}

// 关键词枚举
export enum KeywordType {
  TAUNT = 'TAUNT',
  STEALTH = 'STEALTH',
  DIVINE_SHIELD = 'DIVINE_SHIELD',
  POISONOUS = 'POISONOUS',
  LIFESTEAL = 'LIFESTEAL',
  CHARGE = 'CHARGE',
  RUSH = 'RUSH',
  WINDFURY = 'WINDFURY',
  DEATHRATTLE = 'DEATHRATTLE',
  BATTLECRY = 'BATTLECRY',
  COMBO = 'COMBO',
  CHOOSE_ONE = 'CHOOSE_ONE',
  ECHO = 'ECHO',
  REBORN = 'REBORN',
  OVERKILL = 'OVERKILL',
  SPELL_DAMAGE = 'SPELL_DAMAGE',
}

// 法术派系枚举
export enum SpellSchool {
  ARCANE = 'ARCANE',
  FIRE = 'FIRE',
  FROST = 'FROST',
  NATURE = 'NATURE',
  HOLY = 'HOLY',
  SHADOW = 'SHADOW',
  FEL = 'FEL',
  PHYSICAL = 'PHYSICAL',
  SECRET = 'SECRET',
  QUEST = 'QUEST',
}

// 随从种族枚举
export enum Race {
  NONE = 'NONE',
  BEAST = 'BEAST',
  DRAGON = 'DRAGON',
  DEMON = 'DEMON',
  ELEMENTAL = 'ELEMENTAL',
  MECH = 'MECH',
  MURLOC = 'MURLOC',
  PIRATE = 'PIRATE',
  TOTEM = 'TOTEM',
  ALL = 'ALL',
}

// 游戏状态枚举
export enum GameState {
  INVALID = 'INVALID',
  WAITING = 'WAITING',
  RUNNING = 'RUNNING',
  COMPLETE = 'COMPLETE',
  DISCONNECTED = 'DISCONNECTED',
}

// 玩家状态枚举
export enum PlayState {
  INVALID = 0,
  PLAYING = 1,
  WINNING = 2,
  LOSING = 3,
  WON = 4,
  LOST = 5,
  TIED = 6,
  DISCONNECTED = 7,
  QUIT = 8,
}

// 序列类型枚举
export enum SequenceType {
  PLAY_CARD = 'PLAY_CARD',
  COMBAT = 'COMBAT',
  USE_HERO_POWER = 'USE_HERO_POWER',
  TURN_START = 'TURN_START',
  TURN_END = 'TURN_END',
  DEATH = 'DEATH',
}

// 标签类型枚举
export enum TagType {
  // 基础属性
  ATK = 'ATK',
  HEALTH = 'HEALTH',
  COST = 'COST',
  ARMOR = 'ARMOR',
  DURABILITY = 'DURABILITY',
  
  // 状态标签
  EXHAUSTED = 'EXHAUSTED',
  JUST_PLAYED = 'JUST_PLAYED',
  TO_BE_DESTROYED = 'TO_BE_DESTROYED',
  MORTALLY_WOUNDED = 'MORTALLY_WOUNDED',
  
  // 关键词标签
  TAUNT = 'TAUNT',
  STEALTH = 'STEALTH',
  DIVINE_SHIELD = 'DIVINE_SHIELD',
  POISONOUS = 'POISONOUS',
  LIFESTEAL = 'LIFESTEAL',
  CHARGE = 'CHARGE',
  RUSH = 'RUSH',
  WINDFURY = 'WINDFURY',
  DEATHRATTLE = 'DEATHRATTLE',
  BATTLECRY = 'BATTLECRY',
  
  // 计数器
  NUM_ATTACKS_THIS_TURN = 'NUM_ATTACKS_THIS_TURN',
  NUM_CARDS_PLAYED_THIS_TURN = 'NUM_CARDS_PLAYED_THIS_TURN',
  NUM_TURNS_IN_PLAY = 'NUM_TURNS_IN_PLAY',
  NUM_TURNS_IN_HAND = 'NUM_TURNS_IN_HAND',
  
  // 资源
  MANA = 'MANA',
  MAX_MANA = 'MAX_MANA',
  OVERLOAD = 'OVERLOAD',
  PENDING_OVERLOAD = 'PENDING_OVERLOAD',
  
  // 游戏状态
  PLAYSTATE = 'PLAYSTATE',
  CURRENT_PLAYER = 'CURRENT_PLAYER',
  TURN = 'TURN',
  STEP = 'STEP',
  
  // 特殊效果
  SPELLPOWER = 'SPELLPOWER',
  HEALING_MULTIPLIER = 'HEALING_MULTIPLIER',
  AURA = 'AURA',
  SILENCE = 'SILENCE',
  
  // 控制
  CONTROLLER = 'CONTROLLER',
  OWNER = 'OWNER',
}

// 胜利类型枚举
export enum VictoryType {
  WIN = 'WIN',
  LOSS = 'LOSS',
  TIE = 'TIE',
  CONCEDE = 'CONCEDE',
  DISCONNECT = 'DISCONNECT',
}

// 配置接口
export interface GameConfig {
  maxTurns?: number;
  turnTimeLimit?: number;
  mulliganTimeLimit?: number;
  enableRandom?: boolean;
  debugMode?: boolean;
}

// 卡牌数据接口
export interface CardData {
  id: string;
  name: string;
  cost: number;
  type: EntityType;
  text?: string;
  attack?: number;
  health?: number;
  durability?: number;
  spellSchool?: SpellSchool;
  race?: Race;
  keywords?: KeywordType[];
  mechanics?: string[];
}

// 玩家数据接口
export interface PlayerData {
  id: string;
  name: string;
  heroClass: string;
  deck: CardData[];
}

// 游戏创建配置接口
export interface CreateGameConfig {
  player1: PlayerData;
  player2: PlayerData;
  config?: GameConfig;
}