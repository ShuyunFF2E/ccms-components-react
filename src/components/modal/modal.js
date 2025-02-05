import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { prefixCls, getCssText, noop, sandboxSelector } from '@utils';
import ContextProvider from '@contexts/context-provider';
import { CSSTransition } from 'react-transition-group';

import Icon from '../icon';
import Button from '../button';
import './index.less';

// 获取当前document下的所有样式创建到顶层doucment上，sandboxSelector是一个简单的隔离方式
function insertRootDocumentStyleRule(doc) {
  let style = doc.querySelector(`[data-name="${sandboxSelector}"]`);

  if (style) return;

  const cssText = getCssText(`.${sandboxSelector}`);

  style = document.createElement('style');

  style.setAttribute('data-name', sandboxSelector);
  style.setAttribute('type', 'text/css');

  style.innerHTML = cssText.join('');
  doc.head.appendChild(style);
}

class Notification extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.maskRef = React.createRef();
    this.resizeObserver = null;

    this.state = {
      pageX: '',
      pageY: '',
      diffX: '',
      diffY: '',
      height: 0,
      preVisible: props.visible,
    };
  }

  static contextType = ContextProvider;

  static defaultProps = {
    visible: false,
    size: 'auto',
    modalStyle: {},
    headerStyle: {},
    bodyStyle: {},
    footerStyle: {},
    disabledOk: false,
    title: '弹窗',
    children: '',
    footer: '',
    hasFooter: true,
    showMask: true,
    okText: '确定',
    cancelText: '取消',
    okBtnOpts: {},
    cancelBtnOpts: {},
    clickMaskCanClose: true,
    showConfirmLoading: false,
    onOk: noop,
    onCancel: noop,
    onClose: noop,
    supportDrag: true,
    borderRadiusSize: 'large',
    isReverseBtn: false,
  };

  static propTypes = {
    visible: PropTypes.bool,
    size: PropTypes.string,
    modalStyle: PropTypes.object,
    headerStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    footerStyle: PropTypes.object,
    disabledOk: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.node,
    footer: PropTypes.node,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    okBtnOpts: PropTypes.object,
    cancelBtnOpts: PropTypes.object,
    hasFooter: PropTypes.bool,
    isReverseBtn: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    showMask: PropTypes.bool,
    showConfirmLoading: PropTypes.bool,
    clickMaskCanClose: PropTypes.bool,
    supportDrag: PropTypes.bool,
    borderRadiusSize: PropTypes.string,
  };

  // 组件装在完毕监听屏幕大小切换事件
  componentDidMount() {
    if (this.props.visible) {
      this.insertRootDocumentStyleRule();
      this.observeModalHeight();
    }

    this.screenChange();
    this.window.addEventListener('resize', this.screenChange);
  }

  /* eslint-disable */
  async UNSAFE_componentWillReceiveProps() {
    const { visible } = this.props;
    this.setState({
      preVisible: visible,
    });
  }
  /* eslint-disable */

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;

    if (prevVisible !== visible && visible) {
      this.screenChange();
      this.insertRootDocumentStyleRule();
      this.observeModalHeight();
    }

    if (this.modalRef) {
      this.refreshHeight();
    }
  }

  componentWillUnmount() {
    this.window.removeEventListener('resize', this.screenChange);
    this.onScrollRemove();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  get window() {
    return this.context.rootWindow;
  }

  get document() {
    return this.context.rootDocument;
  }

  get modalRef() {
    return this.ref.current;
  }

  get headerCurrent() {
    return this.headerRef.current;
  }

  get bodyCurrent() {
    return this.bodyRef.current;
  }

  get footerCurrent() {
    return this.footerRef.current;
  }

  get mask() {
    return this.maskRef.current;
  }

  observeModalHeight = () => {
    if (this.ref.current) {
      this.resizeObserver = new ResizeObserver((entries) =>
        this.screenChange()
      )
      this.resizeObserver.observe(this.ref.current);
    }
  }

  // 高度变化
  refreshHeight() {
    const { height } = this.modalRef.getBoundingClientRect();
    const { height: prevHeight } = this.state;

    if (height !== prevHeight) {
      this.setState({
        height,
      });
      this.screenChange();
    }
  }

  // 突破iframe框架创建当前文档下的样式，避免样式丢失
  insertRootDocumentStyleRule() {
    if (window !== this.window) {
      insertRootDocumentStyleRule(this.document);
    }
  }

  // 屏幕变化
  screenChange = () => {
    this.window.requestAnimationFrame(() => {
      if (this.modalRef) {
        const maskHeight = this.mask && this.mask.offsetHeight;
        const modalHeight = this.modalRef.offsetHeight;
        this.modalRef.style.top = `${(maskHeight - modalHeight) / 2}px`;
      }
    });
  };

  // 获取鼠标点击title时的坐标、title的坐标以及两者的位移
  getPosition = ({ target: titleDom, pageX, screenY }) => {
    // titleDom的坐标(视窗)
    const X = titleDom.getBoundingClientRect().left;

    // 由于Y轴出现滚动条，需要与鼠标保持一致，存储页面相对位置
    const Y = this.modalRef.offsetTop;

    // 鼠标点击的坐标(页面)
    const mouseX = pageX;
    const mouseY = screenY;

    // 鼠标点击位置与modal的位移
    const diffX = mouseX - X;
    const diffY = mouseY - Y;

    return { X, Y, mouseX, mouseY, diffX, diffY };
  };

  /**
   * 鼠标按下，注册鼠标移动事件
   * 计算鼠标按下时，指针所在位置与modal位置以及两者的差值
   * */
  onMouseDown = (evt) => {
    if (!this.props.supportDrag) {
      return;
    }
    const { diffX, diffY } = this.getPosition(evt);

    this.document.addEventListener('mousemove', this.onMouseMove);
    this.document.addEventListener('mouseup', this.onMouseUp);

    this.setState({ diffX, diffY });
  };

  // 松开鼠标
  onMouseUp = () => {
    this.document.removeEventListener('mousemove', this.onMouseMove);
    this.document.removeEventListener('mouseup', this.onMouseUp);
  };

  // 鼠标移动重新设置modal的位置
  onMouseMove = (evt) => {
    this.window.requestAnimationFrame(() => {
      const { diffX, diffY } = this.state;

      // 获取鼠标位置数据
      const position = this.getPosition(evt);
      // 计算modal应该随鼠标移动到的坐标
      const x = position.mouseX - diffX;
      const y = position.mouseY - diffY;

      // 窗口大小，结构限制，需要做调整，减去侧边栏宽度
      const { clientWidth, clientHeight } = this.document.documentElement;
      const modal = this.modalRef;

      modal.style.margin = 0;

      // 计算modal坐标的最大值
      const maxHeight = clientHeight - modal.offsetHeight;
      const maxWidth = clientWidth - modal.offsetWidth;

      // 判断得出modal的最终位置，不得超出浏览器可见窗口
      // eslint-disable-next-line no-nested-ternary
      const left = x > 0 ? (x < maxWidth ? x : maxWidth) : 0;
      // eslint-disable-next-line no-nested-ternary
      const top = y > 0 ? (y < maxHeight ? y : maxHeight) : 0;

      this.setState({ pageX: left, pageY: top });
    });

    // 阻止默认行为(拖动时文字选中)
    evt.preventDefault();
  };

  onReset = () => {
    this.setState({ pageX: '', pageY: '', diffX: '', diffY: '' });
  };

  onScrollRemove = () => {
    // 可能存在多个弹窗，所以只有当仅有1个弹窗销毁时才恢复滚动条
    if (this.document.body.querySelectorAll('.r-w_s-').length === 1) {
      this.document.body.classList.remove(`${prefixCls}-modal-no-scroll`);
    }
  };

  onScrollAdd = () => {
    const noScroll = `${prefixCls}-modal-no-scroll`;
    if (this.document.body.classList.toString().indexOf(noScroll) === -1) {
      this.document.body.classList.add(noScroll);
    }
  };

  onTransitionExited = () => {
    this.setState({
      preVisible: false,
    });
  };


  render() {
    const {
      visible,
      size,
      modalStyle,
      bodyStyle,
      footerStyle,
      headerStyle,
      disabledOk,
      className,
      outerClassName,
      isReverseBtn,
      type,
      children,
      title,
      footer,
      hasFooter,
      showMask,
      okText,
      cancelText,
      okBtnOpts,
      cancelBtnOpts,
      clickMaskCanClose,
      showConfirmLoading,
      onOk,
      onClose,
      onCancel,
      supportDrag,
      borderRadiusSize,
      infoText,
    } = this.props;

    if (!visible && !this.state.preVisible) {
      this.onScrollRemove();
      return null;
    }

    this.onScrollAdd();

    const { pageX, pageY } = this.state;

    const style = {
      ...modalStyle,
      left: pageX,
      top: pageY,
      pointerEvents: 'auto',
    };

    // 不要删除最外层的节点，虽然看似多余，但在iframe场景下至关重要
    return (
      <div className={sandboxSelector}>
        <div
          id="mask"
          ref={this.maskRef}
          className={classnames(`${prefixCls}-modal`, outerClassName, {
            'other-area-can-click': !showMask,
            [`${prefixCls}-modal-${borderRadiusSize}`]: borderRadiusSize,
          })}
        >
          {/* 遮罩层 */}

          {visible && (
            <ModalMask
              showMask={showMask}
              onClose={onClose}
              onReset={this.onReset}
              clickMaskCanClose={clickMaskCanClose}
            />
          )}

          <CSSTransition
            in={visible}
            timeout={300}
            classNames={`${prefixCls}-modal`}
            unmountOnExit
            appear
            onExited={this.onTransitionExited}
          >
            {/* 弹出框 */}
            <div
              ref={this.ref}
              style={style}
              className={classnames(
                `${prefixCls}-modal-container`,
                `${prefixCls}-modal-container-size-${size}`,
                className,
              )}
            >
              <ModalHeader
                type={type}
                style={headerStyle}
                onReset={this.onReset}
                onMouseDown={this.onMouseDown}
                onClose={onClose}
                title={title}
                supportDrag={supportDrag}
              />

              <ModalBody
                type={type}
                style={{ ...bodyStyle }}
                hasFooter={hasFooter}
              >
                {children}
              </ModalBody>

              <ModalFooter
                style={footerStyle}
                visible={visible}
                type={type}
                onOk={onOk}
                footer={footer}
                okText={okText}
                okBtnOpts={okBtnOpts}
                cancelBtnOpts={cancelBtnOpts}
                onReset={this.onReset}
                onCancel={onCancel}
                hasFooter={hasFooter}
                cancelText={cancelText}
                disabledOk={disabledOk}
                showConfirmLoading={showConfirmLoading}
                infoText={infoText}
                isReverseBtn={isReverseBtn}
              />
            </div>
          </CSSTransition>
        </div>
      </div>
    );
  }
}

