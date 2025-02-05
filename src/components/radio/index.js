import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { prefixCls } from '@utils';

import Group from './group';

import './index.less';

const classSelector = `${prefixCls}-radio`;

class Radio extends React.Component {
  static propTypes = {
    value: PropTypes.node.isRequired,
    checked: PropTypes.bool,
    radioStyle: PropTypes.object,
    textStyle: PropTypes.object,
    supportUnSelect: PropTypes.bool,
    desc: PropTypes.oneOfType([ PropTypes.node, PropTypes.string ]),
  };

  static defaultProps = {
    checked: false,
    radioStyle: {},
    textStyle: {},
    supportUnSelect: false,
    desc: null,
  };

  static Group = Group;

  onChangeAction(evt) {
    const { value, onChange = () => {}, disabled } = this.props;
    if (disabled) return;
    onChange(value, evt);
  }

  render() {
    const {
      checked,
      children,
      className = '',
      style,
      disabled,
      radioStyle,
      textStyle,
      desc,
      supportUnSelect,
      radioClassName,
      ...otherProps
    } = this.props;
    return (
      <div className={classnames(`${classSelector}-container`, { [radioClassName]: !!radioClassName })}>
        <label className={classnames(classSelector, { [className]: !!className })} style={style}>
          <span className={`${classSelector}-wrapper`} style={radioStyle}>
            <input
              {...otherProps}
              type="radio"
              checked={checked}
              disabled={disabled}
              className={`${classSelector}-input ${checked ? 'checked' : ''}`}
              onChange={this.onChangeAction.bind(this)}
              onClick={supportUnSelect ? this.onChangeAction.bind(this) : () => {}}
            />
            <span className={`${classSelector}-inner`} />
          </span>
          <span
            className={classnames(`${classSelector}-text`, { disabled })}
            style={textStyle}
          >
            {children}
          </span>
        </label>
        {typeof desc === 'string' ? (
          <div className={`${classSelector}-container-text`}>{desc}</div>
        ) : (
          desc
        )}
      </div>
    );
  }
}

Radio.displayName = 'Radio';
export default Radio;
