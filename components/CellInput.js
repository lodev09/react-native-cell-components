import React from 'react';

import Cell from './Cell';
import theme from '../lib/theme';

import {
  View,
  StyleSheet,
  TextInput
} from 'react-native';

class CellInput extends React.Component {

  static propTypes = {

  }

  renderTextInput() {
    return (
      <TextInput
        style={styles.textInput}
        clearButtonMode="while-editing"
        selectionColor={theme.color.info}
        {...this.props}
      />
    );
  }

  render() {
    return <Cell title={this.props.title} value={this.renderTextInput()} />;
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    fontSize: theme.font.medium
  }
});

export default CellInput;