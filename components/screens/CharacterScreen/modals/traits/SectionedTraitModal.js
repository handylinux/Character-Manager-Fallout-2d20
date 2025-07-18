// SectionedTraitModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { TRAITS } from '../../logic/traitsData';

export const traitConfig = {
  originName: ['Житель НКР', 'Выживший'],
  modalType: 'sectioned'
};

const SectionedTraitModal = ({ visible, onSelect, onClose, currentTrait }) => {
  const survivorTraits = TRAITS['Выживший']?.traits || [];
  const ncrTraits = TRAITS['Житель НКР']?.traits || [];

  const handleSelectTrait = (trait) => {
    onSelect(trait.name, trait.modifiers);
  };

  const renderTraitButton = (trait) => (
    <TouchableOpacity
      key={trait.name}
      style={[
        styles.modalButton,
        styles.skillOption,
        currentTrait?.name === trait.name && styles.selectedOption
      ]}
      onPress={() => handleSelectTrait(trait)}
    >
      <Text style={styles.buttonText}>{trait.name}</Text>
      <Text style={styles.descriptionText}>{trait.description}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Выберите черту</Text>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Черты Выжившего</Text>
              {survivorTraits.map(renderTraitButton)}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Черты НКР</Text>
              {ncrTraits.map(renderTraitButton)}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    width: '100%',
    marginBottom: 10,
  },
  section: {
    width: '100%',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  modalButton: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  skillOption: {
    backgroundColor: '#2196F3',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },
  selectedOption: {
    backgroundColor: '#1976D2',
    borderColor: '#fff',
    borderWidth: 2,
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  descriptionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});

export default SectionedTraitModal; 