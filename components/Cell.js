import React from 'react';
import theme from '../lib/theme';
import Icon from '../lib/Icon';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';

const CELL_MIN_HEIGHT = 48;
const ICON_DEFAULT_SIZE = 20;

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
    switch (typeof this.props.title) {
      case 'object':
        return this.props.title;
        break;
      case 'string':
        return <Text style={[ styles.title, { color: this.props.tintColor } ]} ellipsizeMode="tail" numberOfLines={1} >{this.props.title}</Text>;
        break;
    }
  }

  renderValue() {
    if (React.Children.count(this.props.children) > 0) {
      return this.props.children;
    }

    if (!this.props.value) return;

    switch (typeof this.props.value) {
      case 'string':
        return <Text style={[ styles.value, styles.valueText, { color: this.props.tintColor, opacity: 0.8 } ]} numberOfLines={1} >{this.props.value}</Text>
      case 'object':
        return <View style={styles.value} >{this.props.value}</View>;
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
            color: iconProps.color || this.props.tintColor,
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
      <TouchableHighlight {...this.props} >
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
          <View style={[styles.sectionContainer, styles.rightContainer ]} >
            {this.props.disclosure && this.renderDisclosure()}
          </View>
        </View>
      </TouchableHighlight>
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
  valueText: {
    fontSize: theme.font.medium,
    color: theme.color.muted,
    textAlign: 'right'
  },
  value: {
    flex: 3
  },
  title: {
    fontSize: theme.font.medium,
    flex: 1,
    marginRight: theme.margin / 1.5
  },
  subtitle: {
    marginTop: theme.margin / 5,
    fontSize: theme.font.xsmall,
    color: theme.color.muted
  },
  icon: {
    width: theme.iconWidth,
    marginHorizontal: theme.margin / 1.5,
    marginVertical: theme.margin / 5,
    paddingLeft: theme.padding / 2,
    textAlign: 'center',
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 15,
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 15
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
    marginHorizontal: theme.margin / 1.5,
    textAlign: 'center'
  }
});

export default Cell;