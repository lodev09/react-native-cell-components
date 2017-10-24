import React from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';
import ActionSheet from './ActionSheet';

import {
  View,
  StyleSheet
} from 'react-native';

class CellSheet extends React.Component {
  static defaultProps = {
    ...Cell.defaultProps
  }

  static propTypes = {
    ...Cell.propTypes
  }

  handleCellOnPress = () => {
    if (this.props.onPress) this.props.onPress();
    this.open();
  }

  open() {
    this._actionSheet.open();
  }

  close() {
    this._actionSheet.close();
  }

  render() {
    return (
      <View>
        <ActionSheet
          ref={component => this._actionSheet = component}
          onClose={this.props.onClose}
          onOpen={this.props.onOpen}
          mode={this.props.mode}
          cancelText={this.props.cancelText || 'Cancel'}
          title={this.props.header}
        >
           {this.props.children /* children should go here, not to the Cell */}
        </ActionSheet>

        <Cell
          {...this.props}
          onPress={this.handleCellOnPress}
        >
          {null /* set null so value prop retains. */ }
        </Cell>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default CellSheet;
