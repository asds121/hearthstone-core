const { Game } = require('../dist/index');

// 创建一个基础的游戏配置
const gameConfig = {
  player1: {
    id: 'player1',
    name: 'Alice',
    heroClass: 'MAGE',
    deck: [
      { id: 'card1', name: 'Arcane Missiles', cost: 1, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card2', name: 'Mirror Image', cost: 1, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card3', name: 'Mana Wyrm', cost: 1, type: 'MINION', attack: 1, health: 3, race: 'BEAST' },
      { id: 'card4', name: 'Sorcerer\'s Apprentice', cost: 2, type: 'MINION', attack: 3, health: 2 },
      { id: 'card5', name: 'Arcane Intellect', cost: 3, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card6', name: 'Fireball', cost: 4, type: 'SPELL', spellSchool: 'FIRE' },
      { id: 'card7', name: 'Polymorph', cost: 4, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card8', name: 'Water Elemental', cost: 4, type: 'MINION', attack: 3, health: 6, race: 'ELEMENTAL' },
      { id: 'card9', name: 'Azure Drake', cost: 5, type: 'MINION', attack: 4, health: 4, race: 'DRAGON' },
      { id: 'card10', name: 'Flamestrike', cost: 7, type: 'SPELL', spellSchool: 'FIRE' },
      // 重复卡牌以达到30张
      { id: 'card11', name: 'Arcane Missiles', cost: 1, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card12', name: 'Mirror Image', cost: 1, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card13', name: 'Mana Wyrm', cost: 1, type: 'MINION', attack: 1, health: 3, race: 'BEAST' },
      { id: 'card14', name: 'Sorcerer\'s Apprentice', cost: 2, type: 'MINION', attack: 3, health: 2 },
      { id: 'card15', name: 'Arcane Intellect', cost: 3, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card16', name: 'Fireball', cost: 4, type: 'SPELL', spellSchool: 'FIRE' },
      { id: 'card17', name: 'Polymorph', cost: 4, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card18', name: 'Water Elemental', cost: 4, type: 'MINION', attack: 3, health: 6, race: 'ELEMENTAL' },
      { id: 'card19', name: 'Azure Drake', cost: 5, type: 'MINION', attack: 4, health: 4, race: 'DRAGON' },
      { id: 'card20', name: 'Flamestrike', cost: 7, type: 'SPELL', spellSchool: 'FIRE' },
      { id: 'card21', name: 'Arcane Missiles', cost: 1, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card22', name: 'Mirror Image', cost: 1, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card23', name: 'Mana Wyrm', cost: 1, type: 'MINION', attack: 1, health: 3, race: 'BEAST' },
      { id: 'card24', name: 'Sorcerer\'s Apprentice', cost: 2, type: 'MINION', attack: 3, health: 2 },
      { id: 'card25', name: 'Arcane Intellect', cost: 3, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card26', name: 'Fireball', cost: 4, type: 'SPELL', spellSchool: 'FIRE' },
      { id: 'card27', name: 'Polymorph', cost: 4, type: 'SPELL', spellSchool: 'ARCANE' },
      { id: 'card28', name: 'Water Elemental', cost: 4, type: 'MINION', attack: 3, health: 6, race: 'ELEMENTAL' },
      { id: 'card29', name: 'Azure Drake', cost: 5, type: 'MINION', attack: 4, health: 4, race: 'DRAGON' },
      { id: 'card30', name: 'Flamestrike', cost: 7, type: 'SPELL', spellSchool: 'FIRE' }
    ]
  },
  player2: {
    id: 'player2',
    name: 'Bob',
    heroClass: 'WARRIOR',
    deck: [
      { id: 'card31', name: 'Whirlwind', cost: 1, type: 'SPELL', spellSchool: 'PHYSICAL' },
      { id: 'card32', name: 'Shield Block', cost: 3, type: 'SPELL', spellSchool: 'PHYSICAL' },
      { id: 'card33', name: 'Fiery War Axe', cost: 3, type: 'WEAPON', attack: 2, durability: 2 },
      { id: 'card34', name: 'Warsong Commander', cost: 3, type: 'MINION', attack: 2, health: 3 },
      { id: 'card35', name: 'Kor\'kron Elite', cost: 4, type: 'MINION', attack: 4, health: 3 },
      { id: 'card36', name: 'Arcanite Reaper', cost: 5, type: 'WEAPON', attack: 5, durability: 2 },
      { id: 'card37', name: 'Grommash Hellscream', cost: 8, type: 'MINION', attack: 4, health: 9, race: 'ORC' },
      // 重复卡牌以达到30张
      { id: 'card38', name: 'Whirlwind', cost: 1, type: 'SPELL', spellSchool: 'PHYSICAL' },
      { id: 'card39', name: 'Shield Block', cost: 3, type: 'SPELL', spellSchool: 'PHYSICAL' },
      { id: 'card40', name: 'Fiery War Axe', cost: 3, type: 'WEAPON', attack: 2, durability: 2 },
      { id: 'card41', name: 'Warsong Commander', cost: 3, type: 'MINION', attack: 2, health: 3 },
      { id: 'card42', name: 'Kor\'kron Elite', cost: 4, type: 'MINION', attack: 4, health: 3 },
      { id: 'card43', name: 'Arcanite Reaper', cost: 5, type: 'WEAPON', attack: 5, durability: 2 },
      { id: 'card44', name: 'Grommash Hellscream', cost: 8, type: 'MINION', attack: 4, health: 9, race: 'ORC' },
      { id: 'card45', name: 'Whirlwind', cost: 1, type: 'SPELL', spellSchool: 'PHYSICAL' },
      { id: 'card46', name: 'Shield Block', cost: 3, type: 'SPELL', spellSchool: 'PHYSICAL' },
      { id: 'card47', name: 'Fiery War Axe', cost: 3, type: 'WEAPON', attack: 2, durability: 2 },
      { id: 'card48', name: 'Warsong Commander', cost: 3, type: 'MINION', attack: 2, health: 3 },
      { id: 'card49', name: 'Kor\'kron Elite', cost: 4, type: 'MINION', attack: 4, health: 3 },
      { id: 'card50', name: 'Arcanite Reaper', cost: 5, type: 'WEAPON', attack: 5, durability: 2 },
      { id: 'card51', name: 'Grommash Hellscream', cost: 8, type: 'MINION', attack: 4, health: 9, race: 'ORC' },
      { id: 'card52', name: 'Whirlwind', cost: 1, type: 'SPELL', spellSchool: 'PHYSICAL' },
      { id: 'card53', name: 'Shield Block', cost: 3, type: 'SPELL', spellSchool: 'PHYSICAL' },
      { id: 'card54', name: 'Fiery War Axe', cost: 3, type: 'WEAPON', attack: 2, durability: 2 },
      { id: 'card55', name: 'Warsong Commander', cost: 3, type: 'MINION', attack: 2, health: 3 },
      { id: 'card56', name: 'Kor\'kron Elite', cost: 4, type: 'MINION', attack: 4, health: 3 },
      { id: 'card57', name: 'Arcanite Reaper', cost: 5, type: 'WEAPON', attack: 5, durability: 2 },
      { id: 'card58', name: 'Grommash Hellscream', cost: 8, type: 'MINION', attack: 4, health: 9, race: 'ORC' },
      { id: 'card59', name: 'Whirlwind', cost: 1, type: 'SPELL', spellSchool: 'PHYSICAL' },
      { id: 'card60', name: 'Shield Block', cost: 3, type: 'SPELL', spellSchool: 'PHYSICAL' }
    ]
  },
  config: {
    maxTurns: 90,
    turnTimeLimit: 75,
    debugMode: true
  }
};

// 创建游戏实例
console.log('Creating new Hearthstone game...');
const game = new Game(gameConfig);

// 监听游戏事件
game.getEventManager().on('event', (event) => {
  console.log(`[${event.timestamp}] Event: ${event.type}`);
  if (event.data) {
    console.log('  Data:', event.data);
  }
});

// 开始游戏
console.log('\nStarting game...');
game.start();

// 获取游戏状态
console.log('\n=== Game State ===');
console.log(`Game ID: ${game.id}`);
console.log(`Current Player: ${game.getCurrentPlayer().name}`);
console.log(`Game State: ${game.state}`);

// 获取玩家信息
const player1 = game.getPlayer(1);
const player2 = game.getPlayer(2);

console.log('\n=== Player 1 Info ===');
console.log(`Name: ${player1.name}`);
console.log(`Hero: ${player1.hero.type}`);
console.log(`Health: ${player1.hero.health}`);
console.log(`Mana: ${player1.mana}/${player1.maxMana}`);
console.log(`Hand Size: ${player1.hand.length}`);
console.log(`Deck Size: ${player1.deck.length}`);

console.log('\n=== Player 2 Info ===');
console.log(`Name: ${player2.name}`);
console.log(`Hero: ${player2.hero.type}`);
console.log(`Health: ${player2.hero.health}`);
console.log(`Mana: ${player2.mana}/${player2.maxMana}`);
console.log(`Hand Size: ${player2.hand.length}`);
console.log(`Deck Size: ${player2.deck.length}`);

// 输出所有实体
console.log('\n=== All Entities ===');
const allEntities = game.getAllEntities();
allEntities.forEach(entity => {
  console.log(`ID: ${entity.id}, Type: ${entity.type}, Controller: ${entity.controller}`);
});

// 模拟一些游戏操作
console.log('\n=== Simulating Game Actions ===');

// 模拟回合开始
game.getEventManager().triggerEvent({
  type: 'TURN_START',
  source: game.getCurrentPlayer(),
  targets: [game.getCurrentPlayer()],
  timestamp: Date.now(),
  data: {
    turn: game.gameEntity.turn,
    player: game.getCurrentPlayer()
  }
});

// 模拟使用卡牌
game.getEventManager().triggerEvent({
  type: 'PLAY_CARD',
  source: game.getCurrentPlayer(),
  targets: [game.getOpponentPlayer()],
  timestamp: Date.now(),
  data: {
    card: game.getCurrentPlayer().hand[0],
    wasPlayed: true,
    target: game.getOpponentPlayer()
  }
});

// 模拟战斗
game.getEventManager().triggerEvent({
  type: 'COMBAT',
  source: game.getCurrentPlayer().hero,
  targets: [game.getOpponentPlayer().hero],
  timestamp: Date.now(),
  data: {
    attacker: game.getCurrentPlayer().hero,
    defender: game.getOpponentPlayer().hero,
    attackerDamage: 0,
    defenderDamage: 0
  }
});

// 模拟回合结束
game.getEventManager().triggerEvent({
  type: 'TURN_END',
  source: game.getCurrentPlayer(),
  targets: [game.getCurrentPlayer()],
  timestamp: Date.now(),
  data: {
    turn: game.gameEntity.turn,
    player: game.getCurrentPlayer()
  }
});

// 输出最终游戏状态
console.log('\n=== Final Game State ===');
console.log(`Turn: ${game.gameEntity.turn}`);
console.log(`Current Player: ${game.getCurrentPlayer().name}`);

// 序列化游戏状态
console.log('\n=== Game JSON ===');
const gameJson = game.toJSON();
console.log(`Game ID: ${gameJson.id}`);
console.log(`Players: ${gameJson.players.length}`);
console.log(`State: ${gameJson.state}`);

// 结束游戏
console.log('\nEnding game...');
game.end(1);

console.log('\nGame completed successfully!');