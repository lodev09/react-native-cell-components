import React from 'react';

import Cell from './Cell';
import theme from '../lib/theme';

import {
  View,
  StyleSheet,
  TextInput
} from 'react-native';

const MULTILINE_BASE_HEIGHT = 20;

class CellInput extends React.Component {
  static defaultProps = {
    rows: 1,
    autoResize: false
  }

  static propTypes = {
    ...TextInput.propTypes,
    rows: React.PropTypes.number,
    autoResize: React.PropTypes.bool
  }

  constructor(props) {
    super(props);

    this.state = {
      rows: this.props.rows,
      multiLineHeight: this.props.autoResize ? MULTILINE_BASE_HEIGHT : MULTILINE_BASE_HEIGHT * this.props.rows
    }
  }

  handleOnContentSizeChange = (e) => {
    const contentHeight = e.nativeEvent.contentSize.height;

    if (this.props.autoResize) {
      this.setState({
        multiLineHeight: contentHeight - 5
      })
    }
  }

  renderTextInput() {
    const textInputStyle = this.props.multiline ?
      {
        paddingBottom: theme.padding,
        height: Math.min(MULTILINE_BASE_HEIGHT * this.props.rows, this.state.multiLineHeight) 
      } :
      { flex: 1 };

    return (
      <TextInput
        ref={component => this._textInput = component}
        style={[ styles.textInput, textInputStyle ]}
        clearButtonMode="while-editing"
        selectionColor={theme.color.info}
        onContentSizeChange={this.handleOnContentSizeChange}
        placeholder={this.props.title || this.props.placeholder}
        {...this.props}
      />
    );
  }

  render() {
    return <Cell icon={this.props.icon} title={!this.props.multiline && this.props.title} value={this.renderTextInput()} />;
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: theme.font.medium,
    textAlign: 'left'
  }
});

export default CellInput;