import React from 'react';

import Cell from './Cell';
import theme from '../lib/theme';

// slider is deprecated, will move to @react-native-community/slider package in the future
import {
  Slider,
  View,
  Text,
  StyleSheet
} from 'react-native';

class CellSlider extends React.Component {

  render() {
    return (
      <Cell
        icon={this.props.icon}
        title={this.props.title}
        subtitle={this.props.subtitle}
        disclosure={this.props.disclosure}
        selectable={false}
      >
        <View style={styles.container}>
          <Slider style={{ flex: 1 }} {...this.props} />
        </View>
      </Cell>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
});

export default CellSlider;