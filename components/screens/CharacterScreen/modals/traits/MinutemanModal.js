import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

export const traitConfig = {
  originName: 'Минитмен',
  modalType: 'choice'
};

const MinutemanModal = ({ visible, onSelect, onClose }) => {
  const trait = {
    name: "Народное ополчение",
    description: "Торговые караваны в ваших поселениях привлекают торговцев каждые 5 дней, а не 7. Поселения, которые вы основали любым способом, имеют базовый ресурс обороны 4. В качестве бонуса вы отмечаете дополнительный навык вы можете выбрать: либо энергетическое, либо стрелковое оружие . Сопротивление урону увеличивается на +1, если вы находитесь в укрытии, и вы наносите +1 Боевой Кубик урона, если вы и ваши спутники в меньшинстве.",
    forcedSkills: ['Энергооружие', 'Стрелковое оружие'],
    effects: ['Улучшенные караваны', 'Базовая оборона 4', 'Бонус к сопротивлению в укрытии', 'Бонус к урону в меньшинстве']
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
          <Text style={styles.modalTitle}>Минитмен</Text>
          <Text style={styles.traitName}>{trait.name}</Text>
          <Text style={styles.modalText}>{trait.description}</Text>
          
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

export default MinutemanModal; 