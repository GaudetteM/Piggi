import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';

const { width } = Dimensions.get('window');

type Props = {
  title: string;
  amount: number;
  subtitle?: string;
  backgroundColor?: string;
  valueColor?: string;
  gradientColors?: string[];
  icon?: React.ReactNode;
  onPress?: () => void;
};

export const StatCard = ({
  title,
  amount,
  subtitle,
  backgroundColor,
  valueColor,
  gradientColors,
  icon,
  onPress,
}: Props) => {
  const contentView = (
    <View style={styles.content}>
      <View style={styles.header}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text
          style={[
            styles.title,
            gradientColors && styles.gradientTitle,
          ]}
        >
          {title}
        </Text>
      </View>

      <Text
        style={[
          styles.amount, 
          gradientColors && styles.gradientAmount,
          valueColor && !gradientColors && { color: valueColor }
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatCurrency(amount)}
      </Text>

      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            gradientColors && styles.gradientSubtitle,
          ]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );

  if (gradientColors) {
    const gradientContent = (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, styles.gradient]}
      >
        {contentView}
      </LinearGradient>
    );

    return onPress ? (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {gradientContent}
      </TouchableOpacity>
    ) : (
      gradientContent
    );
  }

  const regularContent = (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor || colors.card },
      ]}
    >
      {contentView}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {regularContent}
    </TouchableOpacity>
  ) : (
    regularContent
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    padding: 20,
    minHeight: 120,
    width: (width - 64) / 2, // Adjusted for better grid spacing
  },
  gradient: {
    // Override any specific gradient styles if needed
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    opacity: 0.9,
    flex: 1,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    marginVertical: 4,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.8,
    marginTop: 4,
  },
  gradientTitle: {
    color: 'rgba(255,255,255,0.9)',
  },
  gradientAmount: {
    color: 'white',
  },
  gradientSubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
});
