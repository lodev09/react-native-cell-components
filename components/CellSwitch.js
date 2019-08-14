import React from 'react';

import Cell from './Cell';
import theme from '../lib/theme';

import {
  Switch
} from 'react-native';

class CellSwitch extends React.Component {

  static propTypes = {
    ...Cell.propTypes,
    ...Switch.propTypes
  }

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  handleAndroidCellOnPress = () => {
    const value = !this.state.value;
    this.setState({
      value
    }, () => {
      this.props.onValueChange && this.props.onValueChange(value);
    });
  }

  render() {
    return (
      <Cell
        icon={this.props.icon}
        title={this.props.title}
        subtitle={this.props.subtitle}
        disclosure={this.props.disclosure}
        selectable={theme.isAndroid}
        onPress={theme.isAndroid && !this.props.disabled ? this.handleAndroidCellOnPress : null}
      >
        <Switch {...this.props} value={this.state.value} />
      </Cell>
    );
  }
}

export default CellSwitch;