function ModalMask({ onReset, showMask, onClose, clickMaskCanClose }) {
  const close = () => {
    onReset();
    onClose();
  };
  return (
    showMask && (
      <div
        className={classnames(`${prefixCls}-modal-mask`)}
        onClick={clickMaskCanClose ? close : noop}
      />
    )
  );
}

function ModalHeader({ type, title, onClose, onReset, supportDrag, ...props }) {
  const close = () => {
    onReset();
    onClose();
  };
  const selected = (e) => {
    e.stopPropagation();
  };
  return (
    type === 'modal' && (
      <header
        {...props}
        className={classnames(`${prefixCls}-modal-header`, {
          [`${prefixCls}-modal-header-drag`]: supportDrag,
        })}
      >
        <span
          className={classnames(`${prefixCls}-modal-title`)}
          onMouseDown={(event) => selected(event)}
        >
          {title}
        </span>
        <Icon
          type="close"
          className="close-icon"
          onMouseDown={(event) => selected(event)}
          onClick={close}
        />
      </header>
    )
  );
}

function ModalBody({ type, style, children, hasFooter }) {
  return (
    <section
      className={classnames(
        `${prefixCls}-modal-body ${
          type === 'modal'
            ? `${prefixCls}-modal-size`
            : `${prefixCls}-modal-confirm-size`
        } ${!hasFooter ? `${prefixCls}-modal-no-footer` : ''}`,
      )}
      style={style}
    >
      {children}
    </section>
  );
}

