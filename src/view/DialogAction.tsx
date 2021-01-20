import React from 'react'
import { Text, TouchableHighlight, StyleSheet, Platform } from 'react-native';
import { DialogActionAlign } from '../util/Style';
import type { DialogActionProps } from '../types';

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  text: {
    fontWeight: isAndroid ? '400' : '500',
    fontSize: isAndroid ? 19 : 16,
    color: '#044DE0',
  },
  disable: {
    color: '#C5C6C5',
  }
});

const DialogAction = ({
  text,
  onPress,
  style,
  textStyle,
  activeOpacity = 0.6,
  align = 'left',
  disabled = false
}: DialogActionProps) => {
  const buttonAlign = { alignSelf: DialogActionAlign[align] };
  const disable = disabled ? styles.disable : null;

  return (
    <TouchableHighlight
      underlayColor="#F1F2F2"
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={[styles.button, buttonAlign, style]}
    >
      <Text style={[styles.text, disable, textStyle]}>
        {text}
      </Text>
    </TouchableHighlight>
  );
};

export default DialogAction;
