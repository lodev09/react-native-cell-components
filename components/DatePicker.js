import React from 'react';

import ActionSheet, { ActionItem } from './ActionSheet';

import {
  DatePickerIOS
} from 'react-native';

class DatePicker extends React.Component {
  static defaultProps = {
    date: new Date(),
    timeZoneOffset: -6, // CST
    mode: 'datetime'
  }

  static propTypes = {
    date: React.PropTypes.object.isRequired,
    timeZoneOffset: React.PropTypes.number,
    onDateSelected: React.PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      date: this.props.date,
      timeZoneOffset: this.props.timeZoneOffset,
      mode: this.props.mode
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
      <ActionSheet ref={component => this._actionSheet = component} >
        <DatePickerIOS
          date={this.state.date}
          mode={this.state.mode}
          // timeZoneOffsetInMinutes={this.state.timeZoneOffset * 60}
          onDateChange={this.handleOnDateChange}
        />
        <ActionItem title="Done" destructive />
      </ActionSheet>
    );
  }
}

export default DatePicker;