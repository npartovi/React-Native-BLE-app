import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';

interface LaunchScreenProps {
  onComplete: () => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onComplete }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Start the animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onComplete]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Electric Dreams Logo - Full Screen */}
        <Image
          source={require('../assets/electric_dreams_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000814',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.8,
    height: height * 0.8,
  },
});

