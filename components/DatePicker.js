import React from 'react';
import PropTypes from 'prop-types';

import ActionSheet, { ActionItem } from './ActionSheet';
import theme from '../lib/theme';

import {
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
  Platform,
  StyleSheet,
  View
} from 'react-native';

class DatePicker extends React.Component {
  static defaultProps = {
    date: new Date(),
    mode: 'date'
  }

  static propTypes = {
    date: PropTypes.object.isRequired,
    onDateSelected: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      date: this.props.date
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date && nextProps.date.getTime() !== this.props.date.getTime()) {
      this.setState({
        date: nextProps.date
      })
    }
  }

  async open() {
    if (theme.isIOS) {
      this._actionSheet.open();
    } else {
      if (this.props.mode === 'date') {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: this.state.date
        });

        if (action !== DatePickerAndroid.dismissedAction) {
          const date = new Date(year, month, day);

          date.setHours(this.state.date.getHours(), this.state.date.getMinutes(), this.state.date.getSeconds());
          this.handleOnDateChange(date);
        }
      } else if (this.props.mode === 'time') {
        const {action, hour, minute} = await TimePickerAndroid.open({
          hour: this.state.date.getHours(),
          minute: this.state.date.getMinutes(),
          is24Hour: false
        });

        if (action !== TimePickerAndroid.dismissedAction) {
          this.state.date.setHours(hour, minute);
          this.handleOnDateChange(this.state.date);
        }
      }

    }
  }

  handleOnDateChange = (date) => {
    this.setState({
      date
    });

    this.props.onDateSelected(date);
  }

  render() {
    return (
      theme.isIOS ?
      <ActionSheet
        ref={component => this._actionSheet = component}
        cancelText="Done"
      >
        <DatePickerIOS
          date={this.state.date}
          mode={this.props.mode}
          onDateChange={this.handleOnDateChange}
        />
      </ActionSheet> :
      <View />
    );
  }
}

export default DatePicker;
