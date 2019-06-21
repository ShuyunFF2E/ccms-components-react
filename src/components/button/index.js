import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.less';

function ButtonGroup({ block, children, ...props }) {
	return (
		<div className="button-group">
			{
				Children.map(children, child => (
					cloneElement(child, {
						...child.props,
						...props
					})
				))
			}
		</div>
	);
}

class Button extends React.PureComponent {

	static propTypes = {
		type: PropTypes.string,
		size: PropTypes.string,
		href: PropTypes.string,
		block: PropTypes.bool,
		target: PropTypes.string,
		htmlType: PropTypes.string,
		children: PropTypes.node.isRequired,
		className: PropTypes.string
	};

	static defaultProps = {
		size: 'default',
		type: 'normal',
		href: '',
		block: false,
		target: '',
		className: '',
		htmlType: 'button'
	};

	static Group = ButtonGroup;

	render() {
		const {
			// a link
			href, target,
			// custom attr
			size, type, block,
			// html element
			children, className, htmlType,
			...others
		} = this.props;

		const ElementName = href ? 'a' : 'button';
		const classNames = classnames('button', {
			[type]: true,
			[size]: true,
			'block': block
		}, className);

		return (
			<ElementName
				type="button"
				className={classNames}
				{
					...{
						...others,
						href: href || undefined,
						target: href ? target : undefined,
						htmlType: href ? undefined : htmlType
					}
				}
			>
				{children}
			</ElementName>
		);
	}
}

export default Button;
