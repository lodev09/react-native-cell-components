import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import theme from '../lib/theme';

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
    tags: []
  }

  static propTypes = {
    ...View.propTypes,
    tags: React.PropTypes.array,
    autoFocus: React.PropTypes.bool,
    onChangeText: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onRemoveTag: React.PropTypes.func,
    backgroundColor: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedTagIndex: null,
      text: this.props.text ? ' ' + this.props.text : ' '
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.tags.every((tag, i) => tag === nextProps.tags[i]) || this.props.tags.length !== nextProps.tags.length) {
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
      this.setState({ text }, () => {
        // don't trigger change if selected index is not null
        if (this.state.selectedTagIndex === null)
          this.props.onChangeText(text.slice(1));
      });
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
            <Text style={ [styles.tag, selected ? styles.tagSelected : null ]} >{tag},</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }) : null;
  }

  render() {
    return (
      <View
        {...this.props}
        style={[
          styles.container,
          { backgroundColor: this.props.backgroundColor },
          this.props.style
        ]}
      >
        {this.props.label && <Text style={styles.labelText} >{this.props.label}</Text>}
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
    
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.padding,
    backgroundColor: 'transparent'
  },
  labelText: {
    fontSize: theme.font.small,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.color.muted,
    paddingVertical: theme.padding / 2,
    paddingRight: theme.padding / 2
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
    padding: theme.padding / 3
  },
  tagSelected: {
    color: theme.color.white,
  },
  tag: {
    color: theme.color.info,
    fontSize: theme.font.medium
  },
  textInputContainer: {
    flex: 1
  },
  textInput: {
    fontSize: theme.font.medium,
    height: 22
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