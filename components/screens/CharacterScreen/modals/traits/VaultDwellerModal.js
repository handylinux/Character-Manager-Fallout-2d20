import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';

export const traitConfig = {
  originName: 'Обитатель убежища',
  modalType: 'choice'
};

const VaultDwellerModal = ({ visible, onSelect, onClose, skills }) => {
  const trait = {
    name: "Ребенок из Убежища",
    description: "Ваше здоровое начало жизни, полученное от опытных врачей и высокотехнологичных автодоков, снижает сложность всех проверок на ВЫН и позволяет противостоять эффектам болезней. Кроме того, благодаря тщательно спланированному воспитанию вы получаете один дополнительный отмеченный навык на выбор. Вы также можете вместе с Гейм-мастером определить, что за эксперимент проводился в вашем Убежище. Один раз за квест ГМ может ввести осложнение, которое отражает природу эксперимента, в котором вы невольно участвовали, или ввести осложнение, связанное с вашей ранней жизнью в изоляции и заключении в Убежище. Если ГМ делает это, вы немедленно восстанавливаете одно очко удачи.",
    effects: ['Снижение сложности проверок ВЫН', 'Сопротивление болезням', 'Восстановление очка удачи при осложнении']
  };

  const handleSelectSkill = (skill) => {
    onSelect(trait.name, { 
      skill: skill,
      effects: trait.effects 
    });
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
          <Text style={styles.modalTitle}>Обитатель убежища</Text>
          <Text style={styles.traitName}>{trait.name}</Text>
          <Text style={styles.modalText}>{trait.description}</Text>
          
          <ScrollView style={{ width: '100%', maxHeight: 200 }}>
            {skills.map(skill => (
                <TouchableOpacity
                key={skill.name}
                style={[styles.modalButton, styles.skillOption]}
                onPress={() => handleSelectSkill(skill.name)}
                >
                <Text style={styles.buttonText}>{skill.name}</Text>
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
    traitName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2196F3'
    },
    modalText: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 20,
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
});

export default VaultDwellerModal; 