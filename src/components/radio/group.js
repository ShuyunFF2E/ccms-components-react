import React, {
  Children,
  cloneElement,
  useState,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop, prefixCls } from '@utils';

const classSelector = `${prefixCls}-radio`;

export default function Group(props) {
  const {
    children,
    defaultValue,
    value,
    onChange,
    disabled,
    horizontal,
    vertical,
    style,
    supportUnSelect,
    className,
  } = props;
  const [ currentValue, setCurrentValue ] = useState(defaultValue);

  useEffect(() => {
    setCurrentValue(value === undefined ? defaultValue : value);
  }, [ value ]);

  function renderChild(childs) {
    return Children.map(childs, (child) => {
      // 子元素有可能为一个表达式，直接返回了false或者null
      if (
        child
        && child.type
        && [ 'Radio', 'ComplexRadio' ].includes(child.type.displayName)
      ) {
        return cloneElement(child, {
          disabled: disabled || child.props.disabled,
          checked: child.props.value === currentValue,
          supportUnSelect,
          onChange(val, evt) {
            setCurrentValue(val);
            onChange(val, evt);
          },
        });
      }

      if (child && child.props && child.props.children) {
        return cloneElement(child, {
          ...child.props,
          children: renderChild(child.props.children),
        });
      }
      return child;
    });
  }

  const radios = useMemo(
    () => renderChild(children),
    [ currentValue, disabled, children ],
  );

  return (
    <span
      style={style}
      className={classnames(`${classSelector}-group`, { horizontal, vertical, [className]: !!className })}
    >
      {radios}
    </span>
  );
}

Group.propTypes = {
  defaultValue: PropTypes.node,
  value: PropTypes.node,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  supportUnSelect: PropTypes.bool,
  className: PropTypes.string,
};

Group.defaultProps = {
  defaultValue: undefined,
  value: undefined,
  onChange: noop,
  disabled: false,
  style: {},
  supportUnSelect: false,
  className: undefined,
};
