import React from 'react';

import Cell from './Cell';
import theme from '../lib/theme';

import {
  Switch
} from 'react-native';

class CellSwitch extends React.Component {

  render() {
    return (
      <Cell
        icon={this.props.icon}
        title={this.props.title}
        subtitle={this.props.subtitle}
        disclosure={this.props.disclosure}
      >
        <Switch {...this.props} />
      </Cell>
    );
  }
}

export default CellSwitch;