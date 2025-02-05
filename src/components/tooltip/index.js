import React, { Component, createElement } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ContextProvider from '@contexts/context-provider';
import { prefixCls } from '@utils';
import ToolView from './toolView';
import { CONFIG_PLACE, CONFIG_THEME } from './config';
import './index.less';

const TRIGGER_MAPPING = {
  hover: 'onMouseEnter',
  click: 'onClick',
};

class Tooltip extends Component {
  static contextType = ContextProvider;

  target = null;

  timestamp = new Date().getTime().toString();

  tipRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this.setState(
        {
          visible: true,
        },
        () => {
          this.props.onVisibleChange(this.state.visible);
        },
      );
      this.target = this.tipRef.current.firstElementChild;
    } else if (this.props.control) {
      this.target = this.tipRef.current.firstElementChild;
    }

    document.addEventListener('click', this.onClick);
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    if (prevProps.visible !== visible && visible !== this.state.visible) {
      if (visible) {
        this.showTips({ target: this.tipRef.current.firstElementChild });
      } else {
        this.closeTips();
      }
      if (this.props.control) {
        this.setState({ visible });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
  }

  get document() {
    return this.context.rootDocument;
  }

  get portal() {
    const { getContext } = this.context;
    return getContext() || this.document.body;
  }

  onClick = (evt) => {
    if (this.props.alwaysShow && this.state.visible) {
      return;
    }
    const path = evt.composedPath();
    if (
      !path
      || !path.find(
        (ele) => ele.classList
          && ele.classList.contains
          && ele.classList.contains(`${prefixCls}-tooltip`),
      )
      || this.props.closeTooltipExec(path)
    ) {
      if (!this.props.control) {
        this.setState({ visible: false }, () => {
          this.props.onVisibleChange(this.state.visible);
        });
      }
    }
  };

  getChildren() {
    const { children } = this.props;
    const __children = createElement('span', null, [ children ]);
    return __children;
  }

  getTooltipParent(element) {
    const { parentElement } = element;
    if (parentElement.getAttribute('tooltipcontainer') !== this.timestamp) {
      return this.getTooltipParent(parentElement);
    }
    return element;
  }

  showTips = ({ target }) => {
    const { mouseEnterDelay, content, visible } = this.props;

    if (this.state.visible) {
      this.closeTips();
      return;
    }

    if (content && (visible || visible === undefined)) {
      setTimeout(() => {
        this.target = this.getTooltipParent(target);
        if (!this.props.control) {
          this.setState({ visible: true }, () => {
            this.props.onVisibleChange(this.state.visible);
          });
        }
      }, mouseEnterDelay);
    }
  };

  closeTips = (event) => {
    const { mouseLeaveDelay, visible, trigger } = this.props;
    if (
      (event
        && event.relatedTarget
        && event.relatedTarget.className?.includes(`${prefixCls}-tooltip`))
      || trigger === 'click'
    ) {
      return;
    }
    if (!visible) {
      setTimeout(() => {
        if (!this.props.control) {
          this.setState({ visible: false }, () => {
            this.props.onVisibleChange(this.state.visible);
          });
        }
      }, mouseLeaveDelay);
    }
  };

  renderView() {
    const { target, closeTips } = this;

    return ReactDOM.createPortal(
      <ToolView
        {...{
          ...this.props,
          target,
          closeTips,
        }}
      />,
      this.props.containerEle || this.portal,
    );
  }

  render() {
    const { visible } = this.state;
    const { children, trigger } = this.props;

    const triggerName = TRIGGER_MAPPING[trigger] || trigger;
    const props = {
      style: { display: 'contents' },
      onMouseLeave: this.closeTips,
      [triggerName]: this.showTips,
      ref: this.tipRef,
    };

    return (
      <>
        <div {...props} tooltipcontainer={this.timestamp}>
          {typeof children !== 'object' ? this.getChildren(children) : children}
        </div>

        {visible && this.renderView()}
      </>
    );
  }
}

Tooltip.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.string,
  ]),
  mouseEnterDelay: PropTypes.number,
  mouseLeaveDelay: PropTypes.number,
  trigger: PropTypes.string,
  visible: PropTypes.bool,
  placement: PropTypes.oneOf([
    CONFIG_PLACE.auto,
    CONFIG_PLACE.top,
    `${CONFIG_PLACE.top}-${CONFIG_PLACE.left}`,
    `${CONFIG_PLACE.top}-${CONFIG_PLACE.right}`,
    CONFIG_PLACE.bottom,
    `${CONFIG_PLACE.bottom}-${CONFIG_PLACE.left}`,
    `${CONFIG_PLACE.bottom}-${CONFIG_PLACE.right}`,
    CONFIG_PLACE.left,
    `${CONFIG_PLACE.left}-${CONFIG_PLACE.top}`,
    `${CONFIG_PLACE.left}-${CONFIG_PLACE.bottom}`,
    CONFIG_PLACE.right,
    `${CONFIG_PLACE.right}-${CONFIG_PLACE.top}`,
    `${CONFIG_PLACE.right}-${CONFIG_PLACE.bottom}`,
  ]),
  theme: PropTypes.oneOf([
    CONFIG_THEME.dark,
    CONFIG_THEME.light,
    CONFIG_THEME.error,
    CONFIG_THEME.remind,
  ]),
  className: PropTypes.string,
  overlayStyle: PropTypes.object,
  closeTooltipExec: PropTypes.func,
  onVisibleChange: PropTypes.func,
  alwaysShow: PropTypes.bool,
  containerEle: PropTypes.any,
  showArrow: PropTypes.bool,
  control: PropTypes.bool,
};

Tooltip.defaultProps = {
  content: '',
  mouseEnterDelay: 1,
  mouseLeaveDelay: 1,
  trigger: 'hover',
  visible: undefined,
  placement: CONFIG_PLACE.auto,
  theme: CONFIG_THEME.dark,
  className: '',
  overlayStyle: {},
  closeTooltipExec: () => false,
  onVisibleChange: () => {},
  alwaysShow: false,
  containerEle: null,
  showArrow: true,
  control: false,
};

export default Tooltip;
