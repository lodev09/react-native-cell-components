import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from './DatePicker';
import Cell from './Cell';

import {
  View
} from 'react-native';

class CellDatePicker extends React.Component {

  static defaultProps = {
    mode: 'datetime',
    date: new Date()
  }

  static proptTypes = {
    ...Cell.propTypes,
    onShow: PropTypes.func,
    onDateSelected: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    date: PropTypes.object,
    cancelText: PropTypes.string
  }

  handleOnDateSelected = (date) => {
    this.props.onDateSelected(date);
  }

  handleDateOnPress = () => {
    if (this.props.onPress) this.props.onPress();
    this._datePicker.open();
  }

  render() {
    return (
      <View>
        <DatePicker
          ref={component => this._datePicker = component}
          date={this.props.date}
          mode={this.props.mode}
          onDateSelected={this.handleOnDateSelected}
          cancelText={this.props.cancelText}
        />

        <Cell
          onPress={this.handleDateOnPress}
          {...this.props}
        />
      </View>
    );
  }
}

export default CellDatePicker;
