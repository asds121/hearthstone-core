import { BaseEntity } from '../core/entities/BaseEntity';
import { EntityType } from '../types';
import { TagType } from '../types';

// 测试用实体类
class TestEntity extends BaseEntity {
  constructor(id: number) {
    super(id, EntityType.MINION);
  }
}

describe('BaseEntity', () => {
  let entity: BaseEntity;

  beforeEach(() => {
    entity = new TestEntity(1);
  });

  describe('标签管理', () => {
    test('应该正确设置和获取标签', () => {
      entity.setTag(TagType.ATK, 3);
      expect(entity.getTag(TagType.ATK)).toBe(3);
      expect(entity.hasTag(TagType.ATK)).toBe(true);
    });

    test('应该正确移除标签', () => {
      entity.setTag(TagType.ATK, 3);
      entity.removeTag(TagType.ATK);
      expect(entity.hasTag(TagType.ATK)).toBe(false);
      expect(entity.getTag(TagType.ATK)).toBeUndefined();
    });

    test('设置标签时应该更新时间戳', () => {
      const beforeTime = entity.updatedAt;
      // 等待一小段时间确保时间戳会变化
      const startTime = Date.now();
      while (Date.now() === startTime) {
        // 等待毫秒变化
      }
      entity.setTag(TagType.ATK, 3);
      expect(entity.updatedAt).toBeGreaterThan(beforeTime);
    });
  });

  describe('克隆', () => {
    test('浅拷贝应该复制基本属性', () => {
      entity.setTag(TagType.ATK, 3);
      const cloned = entity.clone();

      expect(cloned.id).toBe(entity.id);
      expect(cloned.type).toBe(entity.type);
      expect(cloned.getTag(TagType.ATK)).toBe(3);
    });

    test('深拷贝应该创建独立的对象', () => {
      entity.setTag(TagType.ATK, 3);
      const deepCloned = entity.deepClone();

      deepCloned.setTag(TagType.ATK, 5);

      expect(entity.getTag(TagType.ATK)).toBe(3);
      expect(deepCloned.getTag(TagType.ATK)).toBe(5);
    });
  });

  describe('JSON序列化', () => {
    test('应该正确序列化为JSON', () => {
      entity.setTag(TagType.ATK, 3);
      entity.setTag(TagType.HEALTH, 2);

      const json = entity.toJSON();

      expect(json.id).toBe(1);
      expect(json.type).toBe('MINION');
      expect(json.tags.ATK).toBe(3);
      expect(json.tags.HEALTH).toBe(2);
    });

    test('应该正确从JSON反序列化', () => {
      const json = {
        id: 1,
        type: 'MINION',
        zone: 'DECK',
        zonePosition: 5,
        controller: 1,
        owner: 1,
        tags: { ATK: 3, HEALTH: 2 },
        enchantments: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      entity.fromJSON(json);

      expect(entity.zone).toBe('DECK');
      expect(entity.zonePosition).toBe(5);
      expect(entity.getTag('ATK' as TagType)).toBe(3);
      expect(entity.getTag('HEALTH' as TagType)).toBe(2);
    });
  });
});
