import { Game } from '../core/Game';
import { EntityType, PlayerId } from '../types';

describe('Game', () => {
  let game: Game;
  const testConfig = {
    player1: {
      id: 'player1',
      name: 'Test Player 1',
      heroClass: 'MAGE',
      deck: [
        {
          id: 'card1',
          name: 'Test Card 1',
          cost: 1,
          type: EntityType.MINION,
          attack: 1,
          health: 1,
        },
        {
          id: 'card2',
          name: 'Test Card 2',
          cost: 2,
          type: EntityType.MINION,
          attack: 2,
          health: 2,
        },
        {
          id: 'card3',
          name: 'Test Card 3',
          cost: 3,
          type: EntityType.MINION,
          attack: 3,
          health: 3,
        },
        // 添加更多卡牌以达到30张
        ...Array(27).fill({
          id: 'card',
          name: 'Test Card',
          cost: 1,
          type: EntityType.MINION,
          attack: 1,
          health: 1,
        }),
      ],
    },
    player2: {
      id: 'player2',
      name: 'Test Player 2',
      heroClass: 'WARRIOR',
      deck: [
        {
          id: 'card4',
          name: 'Test Card 4',
          cost: 1,
          type: EntityType.MINION,
          attack: 1,
          health: 1,
        },
        {
          id: 'card5',
          name: 'Test Card 5',
          cost: 2,
          type: EntityType.MINION,
          attack: 2,
          health: 2,
        },
        {
          id: 'card6',
          name: 'Test Card 6',
          cost: 3,
          type: EntityType.MINION,
          attack: 3,
          health: 3,
        },
        // 添加更多卡牌以达到30张
        ...Array(27).fill({
          id: 'card',
          name: 'Test Card',
          cost: 1,
          type: EntityType.MINION,
          attack: 1,
          health: 1,
        }),
      ],
    },
    config: {
      maxTurns: 90,
      turnTimeLimit: 75,
      debugMode: true,
    },
  };

  beforeEach(() => {
    game = new Game(testConfig);
  });

  describe('游戏初始化', () => {
    test('应该正确创建游戏实例', () => {
      expect(game).toBeDefined();
      expect(game.id).toBeDefined();
      expect(game.startTime).toBeGreaterThan(0);
    });

    test('应该正确创建玩家', () => {
      const player1 = game.getPlayer(1 as PlayerId);
      const player2 = game.getPlayer(2 as PlayerId);

      expect(player1).toBeDefined();
      expect(player2).toBeDefined();
      expect(player1?.name).toBe('Test Player 1');
      expect(player2?.name).toBe('Test Player 2');
    });

    test('应该正确创建英雄', () => {
      const player1 = game.getPlayer(1 as PlayerId);
      expect(player1?.hero).toBeDefined();
      expect(player1?.hero.health).toBe(30);
      expect(player1?.hero.maxHealth).toBe(30);
    });

    test('应该正确创建英雄技能', () => {
      const player1 = game.getPlayer(1 as PlayerId);
      expect(player1?.heroPower).toBeDefined();
      expect(player1?.heroPower.cost).toBe(2);
    });

    test('应该正确创建牌库', () => {
      const player1 = game.getPlayer(1 as PlayerId);
      expect(player1?.deck).toBeDefined();
      expect(player1?.deck.length).toBe(30);
    });

    test('应该正确设置初始状态', () => {
      expect(game.state).toBe('WAITING');
      expect(game.currentPlayer).toBe(1);
      expect(game.isRunning()).toBe(false);
      expect(game.isComplete()).toBe(false);
    });
  });

  describe('游戏状态管理', () => {
    test('应该正确开始游戏', () => {
      game.start();
      expect(game.state).toBe('RUNNING');
      expect(game.isRunning()).toBe(true);
    });

    test('应该正确结束游戏', () => {
      game.start();
      game.end(1 as PlayerId);

      expect(game.state).toBe('COMPLETE');
      expect(game.isComplete()).toBe(true);
      expect(game.endTime).toBeDefined();
    });

    test('应该正确切换当前玩家', () => {
      game.setCurrentPlayer(2 as PlayerId);
      expect(game.currentPlayer).toBe(2);
      expect(game.getCurrentPlayer().controller).toBe(2);
      expect(game.getOpponentPlayer().controller).toBe(1);
    });
  });

  describe('实体管理', () => {
    test('应该正确获取玩家实体', () => {
      const player1 = game.getPlayer(1 as PlayerId);
      expect(player1).toBeDefined();
      expect(player1?.controller).toBe(1);
    });

    test('应该正确获取实体', () => {
      const player1 = game.getPlayer(1 as PlayerId);
      const hero = player1?.hero;

      if (hero) {
        const retrievedEntity = game.getEntity(hero.id);
        expect(retrievedEntity).toBeDefined();
        expect(retrievedEntity?.id).toBe(hero.id);
      }
    });

    test('应该正确获取所有实体', () => {
      const allEntities = game.getAllEntities();
      expect(allEntities.length).toBeGreaterThan(0);

      // 应该包含游戏实体、玩家实体、英雄、英雄技能、卡牌等
      expect(allEntities.some(e => e.type === 'GAME')).toBe(true);
      expect(allEntities.some(e => e.type === 'PLAYER')).toBe(true);
      expect(allEntities.some(e => e.type === 'HERO')).toBe(true);
      expect(allEntities.some(e => e.type === 'HERO_POWER')).toBe(true);
      expect(allEntities.some(e => e.type === 'CARD')).toBe(true);
    });

    test('应该正确获取玩家实体列表', () => {
      const player1Entities = game.getPlayerEntities(1 as PlayerId);
      expect(player1Entities.length).toBeGreaterThan(0);

      // 所有实体应该属于玩家1
      player1Entities.forEach(entity => {
        expect(entity.controller).toBe(1);
      });
    });
  });

  describe('系统组件', () => {
    test('应该提供实体管理器', () => {
      const entityManager = game.getEntityManager();
      expect(entityManager).toBeDefined();
      expect(typeof entityManager.getEntityCount).toBe('function');
    });

    test('应该提供事件管理器', () => {
      const eventManager = game.getEventManager();
      expect(eventManager).toBeDefined();
      expect(typeof eventManager.triggerEvent).toBe('function');
    });

    test('应该提供区域管理器', () => {
      const zoneManager = game.getZoneManager();
      expect(zoneManager).toBeDefined();
      expect(typeof zoneManager.getZoneEntities).toBe('function');
    });

    test('应该提供序列管理器', () => {
      const sequenceManager = game.getSequenceManager();
      expect(sequenceManager).toBeDefined();
      expect(typeof sequenceManager.getNextSequenceId).toBe('function');
    });
  });

  describe('JSON序列化', () => {
    test('应该正确序列化为JSON', () => {
      const json = game.toJSON();

      expect(json.id).toBeDefined();
      expect(json.gameEntity).toBeDefined();
      expect(json.players).toBeDefined();
      expect(json.players.length).toBe(2);
      expect(json.currentPlayer).toBe(1);
      expect(json.state).toBe('WAITING');
      expect(json.startTime).toBeGreaterThan(0);
    });

    test('应该包含完整的玩家信息', () => {
      const json = game.toJSON();
      const player1 = json.players[0];

      expect(player1.name).toBe('Test Player 1');
      expect(player1.hero).toBeDefined();
      expect(player1.heroPower).toBeDefined();
      expect(player1.deck).toBeDefined();
      expect(player1.deck.length).toBe(30);
    });
  });

  describe('边界条件', () => {
    test('获取不存在的玩家应该返回null', () => {
      const nonExistentPlayer = game.getPlayer(3 as PlayerId);
      expect(nonExistentPlayer).toBeNull();
    });

    test('获取不存在的实体应该返回null', () => {
      const nonExistentEntity = game.getEntity(99999);
      expect(nonExistentEntity).toBeNull();
    });
  });
});
