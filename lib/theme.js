import {
  PixelRatio,
  Platform
} from 'react-native';

const colors = {
  warning: '#f1c40f',
  success: '#2ecc71',
  danger: '#e74c3c',
  info: '#3498db',
  primary: '#3498db',
  white: '#fff',

  muted: '#999',
  mutedLighten: '#ccc',
  mutedDarken: '#666',

  black: '#333',
  border: '#ddd',

  light: '#f3f3f3',
  lightGrey: '#e9e9e9'
};

const borderWidth = 1 / PixelRatio.get();

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