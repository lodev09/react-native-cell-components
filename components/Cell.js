import React from 'react';
import theme from '../lib/theme';
import Icon from '../lib/Icon';

import {
  View,
  TouchableHighlight,
  TouchableNativeFeedback,
  StyleSheet,
  Text
} from 'react-native';

const CELL_MIN_HEIGHT = 48;
const ICON_DEFAULT_SIZE = 24;
const TITLE_MIN_WIDTH = 98;
const CORDER_MIN_WIDTH = theme.padding;
const Touchable = theme.isIOS ? TouchableHighlight : TouchableNativeFeedback;

class Cell extends React.Component {
  static defaultProps = {
    tintColor: theme.color.black
  }

  static propTypes = {
    title: React.PropTypes.any,
    subtitle: React.PropTypes.any,
    icon: React.PropTypes.any,
    disclosure: React.PropTypes.any,
    value: React.PropTypes.any,
    tintColor: React.PropTypes.string
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
    const iconProps = Object.assign(
      { size: ICON_DEFAULT_SIZE },
      typeof this.props.icon === 'string' ?
        { name: this.props.icon } :
        this.props.icon || {}
    );

    return (
      <Icon
        {...iconProps}
        style={[
          styles.icon,
          {
            color: iconProps.color || (this.props.tintColor || theme.color.black),
            opacity: iconProps.opacity || 0.8
          }
        ]}
      />
    );
  }

  renderDisclosure() {
    const iconProps = Object.assign(
      { size: ICON_DEFAULT_SIZE },
      typeof this.props.disclosure === 'string' ?
        { name: this.props.disclosure } :
        this.props.disclosure || {}
    );
    
    return (
      <Icon
        {...iconProps}
        style={[
          styles.disclosure,
          { color: iconProps.color || theme.color.muted }
        ]}
      />
    );
  }

  render() {
    return (
      <Touchable
        background={theme.isAndroid && TouchableNativeFeedback.Ripple(theme.color.mutedLighten)}
        {...this.props}
      >
        <View style={[ styles.container, this.props.style ]} >
          <View style={[ styles.sectionContainer, styles.leftContainer, this.props.subtitle ? styles.leftContainerSubtitled : null ]} >
            {this.props.icon && this.renderIcon()}
          </View>
          <View style={[ styles.sectionContainer, styles.middleContainer ]} >
            <View style={styles.titleValueContainer} >
              {this.renderTitle()}
              {this.renderValue()}
            </View>
            <View>
              {this.props.subtitle && <Text style={styles.subtitle} ellipsizeMode="tail" numberOfLines={1} >{this.props.subtitle}</Text>}
            </View>
          </View>
          <View style={[ styles.rightContainer ]} >
            {this.props.disclosure && this.renderDisclosure()}
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
  sectionContainer: {
    paddingVertical: theme.padding / 2
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
  icon: {
    paddingLeft: theme.padding,
    width: theme.padding * 4.5,
    textAlign: 'left',
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: CORDER_MIN_WIDTH,
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: CORDER_MIN_WIDTH,
    // width: theme.padding * 4.5
  },
  leftContainerSubtitled: {
    justifyContent: 'flex-start',
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  disclosure: {
    width: theme.iconWidth,
    margin: theme.margin,
    textAlign: 'center'
  }
});

export default Cell;