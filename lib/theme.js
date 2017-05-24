import {
  PixelRatio,
  Platform,
  StyleSheet
} from 'react-native';

const colors = {
  warning: '#f1c40f',
  success: '#2ecc71',
  danger: '#e74c3c',
  info: '#3498db',
  primary: '#3498db',
  white: '#ffffff',

  muted: '#999999',
  mutedLighten: '#cccccc',
  mutedDarken: '#666666',

  black: '#333333',
  border: '#dddddd',

  lightest: '#fafafa',
  light: '#f3f3f3',
  lightGrey: '#e9e9e9'
};

const borderWidth = StyleSheet.hairlineWidth; // 1 / PixelRatio.get();

const borders = {};
['Bottom', 'Top', 'Left', 'Right'].forEach((key) => {
  const keyName = key === 'all' ? '' : key;

  borders[key.toLowerCase()] = {
    ['border' + keyName + 'Width']: borderWidth,
    ['border' + keyName + 'Color']: colors.border
  };
});

export default theme = {
  border: { ...borders },
  separator: {
    backgroundColor: colors.border,
    height: borderWidth
  },
  radius: Platform.OS === 'ios' ? 5 : 2,
  padding: Platform.OS === 'ios' ? 10 : 16,
  margin: Platform.OS === 'ios' ? 10 : 8,
  color: colors,
  font: {
    xxsmall: 10,
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 22
  },
  background: colors.light,
  backgroundDarker: colors.lightGrey,
  borderWidth: borderWidth,
  borderColor: colors.border,
  iconWidth: 29,
  styles: {
    left: {
      alignItems: 'flex-start'
    },
    right: {
      alignItems: 'flex-end'
    }
  },
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios'
};