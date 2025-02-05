/* eslint-disable */
import React, { Component, createRef } from 'react';
import RcTable from 'rc-table';
import classnames from 'classnames';
import ReactDragListView from 'react-drag-listview';
import { noop, prefixCls } from '@utils';
import 'react-resizable/css/styles.css';
import {
  getDataSource,
  getDataSourceWithDelay,
  isSomeChecked,
  isEveryChecked,
  traverseTree,
  getLeafNodes,
  getConfig,
  isFirefox,
  debounce,
  hasCustomScroll,
  getBtnNum, getScrollbarWidth, setConfig, isWindows,
} from './util';
import {
  DRAG_ICON_SELECTOR,
  DRAG_SELECTOR,
  NUMBER,
  tablePrefixCls,
} from './constant';
import getExpandableConfig from './js/expend';
import ResizableTitle from './js/resizableTitle';
import Pagination from '../pagination';
import Icon from '../icon';
import Loading from '../loading';
import emptyImg from '../../assets/images/empty.png';
import './css/basic.less';
import './css/business.less';
import Column from './js/column';
import RowTooltip from './js/rowTooltip';
import { defaultProps, propTypes } from './js/propType';
import ColumnTpl from './columnTpl';
import NumberTpl from './columnTpl/number';
import TimeTpl from './columnTpl/time';
import TimeRangeTpl from './columnTpl/timeRange';
import TextTpl from './columnTpl/text';
import MultiTextTpl from './columnTpl/multiText';
import LinkTpl from './columnTpl/link';
import MultiLinkTpl from './columnTpl/multiLink';
import TagTpl from './columnTpl/tag';
import ColumnConfig from './js/columnConfig';

class CTable extends Component {
  ref = createRef();

  tableRef = createRef();

  defaultPageOpts = {
    pageNum: 1,
    pageSize: 10,
    showQuickJumper: true,
    showPageSizeOptions: true,
    pageSizeOptions: [10, 20, 50, 100],
  };

  leafNodesMap = {};

