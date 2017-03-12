import React from 'react';

import ActionSheet, { ActionItem } from './ActionSheet';
import theme from '../lib/theme';

import {
  DatePickerIOS,
  Platform,
  StyleSheet
} from 'react-native';

class DatePicker extends React.Component {
  static defaultProps = {
    date: new Date(),
    mode: 'datetime'
  }

  static propTypes = {
    date: React.PropTypes.object.isRequired,
    onDateSelected: React.PropTypes.func
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

  open() {
    // for ios, we use actionsheet
    this._actionSheet.open();
  }

  handleOnDateChange = (date) => {
    this.setState({
      date
    });

    this.props.onDateSelected(date);
  }

  render() {
    return (
      <ActionSheet
        ref={component => this._actionSheet = component}
        cancelText="Done"
      >

        {
          Platform.OS === 'ios' &&
          <DatePickerIOS
            date={this.state.date}
            mode={this.props.mode}
            onDateChange={this.handleOnDateChange}
          />
        }

      </ActionSheet>
    );
  }
}

export default DatePicker;