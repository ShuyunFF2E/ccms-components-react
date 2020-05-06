import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop, prefixCls } from '@utils';

import Icon from '../icon';

import {
	isInvalid,
	isInvalidNumber,
	isNotCompleteNumber,
	fixDoubleOperation,
	getCurrentValue,
	getCurrentPrecision,
	getValueByBlank,
	getMax,
	getMin
} from './util';

import './index.less';

const selector = `${prefixCls}-input-number`;

class InputNumber extends Component {
	constructor() {
		super();

		this.state = {
			currentValue: '',
			upButtonEnabled: true,
			downButtonEnabled: true,
			focused: false
		};
	}

	componentDidMount() {
		const { min, max, value, defaultValue, precision, step } = this.props;
		let _value = value;
		// 获取默认value
		const number = parseFloat(defaultValue);
		_value = value || (Number.isNaN(number) ? '' : getCurrentValue(number, min, max, getCurrentPrecision(number, precision, step)));

		this.setState({
			currentValue: _value
		});

		this.isControlled = value !== undefined;
	}

	componentDidUpdate(prevProps, prevState) {
		const { value, min, max, precision } = this.props;

		if (prevProps.value !== value || prevProps.min !== min || prevProps.max !== max || prevProps.precision !== precision) {
			this.setIsControlled(value !== undefined);
			this.updateCurrentValue();
		}

		if (this.state.currentValue !== prevState.currentValue) {
			this.updateBtnStatus();
		}
	}

	updateCurrentValue() {
		this.setState({
			currentValue: this.props.value
		});
	}

	updateBtnStatus() {
		const { currentValue } = this.state;
		const { min, max } = this.props;
		const isInvalided = isInvalid(currentValue);
		const isUpEnabled = isInvalided || getMax(currentValue, max).lessMax;
		const isDownEnabled = isInvalided || getMin(currentValue, min).greaterMin;

		this.setState({
			upButtonEnabled: isUpEnabled,
			downButtonEnabled: isDownEnabled
		});
	}

	setIsControlled(value) {
		this.isControlled = value;
	}

	handlePlus = () => {
		if (this.state.upButtonEnabled) {
			this.handlePlusMinus(true);
		}
	};

	handleMinus = () => {
		if (this.state.downButtonEnabled) {
			this.handlePlusMinus(false);
		}
	};

	handleFocus = () => {
		this.setState({
			focused: true
		});
		this.props.onFocus();
	};

	handleBlur = event => {
		const { min, max, precision, onBlur, onChange } = this.props;
		const targetValue = event.target.value.trim();
		const val = getCurrentValue(targetValue, min, max, precision);
		const _val = isInvalidNumber(String(val)) ? val : Number(val);

		this.setState({
			focused: false,
			currentValue: _val
		});

		onBlur(_val);
		onChange(_val);
	};

	handleChange = event => {
		const targetValue = event.target.value.trim().replace(/[^\-?\d.]/g, '');
		const _targetValue = isNotCompleteNumber(targetValue) ? targetValue : String(targetValue);

		this.setState({
			currentValue: _targetValue
		});
		this.props.onChange(_targetValue);
	};

	handlePlusMinus(isPlus) {
		const { min, max, precision, step, onChange } = this.props;
		const { currentValue } = this.state;

		let val = currentValue;
		if (this.isControlled) {
			if (!isInvalid(currentValue)) {
				// 删除值 & 初始
				const _val = fixDoubleOperation(Number(currentValue), Number(isPlus ? step : -1 * step));
				val = getCurrentValue(_val, min, max, getCurrentPrecision(_val, precision, step));
			} else {
				val = getValueByBlank(min, max, step);
			}
		} else {
			if (!isInvalid(currentValue)) {
				// 有value
				const _val = fixDoubleOperation(Number(currentValue), Number(isPlus ? step : -1 * step));
				const tempValue = getCurrentValue(_val, min, max, getCurrentPrecision(_val, precision, step));
				if (isPlus) {
					// 加
					if (getMax(currentValue, max).lessEqualMax) {
						val = tempValue;
					}
				} else if (getMin(currentValue, min).greaterEqualMin) {
					val = tempValue;
				}
			} else {
				val = getValueByBlank(min, max, step);
			}

			this.setState({
				currentValue: val
			});
		}
		if (!isInvalid(val)) {
			val = Number(val);
		}
		onChange(val);
	}

	renderStep() {
		const { noStep } = this.props;
		const { upButtonEnabled, downButtonEnabled } = this.state;

		const upBtnClass = classnames(`${selector}-handler ${selector}-handler-up`, {
			[`${selector}-handler-disabled`]: !upButtonEnabled
		});
		const downBtnClass = classnames(`${selector}-handler ${selector}-handler-down`, {
			[`${selector}-handler-disabled`]: !downButtonEnabled
		});

		return (
			!noStep && (
				<div className={`${selector}-handler-wrap`}>
					<span className={upBtnClass} onClick={this.handlePlus}>
						<Icon type="up" className={`${selector}-handler-up-icon`} />
					</span>
					<span className={downBtnClass} onClick={this.handleMinus}>
						<Icon type="down" className={`${selector}-handler-down-icon`} />
					</span>
				</div>
			)
		);
	}

	renderInput() {
		const { min, max, step, disabled, placeholder } = this.props;

		const { currentValue } = this.state;

		return (
			<div className={`${selector}-handler-input`}>
				<input
					className={`${selector}-input`}
					min={min}
					max={max}
					step={step}
					onFocus={this.handleFocus}
					onChange={this.handleChange}
					onBlur={this.handleBlur}
					disabled={disabled}
					value={currentValue}
					placeholder={placeholder}
				/>
			</div>
		);
	}

	render() {
		const { size, disabled, className, style } = this.props;

		const { focused } = this.state;

		const compClass = classnames(`${selector} ${size} ${className}`, {
			[`${selector}-disabled`]: disabled,
			[`${selector}-focused`]: focused
		});

		return (
			<div className={compClass} style={style}>
				{this.renderStep()}
				{this.renderInput()}
			</div>
		);
	}
}

InputNumber.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	placeholder: PropTypes.string,
	size: PropTypes.oneOf(['small', 'default', 'large']),
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number,
	noStep: PropTypes.bool,
	precision: PropTypes.number,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func
};

InputNumber.defaultProps = {
	style: undefined,
	defaultValue: undefined,
	precision: undefined,
	value: undefined,
	className: '',
	min: -Infinity,
	max: Infinity,
	size: 'default',
	placeholder: '请输入...',
	step: 1,
	noStep: false,
	disabled: false,
	onChange: noop,
	onBlur: noop,
	onFocus: noop
};

export default InputNumber;