  getDataSource = this.props.isDelay ? getDataSourceWithDelay : getDataSource;

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columnData: this.resolveColumn(this.props.columnData),
      originColumnData: this.resolveOriginColumn(this.props.columnData),
      originConfigColumnData: this.resolveOriginColumn(this.props.columnData),
      footerHeight: this.props.footerHeight || 0,
      expandIconColumnIndex: this.props.expandIconColumnIndex,
      pageOpts: {
        ...this.defaultPageOpts,
        ...this.props.pageOpts,
        pageNum: this.props.pageOpts.current || this.defaultPageOpts.pageNum,
      },
      selectedNodeList: this.props.checkedData,
      isLoading: false,
      filterValue: [],
      sortParams: {},
      // columnConfigStyle: {},
      lineHeightFilter: false,
    };
    this.column = new Column(this);
  }

  componentDidMount() {
    this.hasCustomScroll = hasCustomScroll(this.props.useRootWindow);
    if (
      (this.props.supportExpend || this.props.supportTree) &&
      !this.props.rowKey
    ) {
      console.warn('使用展开行功能或者树状表格功能请指定 rowKey');
    }
    // if (this.props.supportMemory && !this.props.tableId) {
    //   console.warn('请设置 tableId');
    // }
    if (this.props.footerTpl() && this.props.footerHeight === undefined) {
      console.warn('请设置 footerHeight');
    }
    this.props.onLoadGridBefore(this.state.pageOpts);
    this.loadData((res) => {
      this.init();
      this.props.onLoadGridAfter(res);
    });

    if (
      this.props.columnData.find((c) => c.minWidth) &&
      !this.props.supportResizeColumn
    ) {
      window.addEventListener('resize', this.onResize());
    }

    // this.setColumnConfigStyle();
  }

  componentDidUpdate(prevProps) {
    if (
      typeof prevProps.ajaxData === 'object' &&
      this.props.ajaxData !== prevProps.ajaxData
    ) {
      this.loadData((res) => {
        if (!Object.keys(this.leafNodesMap || {}).length) {
          this.init();
          this.props.onLoadGridAfter(res);
        }
      });
    }
    if (this.props.checkedData !== prevProps.checkedData) {
      this.init();
    }
    if (this.props.isDelay !== prevProps.isDelay) {
      this.getDataSource = this.props.isDelay
        ? getDataSourceWithDelay
        : getDataSource;
    }
    if (
      JSON.stringify(this.props.pageOpts) !== JSON.stringify(prevProps.pageOpts)
    ) {
      this.setState({
        pageOpts: {
          ...this.state.pageOpts,
          ...this.props.pageOpts,
          pageNum: this.props.pageOpts.current || this.defaultPageOpts.pageNum,
        },
      });
    }
    if (
      this.props.watchColumnData &&
      this.props.columnData !== prevProps.columnData
    ) {
      this.setColumn(this.props.columnData);
    }
    if (
      this.props.defaultShowColumns !== prevProps.defaultShowColumns ||
      this.props.disabledConfigColumns !== prevProps.disabledConfigColumns ||
      this.props.hideConfigColumns !== prevProps.hideConfigColumns
    ) {
      this.setColumn(this.props.columnData);
    }
  }

  componentWillUnmount() {
    if (
      this.props.columnData.find((c) => c.minWidth) &&
      !this.props.supportResizeColumn
    ) {
      window.removeEventListener('resize', this.onResize());
    }
  }

  hasScroll = () => {
    const bodyEle = this.ref.current.querySelector(`.${tablePrefixCls}-body`);
    const tableEle = this.ref.current.querySelector(
      `.${tablePrefixCls}-body table`,
    );
    return tableEle?.clientHeight > bodyEle?.clientHeight;
  };

  resolveColumn = (columnData) => {
    const { defaultShowColumns, hideConfigColumns } = this.props;
    return columnData.map((item) => {
      const align = item.type === NUMBER ? 'right' : item.align;
      const btnNum = getBtnNum(item);
      const colClassName =
        align === 'right' && btnNum > 0 ? `padding-${btnNum}` : '';
      const show = defaultShowColumns?.includes(item.dataIndex) || !defaultShowColumns?.length || hideConfigColumns?.includes(item.dataIndex);
      const column = {
        render: (val, row) => <ColumnTpl value={val} row={row} {...item} />,
        ...item,
        show,
        columnChecked: show,
        align,
        className: item.className
          ? `${item.className} ${colClassName}`
          : colClassName,
      };
      if (!item.dataIndex && !item.render) {
        Object.assign(column, { render: () => '' });
      }
      return column;
    });
  };

  resolveOriginColumn = (columnData) => {
    // return (
    //   (this.props.supportMemory && getConfig(this.props.tableId)) ||
    //   this.resolveColumn(columnData)
    // );
    return this.resolveColumn(columnData);
  };

  /**
   * 加载表格数据
   * @param callback
   */
  loadData = (callback = () => {}) => {
    const { pageOpts, filterValue } = this.state;
    const {
      ajaxData,
      pageOpts: propsPageOpts,
      totalsKey,
      dataKey,
      childrenKey,
    } = this.props;
    this.setState({ isLoading: true }, async () => {
      const sortParams = {
        allSortColumns: [...this.state.columnData],
      };
      const res = await this.getDataSource(ajaxData, {
        ...pageOpts,
        filterValue,
        sortParams,
      });

      this.setState({ sortParams });

      if (childrenKey !== 'children') {
        traverseTree({
          tree: res[dataKey],
          callback: ({ node }) => {
            Object.assign(node, { children: node[childrenKey] || [] });
          },
          childrenKey: this.props.childrenKey,
        });
      }

      this.setState(
        {
          data: res[dataKey],
          pageOpts: { ...pageOpts, ...propsPageOpts, totals: res[totalsKey] },
          isLoading: false,
        },
        () => {
          callback(res);
        },
      );
    });
  };

  /**
   * 初始化已选数据、高度等
   */
  init = () => {
    this.leafNodesMap = this.getLeafNodesMap(this.state.data);
    this.setCheckedData();
    this.updateSelectedNodes();

    this.column.setColumnData();

    this.setHeaderStyle();
    this.setFixedStyle();
    this.setFooterHeight();
  };

  /**
   * 解决表头滚动问题（rcTable bug）
   */
  setHeaderStyle = () => {
    setTimeout(() => {
      if (isFirefox() || !this.hasCustomScroll || this.props.useRootWindow) {
        return;
      }
      if (this.ref.current) {
        const bodyEle = this.ref.current.querySelector(
          `.${tablePrefixCls}-body`,
        );
        if (bodyEle) {
          bodyEle.style.paddingRight = 0;
          bodyEle.parentElement.querySelector(
            `.${tablePrefixCls}-header colgroup col:last-child`,
          ).style.display = this.hasScroll() ? 'table-column' : 'none';
          // ).style.display = isWindows()
          //   ? this.hasScroll() ? 'table-column' : 'none'
          //   : 'none';
        }
      }
    });
  };

  /**
   * 手动计算 右侧固定列 表头的样式（由于自定义滚动条占据宽度导致，rcTable 并不兼容这种情况）
   */
  setFixedStyle = () => {
    setTimeout(() => {
      if (isFirefox() || !this.hasCustomScroll) {
        return;
      }
      const fixedColumn = this.state.columnData
        .filter((item) => item.fixed === 'right')
        .reverse();
      if (!fixedColumn.length) {
        return;
      }
      const fixedEles = Array.from(
        this.ref.current.querySelectorAll(
          `th.${tablePrefixCls}-cell-fix-right`,
        ),
      );
      if (fixedEles.length) {
        // fixedEles.pop();
        fixedEles.reverse().forEach((ele, index) => {
          if (index === 0) {
            // if (isWindows()) {
            //   Object.assign(ele.style, { right: this.hasScroll() ? getScrollbarWidth() : 0 });
            // } else {
            //   Object.assign(ele.style, { right: 0 });
            // }
            Object.assign(ele.style, { right: this.hasScroll() ? getScrollbarWidth() : 0 });
          } else {
            const right = fixedColumn.slice(0, index).reduce(
              (sum, item) => {
                // eslint-disable-next-line no-param-reassign
                sum += item.width;
                return sum;
              },
              this.hasScroll() ? Number(getScrollbarWidth().replace('px', '')) : 0,
              // isWindows()
              //   ? this.hasScroll() ? Number(getScrollbarWidth().replace('px', '')) : 0
              //   : 0,
            );
            Object.assign(ele.style, {
              right: `${right}px`,
            });
          }
        });
      }
    });
  };

  // setColumnConfigStyle = () => {
  //   setTimeout(() => {
  //     if (this.props.supportConfigColumn) {
  //       const modalEles = document.querySelectorAll(`.${prefixCls}-modal-body`);
  //       if (modalEles?.length) {
  //         const currentModalEle = modalEles[modalEles.length - 1];
  //         const { bottom: modalBottom } = currentModalEle.getClientRects()[0];
  //
  //         const { bottom: tableConfigBtnBottom } = this.ref.current?.querySelector(`.${prefixCls}-table-config-icon`)?.getClientRects()?.[0];
  //
  //         console.log(modalBottom, tableConfigBtnBottom);
  //         if (modalBottom && tableConfigBtnBottom && modalBottom -  tableConfigBtnBottom > 0) {
  //           this.setState({
  //             columnConfigStyle: {
  //               maxHeight: modalBottom -  tableConfigBtnBottom
  //             }
  //           })
  //         }
  //       }
  //     }
  //   }, 1000)
  // }

  /**
   * 表格翻页后，滚动到顶部
   */
  scrollIntoView = () => {
    if (this.props.scrollIntoTop) {
      const trEle = this.ref.current?.querySelector(
        `tr.${tablePrefixCls}-row:nth-child(2)`,
      );
      if (trEle) {
        trEle.scrollIntoView({
          inline: 'nearest',
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  };

  /**
   * 获取 leafNodesMap 的 key 值（如果是 tree，需要指定 rowKey）
   * @param node
   * @returns {string|*}
   */
  getKeyFieldVal = (node) => {
    if (node) {
      // eslint-disable-next-line no-unused-vars
      const { checked, disabled, ...props } = node;
      return node[this.props.rowKey] || JSON.stringify(props);
    }
    return null;
  };

  /**
   * 判断数据是否在当前页
   * @param targetVal
   * @returns {*}
   */
  isInCurrentPage = (targetVal) => {
    let isInCurrentPage = false;
    traverseTree({
      tree: this.state.data,
      callback: ({ node }) => {
        if (String(this.getKeyFieldVal(node)) === String(targetVal)) {
          isInCurrentPage = true;
        }
      },
      childrenKey: this.props.childrenKey,
    });
    return isInCurrentPage;
  };

  /**
   * 当前行是否被禁用
   * @param row
   * @returns {boolean}
   */
  isRowDisabled = (row) => {
    const key = this.getKeyFieldVal(row);
    if (row.disabled) {
      return true;
    }
    if (!this.props.disabledData.length) {
      return false;
    }

    // disabledData 是整个行对象的数组
    if (typeof this.props.disabledData[0] === 'object') {
      return !!this.props.disabledData.find(
        (node) => this.getKeyFieldVal(node) === key,
      );
    }

    // disabledData 是 rowKey 数组
    return !!this.props.disabledData.includes(key);
  };

  /**
   * 获取节点和叶子节点的映射关系
   * @param tree
   * @returns {{}}
   */
  getLeafNodesMap = (tree) => {
    const LeafNodesMap = {};
    traverseTree({
      tree,
      callback: ({ node, parentNode, childNodes }) => {
        LeafNodesMap[this.getKeyFieldVal(node)] = {
          parentNode, // 父节点
          node, // 当前节点
          childNodes: childNodes || getLeafNodes(node), // 所有叶子节点
        };
      },
      childrenKey: this.props.childrenKey,
      isTreeIncludeChildren: this.props.isTreeIncludeChildren,
    });
    return LeafNodesMap;
  };

  /**
   * 设置 footer 高度
   */
  setFooterHeight = () => {
    if (this.props.footerHeight !== undefined) {
      return;
    }
    if (this.ref.current && this.ref.current.querySelector) {
      const footerEle = this.ref.current.querySelector(
        `.${tablePrefixCls}-footer`,
      );
      if (footerEle) {
        this.setState({
          footerHeight: footerEle.offsetHeight,
        });
      }
    }
  };

  /**
   * 更新已选数据列表
   * @param onCheckedAfter
   */
  updateSelectedNodes = (onCheckedAfter = () => {}) => {
    const selectedNodeList = [];
    const { leafNodesMap } = this;
    Object.keys(leafNodesMap).forEach((key) => {
      if (typeof leafNodesMap[key] === 'object') {
        const parentKey = this.getKeyFieldVal(leafNodesMap[key].parentNode);
        // 如果节点的所有子节点选中 并且 节点的父节点的所有子节点没有全部选中
        if (
          isEveryChecked(leafNodesMap[key]?.childNodes) &&
          (!parentKey || !isEveryChecked(leafNodesMap[parentKey]?.childNodes))
        ) {
          selectedNodeList.push(leafNodesMap[key].node);
        }
      } else {
        // 叶子节点无法获取到的情况（可能已选节点不在当前页）
        const checkedData = this.props.checkedData.find(
          (node) => this.getKeyFieldVal(node) === leafNodesMap[key],
        );
        if (checkedData) {
          selectedNodeList.push(checkedData);
        }
      }
    });
    this.setState({ selectedNodeList }, onCheckedAfter);
  };

  /**
   * 已选数据回显
   */
  setCheckedData = () => {
    // 更新叶子节点 leafNodesMap 的选中状态
    this.props.checkedData?.forEach((cNode) => {
      const cNodeVal = this.getKeyFieldVal(cNode);
      if (this.leafNodesMap[cNodeVal]) {
        this.leafNodesMap[cNodeVal]?.childNodes?.forEach((node) => {
          Object.assign(node, { checked: true });
        });
      } else {
        // 叶子节点无法获取到的情况（可能已选节点不在当前页），直接赋值，这种情况 this.leafNodesMap[cNodeVal] 不是 object
        this.leafNodesMap[cNodeVal] = cNodeVal;
      }
    });
    const leafNodeKeys = Object.keys(this.leafNodesMap);
    leafNodeKeys.forEach((key) => {
      const isCheckedNode = !!this.props?.checkedData.find(
        (node) => String(this.getKeyFieldVal(node)) === String(key),
      );
      // 不是已选节点 && （没有子节点被选中 或者 全部子节点都被选中）
      if (
        !isCheckedNode &&
        (!isSomeChecked(this.leafNodesMap[key]?.childNodes) ||
          isEveryChecked(this.leafNodesMap[key]?.childNodes))
      ) {
        if (typeof this.leafNodesMap[key] === 'object') {
          this.leafNodesMap[key]?.childNodes?.forEach((node) => {
            Object.assign(node, { checked: false });
          });
        } else {
          delete this.leafNodesMap[key];
        }
      }
    });
  };

  /**
   * 加载表格
   * @param pageNum
   * @param pageSize
   * @param sortParams
   * @param onRefreshAfter
   * @returns {Promise<void>}
   */
  loadGrid = async (
    { pageNum, pageSize, sortParams = {} } = {},
    onRefreshAfter = noop,
  ) => {
    this.props.onLoadGridBefore({ pageNum, pageSize });
    this.setState({ isLoading: true }, async () => {
      const { pageOpts, filterValue } = this.state;
      const _pageOpts = {
        ...pageOpts,
        pageNum: pageNum || pageOpts.pageNum,
        pageSize: pageSize || pageOpts.pageSize,
      };
      const params = {
        ..._pageOpts,
        sortParams,
        filterValue,
      };

      this.setState({ sortParams });

      const { ajaxData, dataKey, childrenKey } = this.props;
      const res = await this.getDataSource(ajaxData, params);
      if (childrenKey !== 'children') {
        traverseTree({
          tree: res[dataKey],
          callback: ({ node }) => {
            Object.assign(node, { children: node[childrenKey] || [] });
          },
          childrenKey: this.props.childrenKey,
        });
      }
      let resolvedData = res[dataKey];

      if (sortParams.sortable && sortParams.sorter) {
        resolvedData = resolvedData
          .sort((rowA, rowB) => sortParams.sorter(rowA, rowB, sortParams))
          .concat([]);
      }

      // 更新叶子节点 leafNodesMap 的选中状态
      const currentLeafNodesMap = this.getLeafNodesMap(resolvedData);
      Object.keys(currentLeafNodesMap).forEach((key) => {
        if (this.leafNodesMap[key]) {
          if (typeof this.leafNodesMap[key] !== 'object') {
            currentLeafNodesMap[key]?.childNodes.forEach((item) => {
              Object.assign(item, { checked: true });
            });
            this.leafNodesMap[key] = currentLeafNodesMap[key];
          }
        } else {
          this.leafNodesMap[key] = currentLeafNodesMap[key];
        }
      });

      this.setState(
        {
          pageOpts: { ..._pageOpts, totals: res[this.props.totalsKey] },
          data: resolvedData,
          isLoading: false,
        },
        async () => {
          this.column.setCheckboxColumn();
          await onRefreshAfter();
          this.setHeaderStyle();
          this.setFixedStyle();
          this.scrollIntoView();
          this.props.onLoadGridAfter(res);
        },
      );
    });
  };

  /**
   * 改变分页
   * @param pageNum
   * @param pageSize
   */
  onPageChange = (pageNum, pageSize) => {
    const { pageOpts } = this.props;
    if (pageOpts && pageOpts.onChange) {
      pageOpts.onChange({ pageNum, pageSize });
    }
    this.loadGrid({ pageNum, pageSize, sortParams: this.state.sortParams });
  };

  /**
   * 刷新表格
   */
  onRefresh = () => {
    this.loadGrid();
  };

  /**
   * 外部调用此函数，手动刷新表格
   * @param gotoFirstPage：表格刷新后，是否跳转到第一页
   * @param params
   */
  refreshTable = (gotoFirstPage = true, params = {}) => {
    this.loadGrid({ ...params, pageNum: gotoFirstPage ? 1 : params.pageNum });
  };

  /**
   * 外部调用此函数，重新设置表格列
   * @param columnData
   * @param isReloadGrid：设置表格列后，是否重新刷新表格
   */
  setColumn = (columnData = [], isReloadGrid = false) => {
    this.setState(
      {
        columnData: this.resolveColumn(columnData),
        originColumnData: this.resolveOriginColumn(columnData),
      },
      () => {
        this.column.setColumnData();

        if (isReloadGrid) {
          this.loadData();
        }

        this.setHeaderStyle();
        this.setFixedStyle();
        this.setFooterHeight();
      },
    );
  };

  /**
   * 拖拽回调
   * @param fromIndex
   * @param toIndex
   */
  onDragEnd = (fromIndex, toIndex) => {
    if (!this.props.supportDrag) {
      return;
    }
    const _fromIndex = fromIndex - 1;
    const _toIndex = toIndex - 1;
    const { data } = this.state;
    const dataCopy = [...data];
    const item = dataCopy.splice(_fromIndex, 1)[0];
    dataCopy.splice(_toIndex, 0, item);
    this.setState(
      {
        data: dataCopy,
      },
      () => {
        this.props.onDragAfter(data[_fromIndex], data[_toIndex]);
      },
    );
  };

  onResize = () => {
    return debounce(() => {
      const thArr = this.ref.current?.querySelectorAll(
        `th.${tablePrefixCls}-cell`,
      );
      this.column.setColumnData({ currentThArr: thArr });
    }, 500);
  };

  getScroll = () => {
    const { scroll, maxHeight, noScroll } = this.props;
    if (scroll) {
      return scroll;
    }
    if (noScroll) {
      return { x: '100%' };
    }
    return { x: '100%', y: maxHeight || '100%' };
  };

  /**
   * 表格数据为空模板
   * @returns {*}
   */
  emptyTpl = className => {
    if (this.props.emptyTpl()) {
      return this.props.emptyTpl();
    }
    return (
      <div
        className={className || `${tablePrefixCls}-no-data`}
        style={this.props.emptyStyle}
      >
        <img src={emptyImg} height={90} alt="暂无数据" />
        <p style={{ marginTop: 4 }}>{this.props.emptyText() || '暂无数据'}</p>
      </div>
    );
  };

  refreshColumn = () => {
    this.props.onColumnChange({ columnData: [ ...this.state.originColumnData ] });
    this.column.setColumnData();
    this.setHeaderStyle();
    this.setFixedStyle();
  }

  renderTable() {
    const {
      ref,
      tableRef,
      leafNodesMap,
      onPageChange,
      onRefresh,
      getKeyFieldVal,
      emptyTpl,
    } = this;
    const {
      style,
      bordered,
      headerBordered,
      size,
      supportPage,
      footerTpl,
      supportCheckbox,
      supportRadio,
      rowKey,
      showTotal,
      showRefresh,
      lightCheckedRow,
      rowClassName,
      className,
      onRow,
      supportResizeColumn,
      isExpendAloneColumn,
      supportExpend,
      supportTree,
      supportGroup,
      summaryData,
      supportDrag,
      showDragIcon,
      supportFullColumn,
      loadingTpl,
      loadingOpts,
      footerSelectTpl,
      footerTotalTpl,
      tooltipConfigs,
      disablePageOnLoad,
      showFooterSelect,
      hideEmptyFooter,
      sticky,
      stickyFooter,
      supportConfigColumn,
      noScroll,
      rcTableConfig,
    } = this.props;
    const {
      data,
      columnData,
      expandIconColumnIndex,
      footerHeight,
      pageOpts,
      selectedNodeList,
      isLoading,
      // columnConfigStyle,
    } = this.state;
    const { pageNum, pageSize, totals } = pageOpts;
    const scroll = this.getScroll();

    return (
      <div className={`${tablePrefixCls}-container`} style={style} ref={ref}>
        <div
          className={classnames(
            `${tablePrefixCls}-box`,
            {
              [`${tablePrefixCls}-${size}`]: true,
              [`${tablePrefixCls}-bordered`]: bordered,
              [`${tablePrefixCls}-header-bordered`]:
                !bordered && headerBordered,
              [`${tablePrefixCls}-loading`]: isLoading || loadingOpts.loading,
              [`${tablePrefixCls}-empty`]: !data.length,
              [`${tablePrefixCls}-use-custom-scroll`]:
                this.hasCustomScroll && !isFirefox(),
              [`${tablePrefixCls}-two-level-tree`]: isExpendAloneColumn, // 两级树
              [`${tablePrefixCls}-support-tree`]:
                supportTree && !isExpendAloneColumn, // 多级树
              [`${tablePrefixCls}-expand-details`]:
                supportExpend && !supportTree, // 行展开
              [`${tablePrefixCls}-support-group`]: supportGroup, // 表格分组
              [`${tablePrefixCls}-support-summary`]:
                summaryData && summaryData.length, // 表尾合计
              [`${tablePrefixCls}-support-drag`]: supportDrag && !showDragIcon, // 拖拽行
              [`${tablePrefixCls}-support-resize`]: supportResizeColumn, // 表格列拉伸
              [`${tablePrefixCls}-full-column`]: supportFullColumn, // 表格通栏
              [`${tablePrefixCls}-config-column`]: supportConfigColumn, // 配置列的展示和隐藏
              [`${tablePrefixCls}-no-scroll`]: noScroll, // 无纵向滚动条的表格
              [`${tablePrefixCls}-support-checkbox`]: supportCheckbox,
            },
            className,
          )}
          style={noScroll ? {} : {
            height: `calc(100% - ${
              hideEmptyFooter && !totals ? 0 : footerHeight
            }px)`,
          }}
        >
          <RcTable
            ref={tableRef}
            prefixCls={tablePrefixCls}
            columns={columnData}
            data={data}
            expandIconColumnIndex={expandIconColumnIndex}
            sticky={sticky}
            scroll={scroll}
            expandable={getExpandableConfig({ ...this.props })}
            emptyText={emptyTpl()}
            rowKey={rowKey}
            rowClassName={(row) => {
              const rowKeyVal = getKeyFieldVal(row);
              const targetNode = leafNodesMap[rowKeyVal] || {};
              const classNames = [];

              if (this.isRowDisabled(row)) {
                classNames.push(`${tablePrefixCls}-row-disabled`);
              }
              if (lightCheckedRow && isEveryChecked(targetNode?.childNodes)) {
                classNames.push(`${tablePrefixCls}-row-select`);
              }
              return `${classNames.join(' ')} ${rowClassName(row)}`;
            }}
            onRow={onRow}
            components={
              supportResizeColumn
                ? {
                    header: {
                      cell: ResizableTitle,
                    },
                  }
                : undefined
            }
            summary={
              summaryData && summaryData.length
                ? () => (
                    <RcTable.Summary fixed>
                      <RcTable.Summary.Row>
                        {summaryData.map((item) => (
                          <RcTable.Summary.Cell {...item}>
                            <NumberTpl {...item} value={item.content} />
                          </RcTable.Summary.Cell>
                        ))}
                      </RcTable.Summary.Row>
                    </RcTable.Summary>
                  )
                : undefined
            }
            {...rcTableConfig}
          />
          {loadingTpl(isLoading || loadingOpts.loading) || (
            <Loading
              className={`${tablePrefixCls}-loading-layer`}
              loading={isLoading}
              {...loadingOpts}
            />
          )}
          {!totals && noScroll && this.emptyTpl(`${tablePrefixCls}-no-scroll-empty`)}
        </div>
        {supportPage && (!hideEmptyFooter || (hideEmptyFooter && !!totals)) && (
          <div
            className={classnames(`${tablePrefixCls}-footer`, {
              [`${tablePrefixCls}-sticky-footer`]: stickyFooter,
            })}
          >
            <div className={classnames(`${tablePrefixCls}-footer-statistics`)}>
              {showFooterSelect && (supportCheckbox || supportRadio) && (
                <span className={classnames(`${tablePrefixCls}-footer-select`)}>
                  {footerSelectTpl || <>已选 {selectedNodeList.length} 条</>}
                </span>
              )}
              {showRefresh && (
                <span
                  className={classnames(`${tablePrefixCls}-footer-refresh`)}
                  onClick={onRefresh}
                >
                  <Icon type="refresh" />
                  刷新
                </span>
              )}
            </div>
            <div className={classnames(`${tablePrefixCls}-footer-page`)}>
              {showTotal && (
                <span className={classnames(`${tablePrefixCls}-footer-total`)}>
                  {(typeof footerTotalTpl === 'function'
                    ? footerTotalTpl(totals)
                    : footerTotalTpl) || <>共 {totals} 条</>}
                </span>
              )}
              <Pagination
                type="simple"
                {...pageOpts}
                current={pageNum}
                pageSize={pageSize}
                total={totals}
                disabled={disablePageOnLoad ? isLoading : false}
                onChange={onPageChange}
              />
            </div>
          </div>
        )}
        {footerTpl()}
        {tooltipConfigs?.length ? (
          <RowTooltip
            tableContainerRef={ref}
            tooltipConfigs={tooltipConfigs}
            useRootWindow={this.props.useRootWindow}
          />
        ) : null}
        {/* 支持配置列的显示和隐藏 */}
        {supportConfigColumn && (
          <ColumnConfig
            {...this.props}
            isLoading={isLoading}
            tableRef={this.ref}
            originConfigColumnData={this.state.originConfigColumnData}
            originColumnData={this.state.originColumnData}
            setOriginColumnData={(data, cb = noop) => {
              this.setState({ originColumnData: data }, cb);
            }}
            refreshColumn={this.refreshColumn}
          />
        )}
      </div>
    );
  }

  render() {
    const { dragSelector, showDragIcon, supportDrag } = this.props;
    if (supportDrag) {
      return (
        <ReactDragListView
          lineClassName={`${tablePrefixCls}-drag-line`}
          onDragEnd={this.onDragEnd}
          handleSelector={
            dragSelector || (showDragIcon ? DRAG_ICON_SELECTOR : DRAG_SELECTOR)
          }
        >
          {this.renderTable()}
        </ReactDragListView>
      );
    }
    return this.renderTable();
  }
}

export default CTable;

CTable.propTypes = propTypes;
CTable.defaultProps = defaultProps;

CTable.NumberTpl = NumberTpl;
CTable.TimeTpl = TimeTpl;
CTable.TimeRangeTpl = TimeRangeTpl;
CTable.TextTpl = TextTpl;
CTable.MultiTextTpl = MultiTextTpl;
CTable.LinkTpl = LinkTpl;
CTable.MultiLinkTpl = MultiLinkTpl;
CTable.TagTpl = TagTpl;
