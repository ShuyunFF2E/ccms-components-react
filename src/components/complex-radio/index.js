import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { prefixCls } from '@utils';
import Radio from '../radio';
import Tooltip from '../tooltip';
import './index.less';

const classSelector = `${prefixCls}-complex-radio`;

export default function ComplexRadio(props) {
  const {
    imgSrc,
    title,
    content,
    textOverflowEllipsis,
    contentStyle,
    titleStyle,
    type,
    borderRadiusSize,
    className,
    ...otherProps
  } = props;

  const titleContentMode = !!(title && content && !imgSrc);
  const titleContentImgMode = !!(title && content && imgSrc);

  return (
    <Radio
      className={classNames(classSelector, {
        [`${classSelector}-title-content`]: titleContentMode,
        [`${classSelector}-img`]: titleContentImgMode,
        [`${classSelector}-disabled`]: props.disabled,
        [`${classSelector}-overflow-ellipsis`]: textOverflowEllipsis,
        [`${classSelector}-card`]: type === 'card',
        [`${classSelector}-card-disabled`]: type === 'card' && props.disabled,
        [`${classSelector}-card-checked`]: type === 'card' && props.checked,
        [`${classSelector}-radius-${borderRadiusSize}`]: true,
        [className]: !!className,
      })}
      {...otherProps}
    >
      {imgSrc && <img alt="header" src={imgSrc} />}
      <div>
        {title && <p className={`${classSelector}-title`} style={titleStyle}>{title}</p>}
        {content
          && (textOverflowEllipsis ? (
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
    </Radio>
  );
}

ComplexRadio.displayName = 'ComplexRadio';

ComplexRadio.propTypes = {
  content: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ])
    .isRequired,
  imgSrc: PropTypes.string,
  title: PropTypes.string,
  textOverflowEllipsis: PropTypes.bool,
  contentStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  value: PropTypes.node.isRequired,
  onChange: PropTypes.func,
  borderRadiusSize: PropTypes.oneOf([ 'small', 'default', 'large' ]),
};

ComplexRadio.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  content: '',
  imgSrc: '',
  title: '',
  textOverflowEllipsis: false,
  contentStyle: {},
  titleStyle: {},
  type: 'default',
  disabled: false,
  checked: false,
  onChange: () => {},
  borderRadiusSize: 'default',
};
