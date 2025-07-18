import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useCharacter } from '../../CharacterContext';
import { TRAITS } from '../CharacterScreen/logic/traitsData';

const PerksAndTraitsScreen = () => {
  const { trait } = useCharacter();

  // Создаем массив из 20 строк
  const emptyRows = Array(20).fill(null);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.table}>
          {/* Заголовок таблицы */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerText, styles.nameColumn]}>Название</Text>
            <Text style={[styles.cell, styles.headerText, styles.rankColumn]}>Ранг</Text>
            <Text style={[styles.cell, styles.headerText, styles.descriptionColumn]}>Описание</Text>
          </View>

          {/* Строка с чертой, если она есть */}
          {trait && (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.nameColumn]}>{trait.name}</Text>
              <Text style={[styles.cell, styles.rankColumn]}></Text>
              <Text style={[styles.cell, styles.descriptionColumn]}>{TRAITS[trait.name]?.description || trait.description}</Text>
            </View>
          )}

          {/* Пустые строки */}
          {emptyRows.map((_, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, styles.nameColumn]}></Text>
              <Text style={[styles.cell, styles.rankColumn]}></Text>
              <Text style={[styles.cell, styles.descriptionColumn]}></Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#5a5a5a',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#5a5a5a',
    backgroundColor: '#fff',
    borderStyle: 'dotted',
    minHeight: 30,
  },
  headerRow: {
    backgroundColor: '#1a1a1a',
  },
  cell: {
    padding: 10,
    color: '#000',
    borderRightWidth: 1,
    borderRightColor: '#5a5a5a',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#fff',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap'
  },
  nameColumn: {
    flex: 2,
    minWidth: 100,
  },
  rankColumn: {
    flex: 0.5,
    textAlign: 'center',
    minWidth: 60,
  },
  descriptionColumn: {
    flex: 3,
    borderRightWidth: 0,
    minWidth: 150,
  },
  placeholder: {
    padding: 10,
    color: '#888',
    textAlign: 'center',
  },
});

export default PerksAndTraitsScreen; 