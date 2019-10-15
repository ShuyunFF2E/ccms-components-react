import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FormItem from './form-item';
import FormContext from './context';
import { LAYOUT_TYPES, LABEL_ALIGN } from './constants';

import './index.less';

export default class Form extends Component {
	static propTypes = {
		field: PropTypes.object,
		colon: PropTypes.bool,
		layout: PropTypes.oneOf(Object.values(LAYOUT_TYPES)),
		labelAlign: PropTypes.oneOf(Object.values(LABEL_ALIGN)),
		labelCol: PropTypes.shape({
			span: PropTypes.number,
			offset: PropTypes.number
		}),
		wrapperCol: PropTypes.shape({
			span: PropTypes.number,
			offset: PropTypes.number
		}),
		children: PropTypes.any
	};

	static defaultProps = {
		layout: LAYOUT_TYPES.VERTICAL,
		labelAlign: LABEL_ALIGN.RIGHT,
		colon: true,
		field: {},
		labelCol: {},
		wrapperCol: {},
		children: null
	};

	static Item = FormItem;

	render() {
		const { children, colon, field, layout, labelCol, wrapperCol, labelAlign, ...others } = this.props;
		const classNames = classnames('form');

		return (
			<FormContext.Provider value={{ colon, field, layout, labelAlign, labelCol, wrapperCol }}>
				<form {...others} className={classNames}>
					{children}
				</form>
			</FormContext.Provider>
		);
	}
}
