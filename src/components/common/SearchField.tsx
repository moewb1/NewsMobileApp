import React from "react";
import {KeyboardTypeOptions, StyleSheet, Text, TextInput, View} from 'react-native';
import { colors } from "../../theme/colors"; 
import { spacing } from "../../theme/spacing";  

type SearchFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

export function SearchField ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
}:SearchFieldProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>
      <TextInput
        style= {styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop: spacing.md,
  },
  label:{
    marginBottom: spacing.xs,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input:{
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
  },
})