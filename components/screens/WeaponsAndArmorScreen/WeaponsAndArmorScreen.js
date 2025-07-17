import React from 'react';
import { View, Text, StyleSheet, ImageBackground, SafeAreaView } from 'react-native';

const WeaponsAndArmorScreen = () => {
  return (
    <SafeAreaView style={localStyles.safeArea}>
      <ImageBackground
        source={require('../../../assets/bg.png')}
        style={localStyles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={localStyles.container}>
          <Text style={localStyles.title}>Оружие и Защита</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#000' },
    background: { flex: 1 },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    }
});

export default WeaponsAndArmorScreen; 