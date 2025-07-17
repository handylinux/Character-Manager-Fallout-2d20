import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import CharacterScreen from './components/screens/CharacterScreen/CharacterScreen';
import WeaponsAndArmorScreen from './components/screens/WeaponsAndArmorScreen/WeaponsAndArmorScreen';
import InventoryScreen from './components/screens/InventoryScreen/InventoryScreen';
import PerksAndTraitsScreen from './components/screens/PerksAndTraitsScreen/PerksAndTraitsScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Персонаж') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Оружие и Защита') {
              iconName = focused ? 'shield' : 'shield-outline';
            } else if (route.name === 'Инвентарь') {
              iconName = focused ? 'briefcase' : 'briefcase-outline';
            } else if (route.name === 'Перки и Черты') {
              iconName = focused ? 'star' : 'star-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopColor: '#5a5a5a',
          },
          tabBarActiveTintColor: '#f0e68c',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen 
            name="Персонаж" 
            component={CharacterScreen} 
        />
        <Tab.Screen 
            name="Оружие и Защита" 
            component={WeaponsAndArmorScreen}
            options={{
                tabBarLabel: ({focused, color}) => (
                    <Text style={{color, fontSize: 10, textAlign: 'center'}}>Оружие и{"\n"}Защита</Text>
                )
            }}
        />
        <Tab.Screen 
            name="Инвентарь" 
            component={InventoryScreen} 
        />
        <Tab.Screen 
            name="Перки и Черты" 
            component={PerksAndTraitsScreen}
            options={{
                tabBarLabel: ({focused, color}) => (
                    <Text style={{color, fontSize: 10, textAlign: 'center'}}>Перки и{"\n"}Черты</Text>
                )
            }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;