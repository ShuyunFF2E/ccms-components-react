import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { prefixCls } from '@utils';
import Checkbox from '../checkbox';
import Tooltip from '../tooltip';
import './index.less';

const classSelector = `${prefixCls}-composition`;

export default function CompositionCheckbox(props) {
	const { imgSrc, title, content, textOverflowEllipsis, contentStyle, ...otherProps } = props;

	const titleContentMode = !!(title && content && !imgSrc);
	const titleContentImgMode = !!(title && content && imgSrc);

	return (
		<Checkbox
			className={classNames(classSelector, {
				[`${classSelector}-title-content`]: titleContentMode,
				[`${classSelector}-img`]: titleContentImgMode,
				[`${classSelector}-disabled`]: props.disabled,
				[`${classSelector}-overflow-ellipsis`]: textOverflowEllipsis
			})}
			{...otherProps}>
			{imgSrc && <img alt="header" src={imgSrc} />}
			<div>
				{title && <p className={`${classSelector}-title`}>{title}</p>}
				{content &&
					(textOverflowEllipsis ? (
						<Tooltip content={content}>
							<p className={`${classSelector}-content`} style={contentStyle}>
								{content}
							</p>
						</Tooltip>
					) : (
						<p className={`${classSelector}-content`} style={contentStyle}>
							{content}
						</p>
					))}
			</div>
		</Checkbox>
	);
}

CompositionCheckbox.propTypes = {
	content: PropTypes.string.isRequired,
	imgSrc: PropTypes.string,
	title: PropTypes.string,
	textOverflowEllipsis: PropTypes.bool,
	contentStyle: PropTypes.object
};

CompositionCheckbox.defaultProps = {
	imgSrc: '',
	title: '',
	textOverflowEllipsis: false,
	contentStyle: {}
};
