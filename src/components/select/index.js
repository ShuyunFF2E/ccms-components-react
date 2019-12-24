import React, { Component, Children } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import SingleSelect from './views/single-select';
import MultiSelect from './views/multi-select';
import Selected from './views/selected';
import Option from './views/option';
import { selector } from './views/common';

import { formatOptionSource } from './utils';

import './index.less';

const getSelected = (data, children) => {
	const options = Array.isArray(data) ? data : [data];
	if (options && options.length) {
		const selected = Children.map(children, child => {
			const { children: label, value } = child.props;
			return options.includes(value) ? { label, value } : null;
		});
		return selected;
	}
	return [];
}

const getOptions = (dataSource, labelKey, valueKey) => {
	return dataSource.map(v => (
		<Option value={v[valueKey]} disabled={v.disabled} key={Math.random()}>
			{v[labelKey]}
		</Option>
	));
}

class Select extends Component {

	static Option = Option;

	constructor(props) {
		super(props);

		const { open, defaultOpen, value, defaultValue, multiple } = props;
		let values;
		if (multiple) {
			values = value || defaultValue || [];
		} else {
			values = value !== null ? value : defaultValue;
		}
		const selected = getSelected(values, this.children);
		this.state = {
			open: open || defaultOpen,
			value: values,
			prevValue: values,
			selected,
			prevProps: props
		};
		this.node = React.createRef();
		this.selectedNode = React.createRef();
	}

	static getDerivedStateFromProps(props, prevState) {
		const { prevProps } = prevState;
		if (props.value !== prevProps.value) {
			const { value, children, dataSource, labelKey, valueKey } = props;
			const childs = Array.isArray(children) ? children : [children];
			const source = childs.length ? childs : getOptions(dataSource, labelKey, valueKey);
			const selected = getSelected(value, source);
			return {
				value,
				prevValue: value,
				selected,
				prevProps: props
			}
		}
		return null;
	}

	componentDidMount() {
		document.addEventListener('click', this.handleClick);
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { disabled, width, open: propOpen, searchable } = nextProps;
		const { open, value, selected } = nextState;
		const { disabled: prevDisabled, width: prevWidth, open: prevPropOpen, searchable: prevSearchable } = this.props;
		const { open: prevOpen, value: prevValue, selected: prevSelected } = this.state;
		return disabled !== prevDisabled ||
			width !== prevWidth ||
			propOpen !== prevPropOpen ||
			open !== prevOpen ||
			value !== prevValue ||
			selected !== prevSelected ||
			searchable !== prevSearchable;
	}

	componentDidUpdate() {
		const { visible } = this;
		if (visible) this.getOptionsContainer();
		if (this.optionsContainer) {
			if (visible) {
				ReactDOM.render(this.optionsNode, this.optionsContainer);
			} else {
				ReactDOM.unmountComponentAtNode(this.optionsContainer)
			}
		}
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClick);

