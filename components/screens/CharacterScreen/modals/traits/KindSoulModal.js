// KindSoulModal.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const KindSoulModal = ({
  visible,
  onClose,
  onSelect,
  trait
}) => {
  const [selected, setSelected] = useState([]);
  const skillPool = trait?.skillPool || [];
  const maxSelections = trait?.extraSkills || 0;

  const handleSelectSkill = (skill) => {
    if (selected.includes(skill)) {
      setSelected(selected.filter(s => s !== skill));
    } else if (selected.length < maxSelections) {
      setSelected([...selected, skill]);
    }
  };

  const handleConfirm = () => {
    if (selected.length === maxSelections) {
      onSelect(selected);
    }
  };

  const handleCancel = () => {
    setSelected([]); // Сбрасываем выбранные навыки
    onClose(true); // Передаем true, чтобы указать, что нужно открыть окно выбора черт
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Житель НКР</Text>
          <Text style={styles.traitName}>Добрая Душа</Text>
          
          {skillPool.map(skill => (
            <TouchableOpacity
              key={skill}
              style={[
                styles.modalButton,
                styles.skillOption,
                selected.includes(skill) && styles.selectedSkillOption
              ]}
              onPress={() => handleSelectSkill(skill)}
            >
              <Text style={styles.buttonText}>{skill}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={[
              styles.modalButton,
              styles.confirmButton,
              selected.length !== maxSelections && styles.disabledButton
            ]}
            onPress={handleConfirm}
            disabled={selected.length !== maxSelections}
          >
            <Text style={styles.buttonText}>Выбрать</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modalButton, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  traitName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%'
  },
  skillOption: {
    backgroundColor: '#2196F3',
  },
  selectedSkillOption: {
    backgroundColor: '#1976D2',
    borderColor: '#fff',
    borderWidth: 2,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default KindSoulModal; 