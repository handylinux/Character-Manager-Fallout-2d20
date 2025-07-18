// Создаёт начальный массив атрибутов с базовыми значениями (4 для каждого)
export function createInitialAttributes() {
  return [
    { name: 'СИЛ', value: 4 },
    { name: 'ВЫН', value: 4 },
    { name: 'ВСП', value: 4 },
    { name: 'ЛОВ', value: 4 },
    { name: 'ИНТ', value: 4 },
    { name: 'ХАР', value: 4 },
    { name: 'УДЧ', value: 4 },
  ];
}

// Вычисляет сколько очков атрибутов осталось распределить
export function getRemainingAttributePoints(attributes, trait) {
  // Допустим, у нас есть 5 дополнительных очков для распределения
  const totalPointsToDistribute = 12;

  // Сначала считаем, сколько очков было вложено пользователем сверх базового значения 4
  const spentByUser = attributes.reduce((sum, attr) => {
    return sum + Math.max(0, attr.value - 4);
  }, 0);

  // Затем вычисляем, сколько из этих "потраченных" очков на самом деле являются бонусом от черты
  let bonusFromTrait = 0;
  if (trait && trait.modifiers && trait.modifiers.attributes) {
    bonusFromTrait = Object.values(trait.modifiers.attributes).reduce((sum, val) => {
      // Учитываем только положительные бонусы, так как только они "тратят" очки в нашей первой калькуляции
      if (val > 0) return sum + val;
      return sum;
    }, 0);
  }
  
  // Реально потраченные очки = то, что вложил пользователь, минус то, что дала черта
  const actualSpentPoints = spentByUser - bonusFromTrait;

  return totalPointsToDistribute - actualSpentPoints;
}

// Максимальные очки навыков зависят от уровня и атрибутов
export function getSkillPoints(attributes, level) {
  // Формула: очки навыков = значение Интеллекта + 9
  // Параметр level сохраняем для обратной совместимости,
  // поскольку он может понадобиться в будущих изменениях.
  const intAttr = attributes.find(attr => attr.name === 'ИНТ')?.value || 0;
  return intAttr + 9;
}

// Считает сколько уже потрачено очков на выбранные навыки
export function calculateSkillPointsUsed(skills, selectedSkills) {
  let total = 0;
  for (const skill of skills) {
    const isTagged = selectedSkills.includes(skill.name);
    
    // Для отмеченных (tagged) навыков первые 2 очка, полученные при отметке,
    // являются бесплатными. Расходуются только те, что вложены сверх.
    // Для неотмеченных навыков базовое значение 0, и все очки расходуются.
    const baseValue = isTagged ? 2 : 0;
    
    // Если у отмеченного навыка значение меньше или равно 2,
    // значит, в него еще не вкладывали очков из пула.
    const spentPoints = Math.max(0, skill.value - baseValue);
    total += spentPoints;
  }
  return total;
}

// Расчёт очков удачи по атрибутам
export function getLuckPoints(attributes) {
  // Очки удачи равны значению атрибута УДЧ
  const luckAttr = attributes.find(attr => attr.name === 'УДЧ')?.value;
  return luckAttr ?? 0;
}

// Максимальное количество выбираемых навыков, зависит от trait (черты)
export function getMaxSelectableSkills(trait) {
  if (!trait) return 3; // стандартное значение
  const baseSkills = 3;
  // Модификатор теперь находится во вложенном объекте
  const extraSkills = trait.modifiers?.extraSkills || 0;
  return baseSkills + extraSkills;
}

// Проверка границ атрибутов с учётом trait (minLimits и maxLimits)
export function canChangeAttribute(value, attrName, delta, trait) {
    const nextValue = value + delta;
    const { min, max } = getAttributeLimits(trait, attrName);
    return nextValue >= min && nextValue <= max;
}

// Проверка максимума навыка с учетом trait.skillMaxValue
export function canChangeSkillValue(currentValue, delta, trait, level, isTagged) {
  const nextValue = currentValue + delta;
  const minValue = isTagged ? 2 : 0;
  if (nextValue < minValue) return false;

  // Модификатор теперь находится во вложенном объекте
  let maxRank = trait?.modifiers?.skillMaxValue ?? 6;
  // На 1-м уровне максимальный ранг не может быть выше 3.
  if (level === 1) {
    maxRank = Math.min(maxRank, 3);
  }
  return nextValue <= maxRank;
}

export const BASE_MIN_ATTRIBUTE = 4;
export const BASE_MAX_ATTRIBUTE = 10;
export const BASE_TAGGED_SKILLS = 3;

// Экспортируем имена, которые используют другие модули
// для совместимости с существующим кодом AttributesSection.
export const MIN_ATTRIBUTE = BASE_MIN_ATTRIBUTE;
export const MAX_ATTRIBUTE = BASE_MAX_ATTRIBUTE;

// Универсальная функция для получения лимитов атрибутов
export const getAttributeLimits = (trait, attrName) => {
    return {
        // Модификаторы теперь находятся во вложенном объекте
        min: trait?.modifiers?.minLimits?.[attrName] ?? BASE_MIN_ATTRIBUTE,
        max: trait?.modifiers?.maxLimits?.[attrName] ?? BASE_MAX_ATTRIBUTE
    };
};

// Универсальная проверка навыков
export const validateSkills = (skills, trait) => {
  // Модификатор теперь находится во вложенном объекте
  const maxRank = trait?.modifiers?.skillMaxValue ?? 6; // 6 - дефолтный максимум
  
  return {
    isValid: skills.every(s => s.value <= maxRank),
    maxRank
  };
};

export const isMultiTraitOrigin = (originName) => {
  const multiTraitOrigins = ['Житель НКР', 'Выживший', 'Дикарь'];
  return multiTraitOrigins.includes(originName);
};

export const ALL_SKILLS = [
  { name: 'Атлетика', value: 0 },
  { name: 'Бартер', value: 0 },
  { name: 'Тяжелое оружие', value: 0 },
  { name: 'Энергооружие', value: 0 },
  { name: 'Взрывчатка', value: 0 },
  { name: 'Отмычки', value: 0 },
  { name: 'Медицина', value: 0 },
  { name: 'Ближний бой', value: 0 },
  { name: 'Управление ТС', value: 0 },
  { name: 'Ремонт', value: 0 },
  { name: 'Наука', value: 0 },
  { name: 'Стрелковое оружие', value: 0 },
  { name: 'Скрытность', value: 0 },
  { name: 'Красноречие', value: 0 },
  { name: 'Выживание', value: 0 },
  { name: 'Метание', value: 0 },
  { name: 'Рукопашная', value: 0 }
];