import {
  PixelRatio
} from 'react-native';

const colors = {
  warning: '#f1c40f',
  success: '#2ecc71',
  successDarken: '#27ae60',

  danger: '#e74c3c',
  dangerLighten: '#FF7364',
  dangerDarken: '#c0392b',

  info: '#3498db',
  primary: '#3498db',
  white: '#fff',
  sunflower: '#f1c40f',

  muted: '#999',
  mutedLighten: '#ccc',
  mutedDarken: '#666',

  black: '#333',
  brand: '#2ecc71',
  nephritis: '#27ae60',
  nephritisDark: '#0B9A49',
  placeholder: 'rgba(255, 255, 255, 0.7)',
  disabled: 'rgba(255, 255, 255, 0.5)',
  border: '#ddd',

  lightest: '#fefefe',
  light: '#f9f9f9',
  lightGrey: '#e9e9e9',
  cloud: '#ecf0f1',
  cloudDarken: '#D3DFE2',

  silver: '#bdc3c7',
  silverLighten: '#E9EAEB'
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
  radius: 5,
  padding: 10,
  margin: 10,
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
  }
};