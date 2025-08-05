import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export const AnimatedCard = ({ children, onPress, style, disabled }: Props) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withSpring(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };

  const handlePress = () => {
    if (onPress && !disabled) {
      runOnJS(onPress)();
    }
  };

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={style}
      >
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </TouchableOpacity>
    );
  }

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};
