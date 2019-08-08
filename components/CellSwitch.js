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

  render() {
    return (
      <Cell
        icon={this.props.icon}
        title={this.props.title}
        subtitle={this.props.subtitle}
        disclosure={this.props.disclosure}
        selectable={theme.isAndroid}
        onPress={theme.isAndroid ? this.props.onValueChange : null}
      >
        <Switch {...this.props} />
      </Cell>
    );
  }
}

export default CellSwitch;