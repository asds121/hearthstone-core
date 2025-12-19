import { EventManager } from '../systems/event/EventManager';
import { SimpleTrigger } from '../core/events/BaseTrigger';
import { IGameEvent } from '../core/events/IGameEvent';
import { EventType, TriggerPriority } from '../types';
import { BaseEntity } from '../core/entities/BaseEntity';
import { EntityType } from '../types';

// 测试用实体
class TestEntity extends BaseEntity {
  constructor(id: number) {
    super(id, EntityType.MINION);
  }
}

describe('EventManager', () => {
  let eventManager: EventManager;
  let testEntity: TestEntity;

  beforeEach(() => {
    eventManager = new EventManager();
    testEntity = new TestEntity(1);
  });

  describe('事件触发', () => {
    test('应该正确触发事件', () => {
      const event: IGameEvent = {
        type: EventType.DAMAGE,
        source: testEntity,
        targets: [testEntity],
        timestamp: Date.now(),
        data: { amount: 3 },
      };

      let eventTriggered = false;
      eventManager.on(EventType.DAMAGE, () => {
        eventTriggered = true;
      });

      eventManager.triggerEvent(event);
      expect(eventTriggered).toBe(true);
    });

    test('应该正确批量触发事件', () => {
      const events: IGameEvent[] = [
        {
          type: EventType.DAMAGE,
          source: testEntity,
          targets: [testEntity],
          timestamp: Date.now(),
          data: { amount: 3 },
        },
        {
          type: EventType.HEAL,
          source: testEntity,
          targets: [testEntity],
          timestamp: Date.now(),
          data: { amount: 2 },
        },
      ];

      let damageTriggered = false;
      let healTriggered = false;

      eventManager.on(EventType.DAMAGE, () => {
        damageTriggered = true;
      });
      eventManager.on(EventType.HEAL, () => {
        healTriggered = true;
      });

      eventManager.triggerEvents(events);
      expect(damageTriggered).toBe(true);
      expect(healTriggered).toBe(true);
    });
  });

  describe('扳机管理', () => {
    test('应该正确注册和执行扳机', () => {
      let triggerExecuted = false;

      const trigger = new SimpleTrigger(testEntity, EventType.DAMAGE, () => {
        triggerExecuted = true;
      });

      eventManager.registerTrigger(trigger);

      const event: IGameEvent = {
        type: EventType.DAMAGE,
        source: testEntity,
        targets: [testEntity],
        timestamp: Date.now(),
      };

      eventManager.triggerEvent(event);
      expect(triggerExecuted).toBe(true);
    });

    test('应该正确按优先级排序扳机', () => {
      const executionOrder: string[] = [];

      const highPriorityTrigger = new SimpleTrigger(
        testEntity,
        EventType.DAMAGE,
        () => {
          executionOrder.push('high');
        },
        undefined,
        TriggerPriority.HIGH
      );

      const normalPriorityTrigger = new SimpleTrigger(
        testEntity,
        EventType.DAMAGE,
        () => {
          executionOrder.push('normal');
        },
        undefined,
        TriggerPriority.NORMAL
      );

      const lowPriorityTrigger = new SimpleTrigger(
        testEntity,
        EventType.DAMAGE,
        () => {
          executionOrder.push('low');
        },
        undefined,
        TriggerPriority.LOW
      );

      eventManager.registerTrigger(normalPriorityTrigger);
      eventManager.registerTrigger(highPriorityTrigger);
      eventManager.registerTrigger(lowPriorityTrigger);

      const event: IGameEvent = {
        type: EventType.DAMAGE,
        source: testEntity,
        targets: [testEntity],
        timestamp: Date.now(),
      };

      eventManager.triggerEvent(event);

      expect(executionOrder).toEqual(['high', 'normal', 'low']);
    });

    test('应该正确注销扳机', () => {
      let triggerExecuted = false;

      const trigger = new SimpleTrigger(testEntity, EventType.DAMAGE, () => {
        triggerExecuted = true;
      });

      eventManager.registerTrigger(trigger);
      eventManager.unregisterTrigger(trigger.id);

      const event: IGameEvent = {
        type: EventType.DAMAGE,
        source: testEntity,
        targets: [testEntity],
        timestamp: Date.now(),
      };

      eventManager.triggerEvent(event);
      expect(triggerExecuted).toBe(false);
    });
  });

  describe('事件处理', () => {
    test('应该正确处理嵌套事件', () => {
      let nestedEventTriggered = false;

      const trigger = new SimpleTrigger(testEntity, EventType.DAMAGE, () => {
        // 触发嵌套事件
        const nestedEvent: IGameEvent = {
          type: EventType.HEAL,
          source: testEntity,
          targets: [testEntity],
          timestamp: Date.now(),
        };
        return [nestedEvent];
      });

      const healTrigger = new SimpleTrigger(testEntity, EventType.HEAL, () => {
        nestedEventTriggered = true;
      });

      eventManager.registerTrigger(trigger);
      eventManager.registerTrigger(healTrigger);

      const event: IGameEvent = {
        type: EventType.DAMAGE,
        source: testEntity,
        targets: [testEntity],
        timestamp: Date.now(),
      };

      eventManager.triggerEvent(event);
      expect(nestedEventTriggered).toBe(true);
    });

    test.skip('应该防止无限递归', () => {
      let executionCount = 0;

      const trigger = new SimpleTrigger(testEntity, EventType.DAMAGE, () => {
        executionCount++;
        // 创建一个会无限触发的事件链
        const newEvent: IGameEvent = {
          type: EventType.DAMAGE,
          source: testEntity,
          targets: [testEntity],
          timestamp: Date.now(),
        };
        return [newEvent];
      });

      eventManager.registerTrigger(trigger);

      const event: IGameEvent = {
        type: EventType.DAMAGE,
        source: testEntity,
        targets: [testEntity],
        timestamp: Date.now(),
      };

      // 应该限制递归深度
      eventManager.triggerEvent(event);

      // 验证执行次数有限制
      expect(executionCount).toBeLessThanOrEqual(100);
    });
  });

  describe('条件扳机', () => {
    test('应该只在条件满足时触发', () => {
      let conditionMet = false;
      let conditionNotMet = false;

      const conditionTrigger = new SimpleTrigger(
        testEntity,
        EventType.DAMAGE,
        () => {
          conditionMet = true;
        },
        (event: IGameEvent) => {
          return event.data?.amount > 5;
        }
      );

      const noConditionTrigger = new SimpleTrigger(testEntity, EventType.DAMAGE, () => {
        conditionNotMet = true;
      });

      eventManager.registerTrigger(conditionTrigger);
      eventManager.registerTrigger(noConditionTrigger);

      // 触发条件不满足的事件
      const event1: IGameEvent = {
        type: EventType.DAMAGE,
        source: testEntity,
        targets: [testEntity],
        timestamp: Date.now(),
        data: { amount: 3 },
      };

      eventManager.triggerEvent(event1);
      expect(conditionMet).toBe(false);
      expect(conditionNotMet).toBe(true);

      // 重置状态
      conditionMet = false;
      conditionNotMet = false;

      // 触发条件满足的事件
      const event2: IGameEvent = {
        type: EventType.DAMAGE,
        source: testEntity,
        targets: [testEntity],
        timestamp: Date.now(),
        data: { amount: 8 },
      };

      eventManager.triggerEvent(event2);
      expect(conditionMet).toBe(true);
      expect(conditionNotMet).toBe(true);
    });
  });

  describe('一次性扳机', () => {
    test('应该只触发一次', () => {
      let triggerCount = 0;

      const oneTimeTrigger = new SimpleTrigger(
        testEntity,
        EventType.DAMAGE,
        () => {
          triggerCount++;
        },
        undefined,
        TriggerPriority.NORMAL,
        true // 一次性扳机
      );

      eventManager.registerTrigger(oneTimeTrigger);

      const event: IGameEvent = {
        type: EventType.DAMAGE,
        source: testEntity,
        targets: [testEntity],
        timestamp: Date.now(),
      };

      // 第一次触发
      eventManager.triggerEvent(event);
      expect(triggerCount).toBe(1);

      // 第二次触发（应该不执行）
      eventManager.triggerEvent(event);
      expect(triggerCount).toBe(1);
    });
  });
});
