import React, { createContext, useState, useContext } from 'react';
import { createInitialAttributes, ALL_SKILLS, getLuckPoints } from './screens/CharacterScreen/logic/characterLogic';

const CharacterContext = createContext();

export const CharacterProvider = ({ children }) => {
  const [level, setLevel] = useState(1);
  const [attributes, setAttributes] = useState(createInitialAttributes());
  const [skills, setSkills] = useState(ALL_SKILLS.map(s => ({...s, value: 0})));
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [forcedSelectedSkills, setForcedSelectedSkills] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [trait, setTrait] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [effects, setEffects] = useState([]);
  
  const [luckPoints, setLuckPoints] = useState(getLuckPoints(createInitialAttributes()));
  const [maxLuckPoints, setMaxLuckPoints] = useState(getLuckPoints(createInitialAttributes()));

  const [attributesSaved, setAttributesSaved] = useState(false);
  const [skillsSaved, setSkillsSaved] = useState(false);

  const resetCharacter = (preserveOrigin = false) => {
    const initialAttributes = createInitialAttributes();
    setAttributes(initialAttributes);
    setSkills(ALL_SKILLS.map(s => ({...s, value: 0})));
    setSelectedSkills([]);
    setForcedSelectedSkills([]);
    setAttributesSaved(false);
    setSkillsSaved(false);
    const initialLuck = getLuckPoints(initialAttributes);
    setMaxLuckPoints(initialLuck);
    setLuckPoints(initialLuck);
    if (!preserveOrigin) {
      setOrigin(null);
    }
    setTrait(null);
    setEquipment(null);
    setEffects([]);
  };

  const value = {
    level, setLevel,
    attributes, setAttributes,
    skills, setSkills,
    selectedSkills, setSelectedSkills,
    forcedSelectedSkills, setForcedSelectedSkills,
    origin, setOrigin,
    trait, setTrait,
    equipment, setEquipment,
    effects, setEffects,
    luckPoints, setLuckPoints,
    maxLuckPoints, setMaxLuckPoints,
    attributesSaved, setAttributesSaved,
    skillsSaved, setSkillsSaved,
    resetCharacter,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  return useContext(CharacterContext);
}; 