/**
 * @return {null}
 */
function ModalFooter({
  style,
  visible,
  type,
  footer,
  okText,
  cancelText,
  infoText,
  okBtnOpts,
  cancelBtnOpts,
  hasFooter,
  showConfirmLoading,
  isReverseBtn,
  onCancel,
  onOk,
  onReset,
  disabledOk,
}) {
  const ok = () => {
    onOk();
    if (!visible) {
      onReset();
    }
  };
  const cancel = () => {
    onReset();
    onCancel();
  };

  const footerClass = classnames(`${prefixCls}-modal-footer`, {
    [`${prefixCls}-modal-border`]: type !== 'modal',
    [`${prefixCls}-modal-footer-default`]: !(hasFooter && footer),
    [`${prefixCls}-modal-footer-reverse`]: isReverseBtn,
  });
  const confirmClass = classnames(`${prefixCls}-modal-confirm-btn`);
  if (!hasFooter) {
    return null;
  }

  if (hasFooter && footer) {
    return <footer className={footerClass}>{footer}</footer>;
  }

  if (hasFooter && type !== 'modal' && type !== 'confirm') {
    return (
      <footer style={style} className={footerClass}>
        <Button type="primary" size="large" onClick={cancel}>
          {infoText || '知道了'}
        </Button>
      </footer>
    );
  }

  return (
    <footer style={style} className={footerClass}>
      <Button
        type="secondary"
        size="large"
        disabled={showConfirmLoading}
        onClick={cancel}
        {...cancelBtnOpts}
      >
        {cancelText}
      </Button>
      <Button
        type="primary"
        size="large"
        className={confirmClass}
        disabled={showConfirmLoading || disabledOk}
        onClick={ok}
        loading={showConfirmLoading}
        {...okBtnOpts}
      >
        {okText}
      </Button>
    </footer>
  );
}

export default Notification;
