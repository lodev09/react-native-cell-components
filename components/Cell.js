import React from 'react';
import theme from '../lib/theme';
import Icon from '../lib/Icon';

import {
  View,
  TouchableHighlight,
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  Platform
} from 'react-native';

const CELL_MIN_HEIGHT = 48;
const ICON_DEFAULT_SIZE = 24;
const TITLE_MIN_WIDTH = 98;
const CORNER_MIN_WIDTH = theme.padding;
const Touchable = theme.isIOS ? TouchableHighlight : TouchableNativeFeedback;
let ANDROID_BACKGROUND = null;

if (theme.isAndroid) {
  if (Platform.Version >= 21) {
    ANDROID_BACKGROUND = TouchableNativeFeedback.Ripple(theme.color.mutedLighten);
  } else {
    ANDROID_BACKGROUND = TouchableNativeFeedback.SelectableBackground();
  }
}

const positions = {
  auto: 'center',
  top: 'flex-start',
  bottom: 'flex-end',
  center: 'center'
};

class Cell extends React.Component {
  static defaultProps = {
    tintColor: theme.color.black,
    contentPosition: 'auto',
    contentOffset: theme.padding,
    selectMode: 'none',
    selected: false,
    iconSelected: 'check-box',
    iconUnSelected: 'check-box-outline-blank',
    onSelect: () => null
  }

