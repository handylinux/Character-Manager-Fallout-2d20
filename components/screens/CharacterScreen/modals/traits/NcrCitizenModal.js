// NcrCitizenModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';

export const traitConfig = {
  originName: 'Житель НКР',
  modalType: 'choice'
};

const NcrCitizenModal = ({ visible, onSelect, onClose, traits }) => {

  const handleSelectTrait = (trait) => {
    onSelect(trait.name, trait.modifiers);
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
          <Text style={styles.modalTitle}>Выберите черту</Text>
          <ScrollView style={{ width: '100%', maxHeight: 400 }}>
            {traits.map(trait => (
              <TouchableOpacity
                key={trait.name}
                style={[styles.modalButton, styles.skillOption]}
                onPress={() => handleSelectTrait(trait)}
              >
                <Text style={styles.buttonText}>{trait.name}</Text>
                <Text style={styles.descriptionText}>{trait.description}</Text>
              </TouchableOpacity>
            ))}
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
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      modalButton: {
        padding: 12,
        marginVertical: 5,
        borderRadius: 6,
        alignItems: 'center',
        width: '100%',
      },
      skillOption: {
        backgroundColor: '#2196F3',
        alignItems: 'flex-start',
        paddingHorizontal: 15,
      },
      cancelButton: {
        backgroundColor: '#9E9E9E',
        marginTop: 10
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
      },
      descriptionText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
      }
});

export default NcrCitizenModal; 