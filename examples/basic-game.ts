import { Game, EntityManager, EventManager, IEntity, EntityType, EventType } from '../src/index';

// 创建游戏配置接口
interface CardData {
  id: string;
  name: string;
  cost: number;
  type: EntityType;
  attack?: number;
  health?: number;
  durability?: number;
  spellSchool?: string;
  race?: string;
}

interface PlayerData {
  id: string;
  name: string;
  heroClass: string;
  deck: CardData[];
}

interface GameConfig {
  player1: PlayerData;
  player2: PlayerData;
  config?: {
    maxTurns?: number;
    turnTimeLimit?: number;
    debugMode?: boolean;
  };
}

// 创建游戏配置
const gameConfig: GameConfig = {
  player1: {
    id: 'player1',
    name: 'Alice',
    heroClass: 'MAGE',
    deck: [
      { id: 'card1', name: 'Arcane Missiles', cost: 1, type: EntityType.SPELL, spellSchool: 'ARCANE' },
      { id: 'card2', name: 'Mirror Image', cost: 1, type: EntityType.SPELL, spellSchool: 'ARCANE' },
      { id: 'card3', name: 'Mana Wyrm', cost: 1, type: EntityType.MINION, attack: 1, health: 3, race: 'BEAST' },
      { id: 'card4', name: 'Sorcerer\'s Apprentice', cost: 2, type: EntityType.MINION, attack: 3, health: 2 },
      { id: 'card5', name: 'Arcane Intellect', cost: 3, type: EntityType.SPELL, spellSchool: 'ARCANE' },
      // 重复卡牌以达到30张
      ...Array(25).fill({ id: 'card6', name: 'Fireball', cost: 4, type: EntityType.SPELL, spellSchool: 'FIRE' })
    ]
  },
  player2: {
    id: 'player2',
    name: 'Bob',
    heroClass: 'WARRIOR',
    deck: [
      { id: 'card31', name: 'Whirlwind', cost: 1, type: EntityType.SPELL, spellSchool: 'PHYSICAL' },
      { id: 'card32', name: 'Shield Block', cost: 3, type: EntityType.SPELL, spellSchool: 'PHYSICAL' },
      { id: 'card33', name: 'Fiery War Axe', cost: 3, type: EntityType.WEAPON, attack: 2, durability: 2 },
      { id: 'card34', name: 'Warsong Commander', cost: 3, type: EntityType.MINION, attack: 2, health: 3 },
      { id: 'card35', name: 'Kor\'kron Elite', cost: 4, type: EntityType.MINION, attack: 4, health: 3 },
      // 重复卡牌以达到30张
      ...Array(25).fill({ id: 'card36', name: 'Arcanite Reaper', cost: 5, type: EntityType.WEAPON, attack: 5, durability: 2 })
    ]
  },
  config: {
    maxTurns: 90,
    turnTimeLimit: 75,
    debugMode: true
  }
};

// 主函数
async function runBasicGame(): Promise<void> {
  console.log('🎮 Creating new Hearthstone game...');
  
  // 创建游戏实例
  const game = new Game(gameConfig);
  
  // 设置事件监听
  game.getEventManager().on('event', (event) => {
    console.log(`[${new Date(event.timestamp).toISOString()}] 📢 Event: ${event.type}`);
    if (event.data) {
      console.log('   📊 Data:', JSON.stringify(event.data, null, 2));
    }
  });
  
  // 开始游戏
  console.log('\n🚀 Starting game...');
  game.start();
  
  // 显示游戏状态
  displayGameState(game);
  
  // 模拟游戏流程
  await simulateGameFlow(game);
  
  // 结束游戏
  console.log('\n🏁 Ending game...');
  game.end(1);
  
  console.log('\n✅ Game completed successfully!');
}

