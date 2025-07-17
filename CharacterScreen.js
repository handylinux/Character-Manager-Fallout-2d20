import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ImageBackground, Pressable, SafeAreaView, StatusBar, Modal, Alert, Platform
} from 'react-native';
import OriginModal from './OriginModal';
import TraitSkillModal from './TraitSkillModal';
import { ORIGINS } from './originsData';
import { TRAITS } from './traitsData';
import { getTraitModalComponent, getTraitConfig } from './components/modals/index';
import {
  createInitialAttributes,
  getRemainingAttributePoints,
  getSkillPoints,
  calculateSkillPointsUsed,
  getLuckPoints,
  getMaxSelectableSkills,
  canChangeAttribute,
  canChangeSkillValue,
  getAttributeLimits,
  validateSkills
} from './characterLogic';
import { AttributesSection } from './AttributesSection';
import styles from './styles';

const ALL_SKILLS = [
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

const ImageSection = ({ origin }) => {
  const defaultImage = require('./assets/bg1.png');
  return (
    <View style={styles.imageSection}>
      <ImageBackground 
        source={origin ? origin.image : defaultImage}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const ResetConfirmationModal = ({ visible, onCancel, onConfirm }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Внимание!</Text>
        <Text style={styles.modalText}>
          Все значения будут сброшены к изначальным параметрам.
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButton, styles.confirmButton]}
            onPress={onConfirm}
          >
            <Text style={styles.buttonText}>Согласен</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const PressableRow = ({ title, value, onPress }) => (
  <Pressable 
    style={styles.pressableRow} 
    onPress={onPress}
    android_ripple={{ color: '#ddd' }}
  >
    <Text style={styles.pressableTitle}>{title}:</Text>
    <Text style={[
      styles.pressableValue,
      value === 'Не выбрано' && styles.placeholderText
    ]}>
      {value}
    </Text>
  </Pressable>
);

const DerivedRow = ({ title, value }) => (
  <View style={styles.derivedRow}>
    <Text style={styles.derivedTitle}>{title}</Text>
    <Text style={styles.derivedValue}>{value}</Text>
  </View>
);

const SkillRow = ({ 
  name, 
  value, 
  isSelected, 
  isMaxReached,
  isForced,
  onToggle, 
  onIncrease, 
  onDecrease, 
  rowStyle,
  disabled,
  trait
}) => {
  const isForcedSkill = trait?.forcedSkills?.includes(name);
  const isRequiredButNotSelected = isForcedSkill && !isSelected;

  return (
    <View style={[styles.skillRow, rowStyle]}>
      <TouchableOpacity 
        onPress={onToggle} 
        style={styles.skillSelector}
        disabled={disabled || isForced}
      >
        <View style={[
          styles.checkbox, 
          isSelected && styles.checkboxSelected,
          isForced && styles.checkboxForced,
          isRequiredButNotSelected && styles.checkboxRequired
        ]} />
        <Text style={[
          styles.skillName, 
          isSelected && styles.skillNameSelected,
          isForced && styles.skillNameForced,
          isRequiredButNotSelected && styles.skillNameRequired
        ]}>
          {name}
        </Text>
      </TouchableOpacity>
      {!disabled ? (
        <CompactCounter 
          value={value}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          isMaxReached={isMaxReached}
        />
      ) : (
        <Text style={styles.skillValue}>{value}</Text>
      )}
    </View>
  );
};

const CompactCounter = ({ 
  value, 
  onIncrease, 
  onDecrease, 
  isMaxReached,
  increaseDisabled
}) => (
  <View style={styles.compactCounter}>
    <TouchableOpacity 
      onPress={onDecrease} 
      style={[styles.counterButton, value <= 0 && styles.disabledButton]}
      disabled={value <= 0}
    >
      <Text style={[
        styles.counterButtonText,
        value <= 0 && styles.disabledText
      ]}>-</Text>
    </TouchableOpacity>
    <Text style={styles.counterValue}>{value}</Text>
    <TouchableOpacity 
      onPress={onIncrease} 
      style={[styles.counterButton, (isMaxReached || increaseDisabled) && styles.disabledButton]}
      disabled={isMaxReached || increaseDisabled}
    >
      <Text style={[
        styles.counterButtonText,
        (isMaxReached || increaseDisabled) && styles.disabledText
      ]}>+</Text>
    </TouchableOpacity>
  </View>
);

const LuckPointsRow = ({ 
  luckPoints, 
  maxLuckPoints, 
  onSpend, 
  onRestore 
}) => {
  const canSpend = luckPoints > 0;
  const canRestore = luckPoints < maxLuckPoints;

  return (
    <View style={styles.luckRow}>
      <Text style={styles.luckTitle}>Очки{"\n"}Удачи</Text>
      <View style={styles.luckValueContainer}>
        <TouchableOpacity 
          onPress={onSpend} 
          style={[styles.luckButton, !canSpend && styles.disabledLuckButton]}
          disabled={!canSpend}
        >
          <Text style={styles.luckButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.derivedValue}>{`${luckPoints} / ${maxLuckPoints}`}</Text>
        <TouchableOpacity 
          onPress={onRestore} 
          style={[styles.luckButton, !canRestore && styles.disabledLuckButton]}
          disabled={!canRestore}
        >
          <Text style={styles.luckButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function CharacterScreen() {
  const [level, setLevel] = useState(1);
  const [attributes, setAttributes] = useState(createInitialAttributes());
  const [skills, setSkills] = useState(ALL_SKILLS);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [forcedSelectedSkills, setForcedSelectedSkills] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [trait, setTrait] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [effects, setEffects] = useState([]);
  
  const [isOriginModalVisible, setIsOriginModalVisible] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [showTraitSkillModal, setShowTraitSkillModal] = useState(false);
  const [isTraitModalVisible, setIsTraitModalVisible] = useState(false);
  
  const [luckPoints, setLuckPoints] = useState(0);
  const [maxLuckPoints, setMaxLuckPoints] = useState(0);
  
  const [attributesSaved, setAttributesSaved] = useState(false);
  const [skillsSaved, setSkillsSaved] = useState(false);
  
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [resetType, setResetType] = useState(null);

  useEffect(() => {
    const initialLuck = getLuckPoints(attributes);
    setMaxLuckPoints(initialLuck);
    setLuckPoints(initialLuck);
  }, []);

  useEffect(() => {
    const newMaxLuck = getLuckPoints(attributes);
    setMaxLuckPoints(newMaxLuck);
  }, [attributes]);

  useEffect(() => {
    if (attributesSaved) {
      setLuckPoints(maxLuckPoints);
    }
  }, [attributesSaved, maxLuckPoints]);

  const canDistributeSkills = attributesSaved && !skillsSaved;
  const remainingAttributePoints = getRemainingAttributePoints(attributes, trait);
  const skillPointsAvailable = attributesSaved ? getSkillPoints(attributes, level) : 0;
  const skillPointsUsed = calculateSkillPointsUsed(skills, selectedSkills);
  const skillPointsLeft = Math.max(0, skillPointsAvailable - skillPointsUsed);

  const resetCharacter = () => {
    setAttributes(createInitialAttributes());
    setSkills(ALL_SKILLS.map(s => ({...s, value: 0})));
    setSelectedSkills([]);
    setForcedSelectedSkills([]);
    setAttributesSaved(false);
    setSkillsSaved(false);
    const initialLuck = getLuckPoints(createInitialAttributes());
    setMaxLuckPoints(initialLuck);
    setLuckPoints(initialLuck);
    setTrait(null);
    setEquipment(null);
    setEffects([]);
  };

  const handleToggleSkill = (skillName) => {
    if (!canDistributeSkills && !showTraitSkillModal) {
      Alert.alert("Предупреждение", "Сначала распределите и сохраните атрибуты");
      return;
    }

    const isForcedSkill = forcedSelectedSkills.includes(skillName);
    
    if (isForcedSkill && selectedSkills.includes(skillName)) {
      Alert.alert(
        "Ошибка", 
        "Нельзя снять выбор с обязательного навыка"
      );
      return;
    }

    const isCurrentlySelected = selectedSkills.includes(skillName);
    const skillIndex = skills.findIndex(s => s.name === skillName);
    const currentSkill = skills[skillIndex];
    
    const maxSelectable = getMaxSelectableSkills(trait);
    // Модификатор теперь находится во вложенном объекте
    let skillMax = trait?.modifiers?.skillMaxValue ?? 6;
    // Применяем ограничение 1-го уровня
    if (level === 1) {
      skillMax = Math.min(skillMax, 3);
    }

    // Если пытаемся отметить новый навык
    if (!isCurrentlySelected) {
      // Проверяем лимит на количество отмеченных навыков
      if (selectedSkills.length >= maxSelectable) {
      Alert.alert("Ошибка", `Можно выбрать максимум ${maxSelectable} навыков`);
      return;
    }
      // Проверяем, не превысит ли ранг навыка максимум после добавления +2
      if (currentSkill.value + 2 > skillMax) {
        Alert.alert("Ошибка", `Отметка этого навыка превысит максимальный ранг (${skillMax}). Сначала понизьте его значение.`);
        return;
      }
    }

    let newSelectedSkills;
    let valueChange = 0;

    if (isCurrentlySelected) {
      newSelectedSkills = selectedSkills.filter(s => s !== skillName);
      valueChange = -2;
    } else {
      newSelectedSkills = [...selectedSkills, skillName];
      valueChange = 2;
    }

    setSelectedSkills(newSelectedSkills);
    setSkills(prev => prev.map((s, i) => 
      i === skillIndex ? { ...s, value: Math.max(0, s.value + valueChange) } : s
    ));
  };

  const handleChangeSkillValue = (index, delta) => {
    if (!attributesSaved) {
      Alert.alert("Сначала сохраните атрибуты");
      return;
    }
    
    if (delta > 0 && skillPointsLeft <= 0) {
      Alert.alert("Ошибка", "У вас не осталось очков навыков для распределения.");
      return;
    }

    setSkills(prev => {
      const newSkills = [...prev];
      const skill = newSkills[index];
      const isTagged = selectedSkills.includes(skill.name);

      if (canChangeSkillValue(skill.value, delta, trait, level, isTagged)) {
        newSkills[index] = { ...skill, value: skill.value + delta };
      }
      return newSkills;
    });
  };

  const handleChangeAttribute = (index, delta) => {
    setAttributes(prev => {
      const newAttributes = [...prev];
      const attr = newAttributes[index];
      const { min, max } = getAttributeLimits(trait, attr.name);
      
      const newValue = attr.value + delta;
      if (newValue >= min && newValue <= max) {
        newAttributes[index] = { ...attr, value: newValue };
      }
      
      return newAttributes;
    });
  };

  // Функция для получения черт происхождения
  const getTraitsForOrigin = (origin) => {
    if (!origin) return [];
    return Object.entries(TRAITS).filter(([_, trait]) => trait.origin === origin.name);
  };

  const handleSelectOrigin = (origin) => {
    setOrigin(origin);
    setSelectedOrigin(null);
    setIsOriginModalVisible(false);
    
    setTrait(null); // Всегда сбрасываем черту при смене происхождения
  };

  const confirmOriginSelection = (newOrigin) => {
    if (!origin || newOrigin.id === origin.id) {
      handleSelectOrigin(newOrigin);
      return;
    }

    const confirmAndReset = () => {
      resetCharacter();
      handleSelectOrigin(newOrigin);
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Сменить происхождение? Все ваши атрибуты, навыки и черты будут сброшены. Вы уверены?")) {
        confirmAndReset();
      }
    } else {
      Alert.alert(
        "Сменить происхождение?",
        "Все ваши атрибуты, навыки и черты будут сброшены. Вы уверены?",
        [
          { text: "Отмена", style: "cancel" },
          { text: "Да, сбросить", onPress: confirmAndReset, style: "destructive" }
        ]
      );
    }
  };
  const handleSelectTrait = (traitName, modifiers) => {
    const baseInfo = TRAITS[traitName] || {}; // Для описания и названия происхождения

    // Создаем новый объект черты. Сначала берем базовую информацию,
    // а затем "накатываем" сверху все данные из модального окна (модификаторы).
    const selectedTrait = { ...baseInfo, name: traitName, modifiers: modifiers };
    setTrait(selectedTrait);
  
    if (modifiers) {
      if (modifiers.attributes) {
        setAttributes(prev => {
          const newAttributes = [...prev];
          for (const key in modifiers.attributes) {
            const attrIndex = newAttributes.findIndex(a => a.name === key);
            if (attrIndex > -1) {
              newAttributes[attrIndex].value += modifiers.attributes[key];
            }
          }
          return newAttributes;
        });
      }
  
      if (modifiers.skill) {
        handleTraitSkillSelect(modifiers.skill);
      }

      if (modifiers.skillModifiers) {
        setSkills(prevSkills => {
          const newSkills = [...prevSkills];
          for (const skillName in modifiers.skillModifiers) {
            const skillIndex = newSkills.findIndex(s => s.name === skillName);
            if (skillIndex > -1) {
              newSkills[skillIndex].value += modifiers.skillModifiers[skillName];
            }
          }
          return newSkills;
        });
      }

      if (modifiers.effects) {
        setEffects(prev => [...new Set([...prev, ...modifiers.effects])]);
      }
      // Новый универсальный обработчик для обязательных навыков
      if (modifiers.forcedSkills) {
        setForcedSelectedSkills(prev => [...new Set([...prev, ...modifiers.forcedSkills])]);
        setSelectedSkills(prev => [...new Set([...prev, ...modifiers.forcedSkills])]);
      }
    }
  
    setIsTraitModalVisible(false);
  };

  // Обработчик нажатия на строку черты
  const handleTraitPress = () => {
    if (!origin) {
      Alert.alert("Ошибка", "Сначала выберите происхождение");
      return;
    }
    
    const availableTraits = getTraitsForOrigin(origin);
    if (availableTraits.length === 0) {
      Alert.alert("Информация", "Для данного происхождения нет доступных черт");
      return;
    }
    
    // Если есть специальное модальное окно для черты
    const TraitModalComponent = getTraitModalComponent(origin.name);
    if (TraitModalComponent) {
      setIsTraitModalVisible(true);
    } else {
      // Если нет специального модального окна, показываем обычный список
      setIsTraitModalVisible(true);
    }
  };

  const handleTraitSkillSelect = (skill) => {
    setForcedSelectedSkills([skill]);
    const skillIndex = skills.findIndex(s => s.name === skill);
    setSelectedSkills(prev => [...prev, skill]);
    setSkills(prev => prev.map((s, i) => 
      i === skillIndex ? { ...s, value: s.value + 2 } : s
    ));
    setShowTraitSkillModal(false);
  };

  const handleSpendLuckPoint = () => {
    if (luckPoints > 0) {
      setLuckPoints(prev => prev - 1);
    }
  };

  const handleRestoreLuckPoint = () => {
    if (luckPoints < maxLuckPoints) {
      setLuckPoints(prev => prev + 1);
    }
  };

  const handleSaveAttributes = () => {
    if (remainingAttributePoints !== 0) {
      Alert.alert("Ошибка", "Потратьте все очки атрибутов перед сохранением");
      return;
    }
    setAttributesSaved(true);
    setSkillsSaved(false);
  };

  const handleSaveSkills = () => {
    const { isValid, maxRank } = validateSkills(skills, trait);
    
    if (!isValid) {
      Alert.alert(`Ошибка: Максимальный ранг навыков - ${maxRank}`);
      return;
    }
    
    setSkillsSaved(true);
  };

  const handleResetAttributes = () => {
    setResetType('attributes');
    setShowResetWarning(true);
  };

  const handleResetSkills = () => {
    setResetType('skills');
    setShowResetWarning(true);
  };

  const handleLevelChange = (delta) => {
    const newLevel = Math.max(1, level + delta);
    
    if (newLevel > level && attributesSaved) {
      setSkillsSaved(false);
    }
    
    setLevel(newLevel);
  };

  const confirmReset = () => {
    if (resetType === 'attributes' || resetType === 'all') {
      resetCharacter();
      setTrait(null);
    } else if (resetType === 'skills') {
      const newSkills = ALL_SKILLS.map(skill => ({
        ...skill,
        value: forcedSelectedSkills.includes(skill.name) ? 2 : 0
      }));
      setSkills(newSkills);
      setSelectedSkills([...forcedSelectedSkills]);
      setSkillsSaved(false);
    }
    setShowResetWarning(false);
  };

  const cancelReset = () => {
    setShowResetWarning(false);
  };

  // Получаем компонент модального окна для черты
  const TraitModalComponent = origin ? getTraitModalComponent(origin.name) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground 
        source={require('./assets/bg.png')} 
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <PressableRow 
              title="Происхождение" 
              value={origin ? origin.name : 'Не выбрано'}
              onPress={() => setIsOriginModalVisible(true)}
            />
            <PressableRow 
              title="Черта" 
              value={trait ? trait.name : 'Не выбрано'}
              onPress={handleTraitPress}
            />
            <PressableRow 
              title="Снаряжение" 
              value={equipment || 'Не выбрано'}
              onPress={() => {}}
            />
            <View style={styles.levelContainer}>
              <Text style={styles.levelLabel}>Уровень:</Text>
              <CompactCounter 
                value={level}
                onIncrease={() => handleLevelChange(1)}
                onDecrease={() => handleLevelChange(-1)}
              />
            </View>
          </View>

          <View style={styles.columnsContainer}>
            <View style={styles.leftColumn}>
              <AttributesSection 
                attributes={attributes}
                onAttributeChange={handleChangeAttribute}
                remainingAttributePoints={remainingAttributePoints}
                attributesSaved={attributesSaved}
                onSaveAttributes={handleSaveAttributes}
                onResetAttributes={handleResetAttributes}
                trait={trait}
              />

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>ХАРАКТЕРИСТИКИ</Text>
                </View>
                <DerivedRow 
                  title="Очки Атрибутов" 
                  value={remainingAttributePoints} 
                />
                <DerivedRow 
                  title="Отмечено навыков" 
                  value={`${selectedSkills.length} / ${getMaxSelectableSkills(trait)}`} 
                />
                <DerivedRow 
                  title="Очки Навыков" 
                  value={attributesSaved ? `${skillPointsLeft} / ${skillPointsAvailable}` : '—'} 
                />
                <LuckPointsRow 
                  luckPoints={luckPoints}
                  maxLuckPoints={maxLuckPoints}
                  onSpend={handleSpendLuckPoint}
                  onRestore={handleRestoreLuckPoint}
                />
              </View>

              <ImageSection origin={origin} />
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>НАВЫКИ</Text>
                  {attributesSaved && !skillsSaved && (
                    <Text style={styles.skillsCount}>
                      Доступно: {skillPointsLeft} очков
                    </Text>
                  )}
                </View>
                <View style={styles.skillsHeader}>
                  <Text style={styles.skillsHeaderText}>Навык</Text>
                  <Text style={styles.skillsHeaderText}>Значение</Text>
                </View>

                {skills.map((skill, index) => {
                  const isTagged = selectedSkills.includes(skill.name);
                  const isForced = forcedSelectedSkills.includes(skill.name) && isTagged;
                  const maxValue = level === 1 ? (isTagged ? 3 : 3) : 6;
                  const isMaxReached = skill.value >= maxValue;
                  const rowStyle = index % 2 === 0 ? styles.evenRow : styles.oddRow;
                  
                  return (
                    <SkillRow 
                      key={index}
                      name={skill.name}
                      value={skill.value}
                      isSelected={isTagged}
                      isMaxReached={isMaxReached}
                      isForced={isForced}
                      onToggle={() => handleToggleSkill(skill.name)}
                      onIncrease={() => handleChangeSkillValue(index, 1)}
                      onDecrease={() => handleChangeSkillValue(index, -1)}
                      rowStyle={rowStyle}
                      disabled={!canDistributeSkills && !showTraitSkillModal}
                      trait={trait}
                      increaseDisabled={skillPointsLeft <= 0}
                    />
                  );
                })}
                
                {attributesSaved && !skillsSaved && (
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                      style={[styles.button, styles.saveButton]}
                      onPress={handleSaveSkills}
                    >
                      <Text style={styles.buttonText}>Сохранить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.button, styles.resetButton]}
                      onPress={handleResetSkills}
                    >
                      <Text style={styles.buttonText}>Сбросить</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <OriginModal
          isVisible={isOriginModalVisible}
          origins={ORIGINS}
          selectedOrigin={selectedOrigin}
          onSelectOrigin={setSelectedOrigin}
          onClose={() => {
            setIsOriginModalVisible(false);
            setSelectedOrigin(null);
          }}
          onConfirm={() => {
            if (selectedOrigin) {
              confirmOriginSelection(selectedOrigin);
            } else {
              Alert.alert("Ошибка", "Выберите происхождение");
            }
          }}
        />
        
        <ResetConfirmationModal
          visible={showResetWarning}
          onCancel={cancelReset}
          onConfirm={confirmReset}
        />
        
        <TraitSkillModal
          visible={showTraitSkillModal && !!trait}
          trait={trait}
          onSelect={handleTraitSkillSelect}
          onCancel={() => setShowTraitSkillModal(false)}
        />

        {/* Модальное окно для выбора черты */}
        {TraitModalComponent && (
          <TraitModalComponent
            visible={isTraitModalVisible}
            onClose={() => setIsTraitModalVisible(false)}
            onSelect={handleSelectTrait}
            currentTrait={trait}
            skills={skills}
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
} 