		const { optionsContainer } = this;
		if (optionsContainer) {
			const parentEle = optionsContainer.parentElement;
			ReactDOM.unmountComponentAtNode(optionsContainer);
			if (parentEle) parentEle.removeChild(optionsContainer);
		}
	}

	get visible() {
		const { open: propOpen } = this.props;
		const { open } = this.state;
		const visible = propOpen !== null ? propOpen : open;
		return visible;
	}

	get zIndex() {
		return this.props.zIndex;
	}

	get children() {
		const { children, dataSource, labelKey, valueKey } = this.props;
		const childs = Array.isArray(children) ? children : [children];
		if (childs.length) return childs;
		return getOptions(dataSource, labelKey, valueKey);
	}

	get optionsNode() {
		const { multiple, searchable, hasSelectAll, hasConfirmButton, okBtnText, cancelBtnText,
				onSearch, emptyRender } = this.props;
		const { value } = this.state;


		if (multiple) {
			return (
				<MultiSelect
					value={value}
					dataSource={this.children}
					emptyRender={emptyRender}
					searchable={searchable}
					hasSelectAll={hasSelectAll}
					hasConfirmButton={hasConfirmButton}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okBtnText={okBtnText}
					cancelBtnText={cancelBtnText}
					onChange={this.onMultiSelectValueChange}
					onSearch={onSearch} />
			)
		}

		return (
			<SingleSelect
				value={value}
				dataSource={this.children}
				emptyRender={emptyRender}
				searchable={searchable}
				onChange={this.onSimpleOptionChange}
				onSearch={onSearch} />
		)
	}

	get selectedContainer() {
		return this.selectedNode.current.ref.current;
	}

	get popupContainer() {
		return this.props.getPopupContainer(this.selectedContainer);
	}

	setDefaultSelected(data) {
		const { children } = this;
		const selected = getSelected(data, children);
		this.setState({ selected });
	}

	getOptionsNodePosition() {
		const selectedNodePosition = this.selectedContainer.getBoundingClientRect();
		const { height, width } = selectedNodePosition;
		if (this.popupContainer === document.body) {
			const nodePosition = this.node.current.getBoundingClientRect();
			const { left, top } = nodePosition;
			return [ left, top + height, width ];
		}
		const { offsetLeft, offsetTop } = this.selectedContainer;
		return [ offsetLeft, offsetTop + height, width ];
	}

	getOptionsContainer() {
		if (!this.optionsContainer) {
			this.optionsContainer = document.createElement('div');
			this.optionsContainer.classList.add(`${selector}-option-container`);
			this.popupContainer.appendChild(this.optionsContainer);
		}
		const { optionsContainer } = this;
		const [ left, top, width ] = this.getOptionsNodePosition();
		optionsContainer.style.position = 'absolute';
		optionsContainer.style.top = `${top}px`;
		optionsContainer.style.left = `${left}px`;
		optionsContainer.style.minWidth = `${width}px`;
		return optionsContainer;
	}

	handleClick = e => {
		const { open, prevValue } = this.state;
		const isClickSelect = this.node.current.contains(e.target) || (this.optionsContainer && this.optionsContainer.contains(e.target));
		if (!isClickSelect && open) {
			const { onSelectClose, open: propOpen, hasConfirmButton } = this.props;
			onSelectClose();
			if (hasConfirmButton) this.onMultiOptionChange(prevValue);
			if (propOpen === null) this.setState({ open: false });
		};
	}

	handleSelect = () => {
		const { open } = this.state;
		const { onSelectOpen, onSelectClose, open: propOpen } = this.props;
		if (open) {
			onSelectClose();
		} else {
			onSelectOpen();
		}
		if (propOpen === null) this.setState({ open: !open });
	}

	onClickSelected = () => {
		const { disabled } = this.props;
		if (disabled) {
			return;
		}

		this.handleSelect();
	}

	onClickOption = (selected, value) => {
		this.setState({ selected, value });
		this.handleSelect();
	}

	onSimpleOptionChange = data => {
		const { labelInValue, onChange } = this.props;
		const option = formatOptionSource(data);
		const selectValue = option[0].value;
		const checkedValue = labelInValue ? option[0] : selectValue;
		this.onClickOption(option, selectValue);
		onChange(checkedValue);
	}

	onMultiOptionChange = data => {
		const { children } = this;
		const { labelInValue } = this.props;
		const options = Children.map(children, child => {
			const { children: label, value } = child.props;
			return data.includes(value) ? { label, value } : null;
		});
		const values = options.map(v => v.value);
		this.setState({
			selected: options,
			value: values
		});
		return labelInValue ? options : values;
	}

	onMultiSelectValueChange = data => {
		const { onMultiOptionChange, props: { hasConfirmButton, onChange } } = this;
		const checkedValue = onMultiOptionChange(data);
		if (!hasConfirmButton) onChange(checkedValue);
	}

	onClearSelected = e => {
		e.preventDefault();
		e.stopPropagation();
		const { multiple } = this.props;
		const value = multiple ? [] : '';
		this.setState({
			selected: [],
			value,
			prevValue: value
		});
	}

	handleOk = () => {
		const { handleSelect, props: { labelInValue, onOk }, state: { selected, value } } = this;
		const result = labelInValue ? selected : value;
		this.setState({
			prevValue: value
		});
		onOk(result);
		handleSelect();
	};

	handleCancel = () => {
		const { onMultiOptionChange, handleSelect, props: { onCancel }, state: { prevValue } } = this;
		onMultiOptionChange(prevValue);
		onCancel();
		handleSelect();
	}

	render() {
		const { placeholder, disabled, allowClear, style, className } = this.props;
		const { selected, open } = this.state;
		const classNames = classnames(`${selector}`, { [`${selector}-open`]: open }, className);

		return (
			<div className={`${classNames}`} style={style} ref={this.node}>
				{/* 已选显示区域 */}
				<Selected
					ref={this.selectedNode}
					onClick={this.onClickSelected}
					onClear={this.onClearSelected}
					open={open}
					allowClear={allowClear}
					placeholder={placeholder}
					dataSource={selected}
					disabled={disabled} />
			</div>
		);
	}
}

Select.propTypes = {
	multiple: PropTypes.bool,
	allowClear: PropTypes.bool,
	defaultOpen: PropTypes.bool,
	open: PropTypes.bool,
	disabled: PropTypes.bool,
	placeholder: PropTypes.string,
	dataSource: PropTypes.array,
	labelKey: PropTypes.string,
	valueKey: PropTypes.string,
	width: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	searchable: PropTypes.bool,
	emptyRender: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node
	]),
	defaultValue: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.array
	]),
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.array
	]),
	labelInValue: PropTypes.bool,
	hasSelectAll: PropTypes.bool,
	hasConfirmButton: PropTypes.bool,
	okBtnText: PropTypes.string,
	cancelBtnText: PropTypes.string,
	className: PropTypes.string,
	zIndex: PropTypes.number,
	children: PropTypes.node.isRequired,
	getPopupContainer: PropTypes.func,
	onChange: PropTypes.func,
	onSearch: PropTypes.func,
	onSelectOpen: PropTypes.func,
	onSelectClose: PropTypes.func,
	onOk: PropTypes.func,
	onCancel: PropTypes.func
};

Select.defaultProps = {
	multiple: false,
	allowClear: false,
	defaultOpen: false,
	open: null,
	disabled: false,
	placeholder: '',
	dataSource: [],
	labelKey: 'label',
	valueKey: 'value',
	children: [],
	width: 'auto',
	searchable: false,
	emptyRender: '暂时没有数据',
	defaultValue: '',
	value: null,
	labelInValue: false,
	hasSelectAll: false,
	hasConfirmButton: false,
	okBtnText: '确认',
	cancelBtnText: '取消',
	className: '',
	getPopupContainer: triggerNode => triggerNode.parentElement,
	onChange: () => {},
	onSearch: () => {},
	onSelectOpen: () => {},
	onSelectClose: () => {},
	onOk: () => {},
	onCancel: () => {}
};

export default Select;