// 显示游戏状态
function displayGameState(game: Game): void {
  const player1 = game.getPlayer(1);
  const player2 = game.getPlayer(2);
  
  console.log('\n📊 === Game State ===');
  console.log(`🎮 Game ID: ${game.id}`);
  console.log(`🔄 Turn: ${game.gameEntity.turn}`);
  console.log(`👤 Current Player: ${game.getCurrentPlayer().name}`);
  console.log(`📈 Game State: ${game.state}`);
  
  console.log('\n👤 === Player 1 (Alice) ===');
  console.log(`🏆 Name: ${player1.name}`);
  console.log(`⚔️  Hero: ${player1.hero.type}`);
  console.log(`❤️  Health: ${player1.hero.health}`);
  console.log(`💎 Mana: ${player1.mana}/${player1.maxMana}`);
  console.log(`🃏 Hand Size: ${player1.hand.length}`);
  console.log(`📚 Deck Size: ${player1.deck.length}`);
  console.log(`💀 Graveyard Size: ${player1.graveyard.length}`);
  
  console.log('\n👤 === Player 2 (Bob) ===');
  console.log(`🏆 Name: ${player2.name}`);
  console.log(`⚔️  Hero: ${player2.hero.type}`);
  console.log(`❤️  Health: ${player2.hero.health}`);
  console.log(`💎 Mana: ${player2.mana}/${player2.maxMana}`);
  console.log(`🃏 Hand Size: ${player2.hand.length}`);
  console.log(`📚 Deck Size: ${player2.deck.length}`);
  console.log(`💀 Graveyard Size: ${player2.graveyard.length}`);
}

// 模拟游戏流程
async function simulateGameFlow(game: Game): Promise<void> {
  console.log('\n🎮 === Simulating Game Flow ===');
  
  // 模拟回合1
  console.log('\n🔄 --- Turn 1 ---');
  await simulateTurn(game, 1);
  
  // 模拟回合2
  console.log('\n🔄 --- Turn 2 ---');
  await simulateTurn(game, 2);
  
  // 模拟回合3
  console.log('\n🔄 --- Turn 3 ---');
  await simulateTurn(game, 3);
}

// 模拟单个回合
async function simulateTurn(game: Game, turnNumber: number): Promise<void> {
  const currentPlayer = game.getCurrentPlayer();
  const opponent = game.getOpponentPlayer();
  
  // 回合开始事件
  game.getEventManager().triggerEvent({
    type: EventType.TURN_START,
    source: currentPlayer,
    targets: [currentPlayer],
    timestamp: Date.now(),
    data: {
      turn: turnNumber,
      player: currentPlayer
    }
  });
  
  // 根据回合数执行不同操作
  switch (turnNumber) {
    case 1:
      // 第一回合：使用英雄技能
      console.log(`${currentPlayer.name} uses Hero Power`);
      game.getEventManager().triggerEvent({
        type: EventType.PLAY_CARD,
        source: currentPlayer,
        targets: [opponent.hero],
        timestamp: Date.now(),
        data: {
          card: currentPlayer.heroPower,
          wasPlayed: true,
          target: opponent.hero
        }
      });
      break;
      
    case 2:
      // 第二回合：抽牌并使用随从
      console.log(`${currentPlayer.name} plays a minion`);
      const minion = currentPlayer.hand.find(card => card.type === EntityType.MINION);
      if (minion) {
        game.getEventManager().triggerEvent({
          type: EventType.PLAY_CARD,
          source: currentPlayer,
          targets: [minion],
          timestamp: Date.now(),
          data: {
            card: minion,
            wasPlayed: true,
            position: 0
          }
        });
        
        game.getEventManager().triggerEvent({
          type: EventType.SUMMON,
          source: currentPlayer,
          targets: [minion],
          timestamp: Date.now(),
          data: {
            isPlayed: true,
            position: 0
          }
        });
      }
      break;
      
    case 3:
      // 第三回合：随从攻击
      console.log(`${currentPlayer.name}'s minion attacks opponent`);
      const attacker = currentPlayer.minions[0] || currentPlayer.hero;
      game.getEventManager().triggerEvent({
        type: EventType.COMBAT,
        source: attacker,
        targets: [opponent.hero],
        timestamp: Date.now(),
        data: {
          attacker: attacker,
          defender: opponent.hero,
          attackerDamage: 0,
          defenderDamage: attacker.getTag('ATK') || 0
        }
      });
      
      // 造成伤害
      game.getEventManager().triggerEvent({
        type: EventType.DAMAGE,
        source: attacker,
        targets: [opponent.hero],
        timestamp: Date.now(),
        data: {
          amount: attacker.getTag('ATK') || 0,
          isSpellDamage: false,
          isCombatDamage: true
        }
      });
      break;
  }
  
  // 回合结束事件
  game.getEventManager().triggerEvent({
    type: EventType.TURN_END,
    source: currentPlayer,
    targets: [currentPlayer],
    timestamp: Date.now(),
    data: {
      turn: turnNumber,
      player: currentPlayer
    }
  });
  
  // 等待一小段时间
  await new Promise(resolve => setTimeout(resolve, 100));
}

// 运行示例
if (require.main === module) {
  runBasicGame()
    .then(() => {
      console.log('\n🎉 Basic game example completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error running basic game example:', error);
      process.exit(1);
    });
}

export { runBasicGame };