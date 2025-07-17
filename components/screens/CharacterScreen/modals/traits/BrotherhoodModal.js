// components/modals/BrotherhoodModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

export const traitConfig = {
  originName: 'Братство Стали',
  modalType: 'choice'
};

const BrotherhoodModal = ({ visible, onSelect, onClose }) => {
  const trait = {
    name: "Цепь, которая связывает",
    description: "Выберите один дополнительный навык: Энергооружие, Наука или Ремонт",
    forcedSkills: ['Энергооружие', 'Наука', 'Ремонт'],
    extraSkills: 1
  };

  const handleSelectSkill = (skill) => {
    onSelect(trait.name, { skill: skill });
  };

  const handleConfirm = () => {
    if (selectedSkill) {
      onSelect('Цепь, которая связывает', { skill: selectedSkill });
    } else {
      onSelect('Цепь, которая связывает', {});
    }
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Братство Стали</Text>
          <Text style={styles.traitName}>{trait.name}</Text>
          
          {trait.description && (
            <Text style={styles.modalText}>{trait.description}</Text>
          )}

          {trait.forcedSkills?.map(skill => (
            <TouchableOpacity
              key={skill}
              style={[styles.modalButton, styles.skillOption]}
              onPress={() => handleSelectSkill(skill)}
            >
              <Text style={styles.buttonText}>{skill}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.modalButton, styles.confirmButton, !selectedSkill && styles.disabledButton]}
            onPress={handleConfirm}
            disabled={!selectedSkill}
          >
            <Text style={styles.buttonText}>Выбрать</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Не выбирать</Text>
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
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20
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
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default BrotherhoodModal;
