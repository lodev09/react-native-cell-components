import React from 'react';

import Cell from './Cell';
import theme from '../lib/theme';

import {
  View,
  StyleSheet,
  TextInput
} from 'react-native';

const BASE_HEIGHT = 23;

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
      rows: this.props.rows
    }
  }

  handleOnContentSizeChange = (e) => {
    const contentHeight = e.nativeEvent.contentSize.height;

    if (this.props.autoResize) {
      if ((contentHeight - contentHeight % BASE_HEIGHT) / BASE_HEIGHT < this.props.rows) {
        this.setNativeProps({
          height: contentHeight
        });
      }
    }
  }

  setNativeProps(props) {
    this._textInput.setNativeProps(props);
  }

  focus() {
    this._textInput.focus();
  }

  blur() {
    this._textInput.blur();
  }

  renderTextInput() {
    const textInputStyle = this.props.multiline &&
      {
        // paddingBottom: theme.padding,
        height: this.props.autoResize ? BASE_HEIGHT : BASE_HEIGHT * this.props.rows
      }

    return (
      <TextInput
        ref={component => this._textInput = component}
        clearButtonMode="while-editing"
        selectionColor={theme.color.info}
        {...this.props}
        style={[ styles.textInput, textInputStyle, this.props.style ]}
        onContentSizeChange={this.handleOnContentSizeChange}
        placeholder={this.props.multiline === true ? this.props.title || this.props.placeholder : this.props.placeholder}
        placeholderTextColor={theme.color.muted}
        underlineColorAndroid="transparent"
      />
    );
  }

  render() {
    return (
      <Cell
        icon={this.props.icon}
        tintColor={this.props.tintColor}
        title={!this.props.multiline && this.props.title}
        style={this.props.editable === false && styles.inputDisabled}
      >
        {this.renderTextInput()}
      </Cell>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: theme.font.medium,
    textAlign: 'left',
    flex: 1,
    height: BASE_HEIGHT,
    padding: 0
  },
  inputDisabled: {
    backgroundColor: theme.color.lightGrey
  }
});

export default CellInput;