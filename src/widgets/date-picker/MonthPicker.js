//import type { ChangeEventParam } from '@lugia/lugia-web';
import React, { Component } from 'react';
import Widget from '../consts/index';
import ThemeProvider from '../theme-provider';
import DateInput from './DateInput';
import { getTheme } from './utils';
export default ThemeProvider(
  class MonthPicker extends Component {
    render() {
      const theme = getTheme(this.props);
      return <DateInput {...this.props} theme={theme} mode={'month'} />;
    }
  },
  Widget.MonthPicker
);
