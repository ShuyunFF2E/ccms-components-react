/* eslint-disable */
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop, prefixCls } from '@utils';

import FormContext from './context';
import Explain from './explain';
import RenderChildren from './render-children';
import { LAYOUT_TYPES, findFieldsName, getNamesByNode, findDestroyedFields } from './constants';

const MAX_COL = 24;

export default class FormItem extends Component {
	static contextType = FormContext;

	static propTypes = {
		help: PropTypes.node,
		label: PropTypes.node,
		htmlFor: PropTypes.string,
		required: PropTypes.bool,
		className: PropTypes.string,
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
		help: null,
		label: '',
		className: '',
		htmlFor: undefined,
		required: undefined,
		labelCol: undefined,
		wrapperCol: undefined,
		children: null
	};

	wrapperRef = React.createRef();

	getSnapshotBeforeUpdate() {
		return getNamesByNode(this.wrapperRef.current);
	}

	componentDidUpdate(_, __, snapshotNames) {
		const _names = getNamesByNode(this.wrapperRef.current);
		const names = findDestroyedFields(snapshotNames, _names);

		if (names.length > 0) {
			this.destructionExpiredFields(names);
		}
	}

	componentWillUnmount() {
		this.destructionExpiredFields();
	}

	destructionExpiredFields(names = this.dataFields) {
		const { field } = this;

		// 如果设置了校验规则，则重置并删除
		if (field && field.remove && names && names.length) {
			field.remove(names);
		}
	}

	get labelColSpan() {
		const { labelCol: formLabelCol, layout } = this.context;
		const { labelCol = formLabelCol } = this.props;
		const { span = layout === LAYOUT_TYPES.HORIZONTAL ? 3 : undefined } = labelCol;

		return span;
	}

	get field() {
		return this.context.field;
	}

	get fieldsMeta() {
		if (this.field && this.field.fieldsMeta) {
			return this.field.fieldsMeta;
		}
		return null;
	}

	get dataFields() {
		const {
			field,
			props: { children }
		} = this;
		const fieldsName = findFieldsName(children);

		if (field && field.fieldsMeta && fieldsName.length) {
			return fieldsName;
		}

		return null;
	}

	get required() {
		const {
			fieldsMeta,
			dataFields,
			props: { required }
		} = this;

		if (required !== undefined) {
			return required;
		}

		if (fieldsMeta && dataFields && dataFields.length) {
			const _dataFields = [...dataFields];
			let _required = false;

			while (_dataFields.length > 0 && !required) {
				const dataField = _dataFields.shift();
				const { rules = [] } = fieldsMeta[dataField];

				_required = rules.some(rule => rule.required);
			}

			return _required;
		}

		return false;
	}

	renderLabel() {
		const { labelColSpan, required } = this;
		const { colon, layout, labelCol: formLabelCol } = this.context;
		const { label, htmlFor, labelCol = formLabelCol } = this.props;
		const { offset } = labelCol;

		const labelAttrs = {
			htmlFor,
			required,
			className: classnames(`${prefixCls}-form-item-label`, {
				'has-colon': colon,
				[`col-${labelColSpan}`]: labelColSpan !== undefined && layout !== LAYOUT_TYPES.VERTICAL,
				[`col-offset-${offset}`]: offset !== undefined
			})
		};

		return label && <label {...labelAttrs}>{label}</label>;
	}

	renderWrapper() {
		const { labelColSpan } = this;
		const { wrapperCol: formWrapperCol, layout } = this.context;
		const { children, help, wrapperCol = formWrapperCol } = this.props;
		const { span = labelColSpan !== undefined ? MAX_COL - labelColSpan : undefined, offset } = wrapperCol;

		const wrapperAttrs = {
			className: classnames(`${prefixCls}-form-item-wrapper`, {
				[`col-${span}`]: span !== undefined && layout !== LAYOUT_TYPES.VERTICAL,
				[`col-offset-${offset}`]: offset !== undefined
			})
		};

		return (
			<div ref={this.wrapperRef} {...wrapperAttrs}>
				<RenderChildren field={this.field}>{children}</RenderChildren>
				<Explain>{help}</Explain>
			</div>
		);
	}

	render() {
		const { layout, labelAlign } = this.context;
		const {
			props: { className }
		} = this;

		return (
			<div className={classnames(`${prefixCls}-form-item`, layout, labelAlign, className)}>
				{this.renderLabel()}
				{this.renderWrapper()}
			</div>
		);
	}
}
