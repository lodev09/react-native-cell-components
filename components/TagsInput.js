import React from 'react';
import theme from '../lib/theme';

import Cell from './Cell';

import {
  View,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

class TagsInput extends React.Component {
  static defaultProps = {
    autoFocus: false,
    onChangeText: () => {},
    onRemoveTag: () => {},
    backgroundColor: theme.color.white,
    tags: [],
    renderTag: () => null
  }

  static propTypes = {
    ...View.propTypes,
    tags: React.PropTypes.array,
    autoFocus: React.PropTypes.bool,
    onChangeText: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onRemoveTag: React.PropTypes.func,
    backgroundColor: React.PropTypes.string,
    control: React.PropTypes.object,
    renderTag: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedTagIndex: null,
      text: this.props.text ? ' ' + this.props.text : ' '
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tags !== nextProps.tags) {
      this.updateSelectedTag(null);
    }

    if (this.props.text !== nextProps.text) {
      this.setState({
        text: ' ' + nextProps.text
      });
    }
  }

  focus() {
    this._textInput.focus();
  }

  blur() {
    this._textInput.blur();
  }

  updateSelectedTag(i, callback) {
    this.setState({
      selectedTagIndex: i,
      text: ' '
    }, callback);
  }

  setText(text) {
    this.setState({
      text: ' ' + text
    }, () => {
      this.handleTextInputOnChangeText(this.state.text);
    });
  }

  handleOnSelectionChange = (e) => {
    /*const { start, end } = e.nativeEvent.selection;
    if (start === 0 && end > 0) {
      this._textInput.setNativeProps({
        selection: {
          start: 1,
          end
        }
      });
    }*/
  }

  handleTextInputOnChangeText = (text) => {
    if (text.length === 0) {
      if (this.props.tags.length > 0) {
        if (this.state.selectedTagIndex === null) {
          // select right most tag when backspace is pressed
          this.updateSelectedTag(this.props.tags.length - 1);
        } else {
          // remove the selected tag instead when backspace is pressed
          const selectedTagIndex = this.state.selectedTagIndex;
          this.updateSelectedTag(null, () => {
            // trigger on change text with empty string
            // this.props.onChangeText('');
            this.props.onRemoveTag(selectedTagIndex)
          });
        }
      } else {
        this.setState({ text: ' ' })
      }
    } else {
      if (this.state.selectedTagIndex === null) {
        this.setState({ text }, () => {
          this.props.onChangeText(text.slice(1));
        });
      } else {
        this._textInput.setNativeProps({
          text: ' '
        });
      }
    }
  }

  handleTextInputOnPress = () => {
    this.updateSelectedTag(null);
    this._textInput.focus();
  }

  handleTagOnPress = (tag, i) => {
    this.updateSelectedTag(this.state.selectedTagIndex === i ? null : i);
    this._textInput.focus();
  }

  handleOnFocus = () => {
    if (this.props.onFocus) this.props.onFocus();
  }

  renderTags() {
    return this.props.tags ? this.props.tags.map((tag, i) => {
      const selected = this.state.selectedTagIndex === i;
      return (
        <TouchableWithoutFeedback onPress={(e) => this.handleTagOnPress(tag, i, e)} key={'tag-' + i} >
          <View style={[ styles.tagContainer, selected ? styles.tagContainerSelected : null ]}>
            {this.props.renderTag(tag, selected)}
          </View>
        </TouchableWithoutFeedback>
      );
    }) : null;
  }

  renderLabel = () => {
    return this.props.label && <Text style={styles.labelText} >{this.props.label}</Text>;
  }

  renderControl = () => {
    if (!this.props.control) {
      return;
    }

    return {
      ...this.props.control,
      name: this.props.control.icon
    }
  }

  render() {
    return (
      <Cell
        {...this.props}
        style={[
          styles.container,
          {
            backgroundColor: this.props.backgroundColor
          },
          this.props.style
        ]}
        icon={this.props.label ? this.renderLabel : this.props.icon}
        contentPosition="top"
        disclosure={this.renderControl()}
      >
        <View style={styles.tagViewsContainer} >
          {this.renderTags()}
          
          <View style={styles.textInputContainer} >
            <TextInput
              ref={component => this._textInput = component}
              style={styles.textInput}
              value={this.state.text}
              onChangeText={this.handleTextInputOnChangeText}
              onFocus={this.handleOnFocus}
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={theme.color.info}
              autoFocus={this.props.autoFocus}
              onSelectionChange={this.handleOnSelectionChange}
              underlineColorAndroid="transparent"
            />

            {
              this.state.selectedTagIndex !== null &&
                <TouchableWithoutFeedback onPress={this.handleTextInputOnPress} >
                  <View
                    style={[
                      styles.textInputFocus,
                      { backgroundColor: this.props.backgroundColor }
                    ]}
                  />
                </TouchableWithoutFeedback>
            }
          </View>
        </View>
      </Cell>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 48,
    backgroundColor: 'transparent'
  },
  labelText: {
    fontSize: theme.font.medium,
    fontWeight: 'bold',
    color: theme.color.muted,
    paddingVertical: theme.padding / 4
  },
  tagViewsContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center'
  },
  tagContainerSelected: {
    backgroundColor: theme.color.info,
    borderRadius: theme.radius / 2
  },
  tagContainer: {
    padding: theme.padding / 5
  },
  textInputContainer: {
    flex: 1
  },
  textInput: {
    fontSize: theme.font.medium,
    height: theme.value(20, 25),
    padding: 0
  },
  textInputFocus: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

export default TagsInput;