import React from 'react'
import {StyleSheet, Text ,View} from 'react-native'
import { colors } from '../../theme/colors' 
import { spacing } from '../../theme/spacing' 

type StatusMessageProps = {
  message: string;
  tone?: 'info' | 'error';
};

export function StatusMessage({
  message,
  tone = 'info',
}:StatusMessageProps): React.JSX.Element{
  const isError = tone === 'error';

  return(
    <View style={[styles.continer, isError ? styles.errorContainer : styles.infoContainer]}>
      <Text style={[styles.text, isError ? styles.errorText : styles.infoText]}>
        {message}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  continer:{
    borderRadius:20,
    padding:spacing.md,
    marginTop:spacing.md,
  },
  infoContainer: {
    backgroundColor: colors.infoContainer
  },
  errorContainer: {
    backgroundColor: colors.errorBackground,
  },
  text: {
    fontSize:13,
    fontWeight:'500'
  },
  infoText: {
    color: colors.textPrimary,
  },
  errorText: {
    color: colors.errorText
  }
})