  static propTypes = {
    title: React.PropTypes.any,
    subtitle: React.PropTypes.any,
    icon: React.PropTypes.any,
    contentPosition: React.PropTypes.oneOf(Object.keys(positions)),
    disclosure: React.PropTypes.any,
    value: React.PropTypes.any,
    tintColor: React.PropTypes.string,
    contentOffset: React.PropTypes.number,
    selectMode: React.PropTypes.oneOf([ 'none', 'check' ]),
    selected: React.PropTypes.bool,
    iconSelected: React.PropTypes.string,
    iconUnSelected: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    onPress: React.PropTypes.func,
    onLongPress: React.PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  renderTitle() {
    if (!this.props.title) return;

    let value = null;
    switch (typeof this.props.title) {
      case 'object':
        value = this.props.title;
        break;
      case 'function':
        value = this.props.title();
        break;
      default:
        value = (
          <Text
            style={[
              styles.title,
              { color: this.props.tintColor || theme.color.black }
            ]}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {this.props.title}
          </Text>
        );
    }

    return <View style={styles.titleContainer} >{value}</View>;
  }

  renderSubtitle() {
    if (!this.props.subtitle) return;

    switch (typeof this.props.subtitle) {
      case 'object':
        return this.props.subtitle;
        break;
      case 'function':
        return this.props.subtitle();
        break;
      default:
        return <Text style={styles.subtitle} ellipsizeMode="tail" numberOfLines={1} >{this.props.subtitle}</Text>;
        break;
    }
  }

  renderValue() {
    if (React.Children.count(this.props.children) > 0) {
      return this.props.children;
    }

    if (!this.props.value) return;

    switch (typeof this.props.value) {
      case 'object':
        return this.props.value;
        break;
      case 'function':
        return this.props.value();
        break;
      default:
        return (
          <View style={styles.valueContainer} >
            <Text
              style={[
                styles.value,
                {
                  color: this.props.tintColor || theme.color.black,
                  opacity: 0.8
                }
              ]}
              numberOfLines={1}
            >
              {this.props.value}
            </Text>
          </View>
        );
    }
  }

  renderIcon() {
    if (!this.props.icon) return;

    switch (typeof this.props.icon) {
      case 'function':
        const icon = this.props.icon();
        return (
          <View style={styles.iconContainer} >
            {icon}
          </View>
        );
        break;
      default:
        const iconProps = Object.assign(
          {},
          { size: ICON_DEFAULT_SIZE },
          typeof this.props.icon === 'string' ? { name: this.props.icon } : this.props.icon || {}
        );

        return (
          <Icon
            {...iconProps}
            style={[
              styles.iconContainer,
              styles.icon,
              {
                color: iconProps.color || (this.props.tintColor || theme.color.black),
                opacity: iconProps.opacity || 0.8
              }
            ]}
          />
        );
    }
  }

  renderDisclosure() {
    if (!this.props.disclosure || this.isSelecting()) return;

    switch (typeof this.props.disclosure) {
      case 'function':
        const disclosure = this.props.disclosure();
        return (
          <View style={[ styles.disclosureContainer, { paddingVertical: this.props.contentOffset } ]} >
            {disclosure}
          </View>
        );
        break;
      default:
        const iconProps = Object.assign(
          { size: ICON_DEFAULT_SIZE },
          typeof this.props.disclosure === 'string' ? { name: this.props.disclosure } : this.props.disclosure || {}
        );
        
        return (
          <Icon
            {...iconProps}
            style={[
              styles.disclosureContainer,
              {
                color: iconProps.color || theme.color.muted,
                paddingVertical: this.props.contentOffset,
                textAlign: 'center'
              }
            ]}
          />
        );
    }
  }

  renderSelect() {
    if (!this.isSelecting()) {
      return;
    }

    let iconProp = '';
    if (this.props.selected) {
      iconProp = this.props.iconSelected;
    } else {
      iconProp = this.props.iconUnSelected;
    }

    const iconProps = Object.assign({ size: ICON_DEFAULT_SIZE - 3 }, typeof iconProp === 'string' ? { name: iconProp } : iconProp);

    return (
      <View
        style={[
          styles.sectionContainer,
          {
            paddingVertical: this.props.contentOffset,
            justifyContent: positions[this.props.subtitle && this.props.contentPosition === 'auto' ? 'top' : this.props.contentPosition]
          }
        ]}
      >
        <Icon
          {...iconProps}
          style={{
            color: iconProps.color || theme.color.info,
            textAlign: 'center',
            paddingLeft: theme.padding
          }}
        />
      </View>
    );
  }

  isSelecting() {
    return this.props.selectMode && this.props.selectMode !== 'none'
  }

  isSelected() {
    return this.props.selected;
  }

  handleCellOnPress = () => {
    if (this.isSelecting()) {
      this.props.onSelect();
    } else {
      this.props.onPress();
    }
  }

  render() {
    const isSelecting = this.isSelecting();
    return (
      <Touchable
        background={theme.isAndroid && this.props.onPress ? ANDROID_BACKGROUND : null}
        onPress={this.props.onPress || isSelecting ? this.handleCellOnPress : null}
        onLongPress={this.props.onLongPress}
      >
        <View style={[ styles.container, this.props.style, this.props.selected && isSelecting ? styles.selectedContainer : null ]} >
          {this.renderSelect()}
          <View
            style={[
              styles.sectionContainer,
              {
                paddingVertical: this.props.contentOffset,
                justifyContent: positions[this.props.subtitle && this.props.contentPosition === 'auto' ? 'top' : this.props.contentPosition]
              }
            ]}
          >
            {this.renderIcon()}
          </View>

          <View
            style={[
              styles.middleContainer,
              {
                paddingVertical: this.props.contentOffset,
                justifyContent: positions[this.props.contentPosition]
              }
            ]}
          >
            <View style={styles.titleValueContainer} >
              {this.renderTitle()}
              {this.renderValue()}
            </View>
            <View>
              {this.renderSubtitle()}
            </View>
          </View>
          <View
            style={[
              styles.sectionContainer,
              {
                justifyContent: positions[this.props.subtitle && this.props.contentPosition === 'auto' ? 'top' : this.props.contentPosition]
              }
            ]}
          >
            {this.renderDisclosure()}
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.white,
    flexDirection: 'row',
    minHeight: CELL_MIN_HEIGHT
  },
  selectedContainer: {
    backgroundColor: theme.color.light
  },
  titleValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  valueContainer: {
    flex: 1
  },
  value: {
    fontSize: theme.font.small,
    textAlign: 'right'
  },
  titleContainer: {
    minWidth: TITLE_MIN_WIDTH
  },
  title: {
    fontSize: theme.font.medium, 
    marginRight: theme.margin / 1.5
  },
  subtitle: {
    marginTop: theme.margin / 5,
    fontSize: theme.font.xsmall,
    color: theme.color.muted
  },
  iconContainer: {
    paddingLeft: theme.padding,
    minWidth: theme.padding * 4.5
  },
  disclosureContainer: {
    width: theme.iconWidth,
    marginHorizontal: theme.margin
  },
  icon: {
    textAlign: 'left',
  },
  sectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: CORNER_MIN_WIDTH,
  },
  middleContainer: {
    flex: 1
  }
});

export default Cell;