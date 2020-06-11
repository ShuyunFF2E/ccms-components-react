import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convert } from '../utils';
import { enumObj } from '../constant';
import Picker from '../common/picker';

class MonthDayPicker extends Component {
	formatValue = ({ month, day }) => {
		return convert({ month, day }, this.props.format);
	};

	render() {
		return <Picker {...this.props} tempMode={enumObj.MONTH_DAY_MODEL} height={259} formatValue={this.formatValue} />;
	}
}

MonthDayPicker.propTypes = {
	format: PropTypes.string,
	placeholder: PropTypes.string
};

MonthDayPicker.defaultProps = {
	format: 'MM/DD',
	placeholder: '请选择月日'
};

export default MonthDayPicker;
