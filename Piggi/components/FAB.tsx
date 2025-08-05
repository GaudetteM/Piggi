import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  onPress: () => void;
  style?: ViewStyle;
};

export const FAB = ({ onPress, style }: Props) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    runOnJS(onPress)();
  };

  return (
    <TouchableOpacity
      style={[styles.fab, style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.fabContent, animatedStyle]}>
        <Ionicons name="add" size={28} color="#fff" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
  },
  fabContent: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
