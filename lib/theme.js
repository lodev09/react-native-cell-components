import {
  PixelRatio,
  Platform,
  StyleSheet,
  Dimensions
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

// https://github.com/ptelad/react-native-iphone-x-helper/blob/master/index.js
function isIphoneX() {
    let dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dimen.height === 812 || dimen.width === 812)
    );
}

const value = (ios = null, android = null) => {
  return Platform.select({
    ios,
    android
  });
};

const isIphoneX = isIphoneX();
const borderWidth = StyleSheet.hairlineWidth;
const radius = value(5, 2);
const padding = value(10, 16);
const margin = value(10, 8);
const bottomOffset = isIphoneX ? 20 : 0;
const topOffset = isIphoneX ? 60 : 20;

const borders = {};
const borderRadius = {};

['Bottom', 'Top', 'Left', 'Right'].forEach((key) => {
  const keyName = key === 'all' ? '' : key;

  borders[key.toLowerCase()] = {
    ['border' + keyName + 'Width']: borderWidth,
    ['border' + keyName + 'Color']: colors.border
  };

  borderRadius[key.toLowerCase()] = {
    ['border' + keyName + 'RightRadius']: radius,
      ['border' + keyName + 'LeftRadius']: radius,
  };
});

export default theme = {
  border: { ...borders },
  borderRadius: { ...borderRadius },
  separator: {
    backgroundColor: colors.border,
    height: borderWidth
  },
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
  isAndroid: value(false, true),
  isIOS: value(true, false),
  isIphoneX,
  bottomOffset,
  topOffset,
  borderWidth,
  radius,
  padding,
  margin,
  value
};