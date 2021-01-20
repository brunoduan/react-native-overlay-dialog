import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { DialogActionAlign } from '../util/Style';
import type { DialogTitleProps } from '../types';

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  title: {
    padding: 14,
    paddingHorizontal: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  text: {
    fontWeight: isAndroid ? '400' : '500',
    fontFamily: isAndroid ? 'sans-serif-medium' : 'System',
    fontSize: isAndroid ? 19 : 15,
    color: '#151822',
  },
});

const DialogTitle = ({
  title,
  style,
  textStyle,
  align = 'center',
}: DialogTitleProps) => {
  const titleAlign = { alignItems: DialogActionAlign[align] };

  return (
    <View style={[styles.title, titleAlign, style]}>
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </View>
  );
}

export default DialogTitle;
