import React from 'react';

import Cell from './Cell';

import {
  View,
  StyleSheet,
  Text
} from 'react-native';

class CellGroup extends React.Component {
  static defaultProps = {
    bordered: true
  }

  static propTypes = {
    ...View.propsTypes,
    header: React.PropTypes.any,
    footer: React.PropTypes.any,
    bordered: React.PropTypes.bool
  }

  renderChildren() {
    return React.Children.map(this.props.children, (component, i) => {
      if (React.isValidElement(component) === false) {
        return;
      }

      return (
        <View key={'cell-group-child-' + i} >
          {component}
          {
            (i < this.props.children.length - 1 || this.props.bordered) && <View style={styles.separator} />
          }
        </View>
      );
    });
  }

  renderFooter() {
    if (!this.props.footer) {
      return;
    }

    switch (this.props.footer) {
      case 'object':
        return this.props.footer;
        break;
      default:
        return (
          <View style={styles.footer} >
            {
              this.props.footer &&
              <Text style={styles.footerText} >{this.props.footer}</Text>
            }
          </View>
        );
    }
  }

  renderHeader() {
    switch (this.props.header) {
      case 'object':
        return this.props.header;
        break;
      default:
        return (
          <View style={styles.header} >
            {
              this.props.header &&
              <Text style={styles.headerText} >{this.props.header.toUpperCase()}</Text>
            }
          </View>
        );
    }
  }

  render() {
    return (
      <View
        {...this.props}
        style={[ { marginBottom: theme.margin }, this.props.style ]}
      >
        {this.renderHeader()}
        {this.props.bordered && <View style={styles.separator} />}
        {this.renderChildren()}
        {this.renderFooter()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    ...theme.separator
  },
  header: {
    paddingVertical: theme.isIOS ? theme.padding : theme.padding / 2,
    paddingHorizontal: theme.padding * 1.5
  },
  headerText: {
    color: theme.color.muted,
    fontWeight: '500',
    fontSize: theme.font.xsmall
  },
  footer: {
    paddingVertical: theme.padding,
    paddingHorizontal: theme.padding * 1.5
  },
  footerText: {
    color: theme.color.muted,
    fontSize: theme.font.xsmall
  }
});

export default CellGroup;