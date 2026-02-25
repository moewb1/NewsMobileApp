import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'secondary';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary'
}: PrimaryButtonProps): React.JSX.Element {
  const isPrimary =variant === 'primary';

  return (
    <Pressable
    disabled = {disabled}
    onPress = {onPress}
    style={({pressed})=>[
      styles.base,
      isPrimary ? styles.primary : styles.secondary,
      pressed && !disabled
      ? isPrimary
        ? styles.primaryPressed
        : styles.secondaryPressed
      : null,
      disabled ? styles.disabled : null,
    ]}>
    <Text style = {[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
      {label}
    </Text>
    </Pressable>
      
  )
}

const styles = StyleSheet.create({
  base:{
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    alignItems: 'center',
  },
  primary:{
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryPressed: {
    backgroundColor: colors.secondaryPressed,
  },
  disabled: {
    opacity: 0.6
  },
  text:{
    fontSize:14,
    fontWeight:'700',
  },
  primaryText: {
    color: colors.card,
  },
  secondaryText: {
    color: colors.textPrimary,
  }
});