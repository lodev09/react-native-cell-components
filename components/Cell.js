import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import theme from '../lib/theme';

import {
  View,
  TouchableHighlight,
  StyleSheet,
  Text
} from 'react-native';

const CELL_MIN_HEIGHT = 49;

class Cell extends React.Component {
  static defaultProps = {
    iconColor: theme.color.muted,
    disclosureColor: theme.color.muted
  }

  static propTypes = {
    title: React.PropTypes.any,
    subtitle: React.PropTypes.any,
    icon: React.PropTypes.string,
    disclosure: React.PropTypes.string,
    value: React.PropTypes.any
  }

  renderTitle() {
    switch (typeof this.props.title) {
      case 'object':
        return this.props.title;
        break;
      case 'string':
        return <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1} >{this.props.title}</Text>;
        break;
    }
  }

  renderValue() {
    switch (typeof this.props.value) {
      case 'string':
        return <Text style={[ styles.value, styles.valueText ]} numberOfLines={1} >{this.props.value}</Text>
        break;
      case 'object':
        return <View style={styles.value} >{this.props.value}</View>;
        break;
    }
  }

  render() {
    return (
      <TouchableHighlight {...this.props} >
        <View style={[ styles.row, this.props.style ]} >
          <View style={styles.leftContainer} >
            {
              this.props.icon &&
              <Icon
                size={18}
                name={this.props.icon}
                style={[
                  styles.icon,
                  { color: this.props.iconColor }
                ]}
              />
            }
          </View>
          <View style={{ flex: 1 }} >
            <View style={styles.titleValueContainer} >
              {this.renderTitle()}
              {this.renderValue()}
            </View>
            <View>
              {this.props.subtitle && <Text style={styles.subtitle} ellipsizeMode="tail" numberOfLines={1} >{this.props.subtitle}</Text>}
            </View>
          </View>
          <View style={styles.rightContainer} >
            {
              this.props.disclosure &&
              <Icon
                size={18}
                name="check"
                style={[
                  styles.disclosure,
                  { color: this.props.disclosureColor }
                ]}
              />
            }
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.color.white,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: CELL_MIN_HEIGHT,
    paddingVertical: theme.padding
  },
  titleValueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    color: theme.color.black,
    flex: 1,
    marginRight: theme.margin / 1.5
  },
  subtitle: {
    marginTop: theme.margin / 2,
    fontSize: theme.font.small,
    color: theme.color.muted
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 15
  },
  icon: {
    width: theme.iconWidth,
    marginVertical: theme.margin / 2,
    marginHorizontal: theme.margin / 1.5,
    paddingLeft: theme.padding,
    textAlign: 'center',
    flex: 1
  },
  rightContainer: {
    minWidth: 15,
    alignItems: 'center',
      justifyContent: 'center'
  },
  disclosure: {
    width: theme.iconWidth * 1.5,
    marginLeft: theme.margin / 2,
    textAlign: 'center'
  }
});

export default Cell;