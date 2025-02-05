import React from 'react';
import classnames from 'classnames';
import Icon from '../../icon';
import Tooltip from '../../tooltip';
import Checkbox from '../../checkbox';
import Radio from '../../radio';
import Popover from '../../popover';
import { isEveryChecked, isSomeChecked } from '../util';
import { tablePrefixCls } from '../constant';

// function RowCheckbox({ isDisabled, data, updateLeafNodesMap }) {
//   const [checked, setChecked] = useState(false);
//   const [indeterminate, setIndeterminate] = useState(false);
//
//   useEffect(() => {
//     if (data?.childNodes) {
//       const isChecked = !!isEveryChecked(data.childNodes);
//       const isIndeterminate = !isChecked && isSomeChecked(data.childNodes);
//       setChecked(isChecked);
//       setIndeterminate(isIndeterminate);
//     }
//   }, [data]);
//
//   return (
//     <Checkbox
//       checked={checked}
//       indeterminate={indeterminate}
//       disabled={isDisabled}
//       onChange={(_checked) => {
//         updateLeafNodesMap(_checked);
//         setChecked(_checked);
//         setIndeterminate(false);
//       }}
//     />
//   );
// }

// function RowRadio({ radioVal, data, isDisabled, onChange }) {
//   const [checked, setChecked] = useState(false);
//
//   useEffect(() => {
//     if (data?.childNodes) {
//       const isChecked = !!isEveryChecked(data.childNodes);
//       console.log(isChecked);
//       setChecked(isChecked);
//     }
//   }, [data]);
//
//   return (
//     <Radio
//       disabled={isDisabled}
//       value={radioVal}
//       checked={checked}
//       onChange={() => {
//         onChange();
//         setChecked(true);
//       }}
//     />
//   );
// }

export default class Column {
  constructor(_this) {
    this._this = _this;
    this.setCheckboxColumn = this.setCheckboxColumn.bind(this);
    this.setColumnData = this.setColumnData.bind(this);
  }

  /**
   * 设置单选和多选列模板
   */
  setCheckboxColumn = () => {
    const { _this } = this;
    const { supportCheckbox, supportRadio } = _this.props;
    const { columnData } = _this.state;
    const isFirstColumnFixed = columnData[0].fixed;

    if (supportCheckbox) {
      const checkboxColumn = this.getCheckboxColumn(isFirstColumnFixed);
      _this.setState({
        expandIconColumnIndex: _this.props.expandIconColumnIndex + 1,
        columnData:
          columnData[0].dataIndex === 'checkbox'
            ? [checkboxColumn, ...columnData.slice(1)]
            : [checkboxColumn, ...columnData],
      });
      return;
    }
    if (supportRadio) {
      const radioColumn = this.getRadioColumn(isFirstColumnFixed);
      _this.setState({
        expandIconColumnIndex: _this.props.expandIconColumnIndex + 1,
        columnData:
          columnData[0].dataIndex === 'radio'
            ? [radioColumn, ...columnData.slice(1)]
            : [radioColumn, ...columnData],
      });
      return;
    }
    _this.setState({
      expandIconColumnIndex: _this.props.expandIconColumnIndex,
    });
  };

  /**
   * 设置 columnData
   */
  setColumnData = ({ currentThArr } = {}) => {
    const { _this } = this;
    const { originColumnData } = _this.state;
    const { supportCheckbox, supportRadio, isExpendAloneColumn, showDragIcon } = _this.props;
    // const isLastColumnFixed = originColumnData[originColumnData.length - 1].fixed;
    const isFirstColumnFixed = originColumnData[0].fixed;
    const thArr = currentThArr
      || _this.ref.current?.querySelectorAll(`th.${tablePrefixCls}-cell`)
      || [];

    const resolvedColumnData = originColumnData.reduce((arr, item, index) => {
      // 判断当前列展示还是隐藏，默认为 true
      if (!item.show) {
        return arr;
      }
      const sortBy = item.sortable ? item.sortBy : '';
      const currentColumnItem = {
        ...item,
        sortBy,
        align: item.align || 'left',
        width: this.getColumnWidth(item, thArr?.[index]),
      };
      arr.push({
        ...currentColumnItem,
        title: this.renderBasicTitle(item, sortBy, currentColumnItem),
      });
      return arr;
    }, []);

    // 只有两级的树状表格，展开图标单独占据一列
    if (isExpendAloneColumn) {
      resolvedColumnData.unshift({
        dataIndex: 'cTableExpand',
        key: 'cTableExpand',
        width: 36,
        align: 'center',
        className: `${tablePrefixCls}-row-expand-column`,
        fixed: isFirstColumnFixed || _this.props.isCheckboxFixed,
        render: () => '',
      });
    }

    // 多选列
    if (supportCheckbox) {
      const checkboxColumn = this.getCheckboxColumn(isFirstColumnFixed);
      resolvedColumnData.unshift(checkboxColumn);
    }

    // 单选列
    if (supportRadio) {
      const radioColumn = this.getRadioColumn(isFirstColumnFixed);
      resolvedColumnData.unshift(radioColumn);
    }

    // 拖拽手柄
    if (showDragIcon) {
      resolvedColumnData.unshift({
        title: '',
        dataIndex: 'cTableDrag',
        key: 'cTableDrag',
        className: `${tablePrefixCls}-drag-column`,
        width: 40,
        render: () => <Icon type="move" style={{ lineHeight: '20px' }} />,
      });
    }

    // 支持配置列的显示和隐藏
    // if (_this.props.supportConfigColumn) {
    //   resolvedColumnData.push({
    //     title: '',
    //     dataIndex: 'configEmptyColumn',
    //     render: () => '',
    //     width: 40,
    //     fixed: 'right',
    //   });
    // }

    // 支持配置表格列拉伸
    if (_this.props.supportResizeColumn) {
      resolvedColumnData.forEach((item, index) => {
        Object.assign(item, {
          onHeaderCell: (column) => {
            const resizableThArr = _this.ref.current.querySelectorAll('th.react-resizable');
            return {
              width:
                column.width
                || resizableThArr[index]?.getBoundingClientRect().width,
              onResize: this.handleResize(index),
            };
          },
        });
      });
    }

    if (supportCheckbox || supportRadio) {
      _this.setState({
        expandIconColumnIndex: _this.props.expandIconColumnIndex + 1,
        columnData: resolvedColumnData,
      });
      return;
    }
    _this.setState({
      columnData: resolvedColumnData,
      expandIconColumnIndex: _this.props.expandIconColumnIndex,
    });
  };

  renderTitle = (columnItem) => {
    const title = typeof columnItem.title === 'function'
      ? columnItem.title(columnItem)
      : columnItem.title;
    if (columnItem?.titleTooltipConfig?.content) {
      return (
        <span
          className={`title-with-tip ${
            columnItem?.titleTooltipAlign === 'right'
            || !columnItem?.titleTooltipAlign
              ? 'title-with-tip-right'
              : 'title-with-tip-left'
          }`}
        >
          <span>{title}</span>
          <Tooltip {...(columnItem.titleTooltipConfig || {})}>
            <Icon className="title-tip-icon" type="question-circle" />
          </Tooltip>
        </span>
      );
    }
    return title;
  };

  renderBasicTitle = (item, sortBy, currentColumnItem) => {
    const { _this } = this;
    const { showFilterBtn, disabled } = _this.props;
    const hasFilter = item.filters && item.filters.length;

    if (item.sortable || hasFilter) {
      return (
        <span
          className={classnames('title-container', {
            'filter-container': hasFilter,
            'align-right': item.align === 'right',
          })}
        >
          {this.renderTitle(item)}
          {item.sortable && (
            <span
              className={classnames('sort-icon-container', {
                'cell-align-right': item.align === 'right',
                [`sort-${sortBy?.toLowerCase()}`]: !!sortBy,
              })}
              onClick={() => this.onSort(item, currentColumnItem)}
            >
              <Icon className="sort-up-icon" type="up-solid" />
              <Icon className="sort-down-icon" type="down-solid" />
            </span>
          )}
          {hasFilter && (
            <Popover
              trigger="click"
              size="mini"
              showCancelBtn={showFilterBtn}
              showConfirmBtn={showFilterBtn}
              cancelBtnText="取消"
              confirmText="确定"
              width={170}
              placement="bottom-left"
              className={`${tablePrefixCls}-filter-content ${
                showFilterBtn && 'show-filter-btn'
              }`}
              content={
                <>
                  {item.filters.map((f, index) => (
                    <Checkbox
                      onChange={this.onFilterChange}
                      defaultChecked={_this.state.filterValue.includes(f.value)}
                      key={f.value}
                      value={f.value}
                      disabled={disabled || f.disabled}
                      className={
                        !showFilterBtn
                        && index === item.filters.length - 1
                        && 'last-filter-item'
                      }
                    >
                      {f.text}
                    </Checkbox>
                  ))}
                </>
              }
              onCancelClick={this.onFilterReset}
              onConfirmClick={this.onFilterConfirm}
              onVisibleChange={visible => {
                _this.setState({ lineHeightFilter: visible }, () => {
                  this.setColumnData();
                });
              }}
            >
              <Icon
                className={`filter-icon ${
                  (_this.state.filterValue.length || _this.state.lineHeightFilter) && 'has-filter-value'
                }
                `}
                type="filter"
              />
            </Popover>
          )}
        </span>
      );
    }
    return this.renderTitle(item);
  };

  /**
   * 获取表格列宽
   * @param columnItem
   * @param columnTh
   * @returns {number|*}
   */
  getColumnWidth = (columnItem, columnTh) => {
    const { _this } = this;
    const { originColumnData } = _this.state;

    if (columnItem.width) {
      return columnItem.width;
    }

    if (
      columnItem.minWidth
      && columnItem.minWidth > columnTh?.getBoundingClientRect().width
    ) {
      return columnItem.minWidth;
    }

    if (originColumnData.find((c) => c.fixed)) {
      return 150;
    }
    return '';
  };

  /**
   * 拉伸行回调
   * @param index
   * @returns {(function(*, {size: *}): void)|*}
   */
  handleResize = (index) => {
    const { _this } = this;
    return (e, { size }) => {
      _this.setState(({ columnData }) => {
        const nextColumns = [...columnData];
        const minWidth = nextColumns[index].minWidth || 106;
        Object.assign(nextColumns[index], {
          width: size.width > minWidth ? size.width : minWidth,
        });
        const thArr = _this.ref.current.querySelectorAll('th.react-resizable');
        nextColumns.forEach((col, i) => {
          if (i !== index) {
            Object.assign(col, {
              width: thArr[i]?.getBoundingClientRect().width,
            });
          }
        });
        return { columnData: nextColumns };
      });
    };
  };

  getDragColumn = () => ({
    title: '',
    dataIndex: 'cTableDrag',
    key: 'cTableDrag',
    className: `${tablePrefixCls}-drag-column`,
    width: 40,
    render: () => <Icon type="move" />,
  });

  /**
   * 单选列模板
   * @param isFirstColumnFixed
   * @returns {{dataIndex: string, width: number, fixed: (boolean|*), title: string, render: (function(*, *=)), key: string}}
   */
  getRadioColumn = (isFirstColumnFixed) => {
    const { _this } = this;
    const { leafNodesMap } = _this;
    const { disabled } = _this.props;
    return {
      title: '',
      className: `${tablePrefixCls}-radio-column`,
      dataIndex: 'radio',
      key: 'radio',
      width: 40,
      fixed: isFirstColumnFixed || _this.props.isCheckboxFixed,
      render: (value, row) => {
        const radioVal = _this.getKeyFieldVal(row);
        const targetNode = leafNodesMap[radioVal] || {};
        const isDisabled = disabled || _this.isRowDisabled(row);
        return (
          <Radio
            disabled={isDisabled}
            value={radioVal}
            checked={!!isEveryChecked(targetNode.childNodes)}
            onChange={() => this.onNodeRadioChange(row)}
          />
        );
      },
    };
  };

  /**
   * 多选列模板
   * @param isFirstColumnFixed
   * @returns {{}}
   */
  getCheckboxColumn = (isFirstColumnFixed) => {
    const { _this } = this;
    const { leafNodesMap } = _this;
    const { disabled, showCheckedAll } = _this.props;

    const currentLeafNodes = Object.keys(leafNodesMap).reduce(
      (nodeList, key) => {
        if (_this.isInCurrentPage(key)) {
          nodeList.push(...leafNodesMap[key].childNodes);
        }
        return nodeList;
      },
      [],
    );
    const isCheckedAll = !!isEveryChecked(
      currentLeafNodes.filter((node) => !_this.isRowDisabled(node)),
    );
    const isIndeterminateAll = !isCheckedAll && isSomeChecked(currentLeafNodes);

    return {
      title: showCheckedAll ? (
        <Checkbox
          style={{ float: 'left' }}
          disabled={disabled}
          checked={isCheckedAll}
          indeterminate={isIndeterminateAll}
          onChange={(checked) => this.onAllCheckedChange(checked)}
        />
      ) : (
        ''
      ),
      className: `${tablePrefixCls}-checkbox-column`,
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 40,
      fixed: isFirstColumnFixed || _this.props.isCheckboxFixed,
      render: (value, row) => {
        const targetNode = leafNodesMap[_this.getKeyFieldVal(row)] || {};
        const isChecked = !!isEveryChecked(targetNode.childNodes);
        const isIndeterminate = !isChecked && isSomeChecked((targetNode || {}).childNodes);
        const isDisabled = disabled || _this.isRowDisabled(row);
        return (
          <Checkbox
            checked={isChecked}
            indeterminate={isIndeterminate}
            disabled={isDisabled}
            onChange={(checked) => this.onNodeCheckedChange(checked, row)}
          />
        );
      },
    };
  };

  /**
   * 选中当页
   * @param checked
   */
  onAllCheckedChange = (checked) => {
    const { _this } = this;
    // 更新叶子节点 leafNodesMap 的选中状态
    Object.keys(_this.leafNodesMap).forEach((key) => {
      if (_this.isInCurrentPage(key)) {
        _this.leafNodesMap[key].childNodes.forEach((node) => {
          if (!_this.isRowDisabled(node)) {
            Object.assign(node, { checked });
          }
        });
      }
    });
    this.setCheckboxColumn();
    _this.updateSelectedNodes(() => {
      _this.props.onCheckedAllAfter(
        _this.state.selectedNodeList,
        _this.state.data,
        checked,
      );
    });
  };

  /**
   * 选中当前行（多选）
   * @param checked
   * @param row
   */
  onNodeCheckedChange = (checked, row) => {
    const { _this } = this;
    // 更新叶子节点 leafNodesMap 的选中状态
    _this.leafNodesMap[_this.getKeyFieldVal(row)].childNodes.forEach((node) => {
      if (!_this.isRowDisabled(node)) {
        Object.assign(node, { checked });
      }
    });
    this.setCheckboxColumn();
    _this.updateSelectedNodes(() => {
      _this.props.onCheckedAfter(_this.state.selectedNodeList, row, checked);
    });
  };

  /**
   * 选中当前行（单选）
   * @param row
   */
  onNodeRadioChange = (row) => {
    const { _this } = this;
    // 如果默认传入的已选数据不在当前页，则删除（checkedData = [{ id: 'test' }]）
    Object.keys(_this.leafNodesMap).forEach((key) => {
      if (!Array.isArray(_this.leafNodesMap[key].childNodes)) {
        delete _this.leafNodesMap[key];
      }
    });
    // 更新叶子节点 leafNodesMap 的选中状态
    Object.keys(_this.leafNodesMap).forEach((key) => {
      _this.leafNodesMap[key].childNodes.forEach((node) => {
        Object.assign(node, {
          checked: _this.getKeyFieldVal(node) === _this.getKeyFieldVal(row),
        });
      });
    });
    this.setCheckboxColumn();
    _this.updateSelectedNodes(() => {
      _this.props.onCheckedAfter(_this.state.selectedNodeList, row, true);
    });
  };

  /**
   * 表格排序
   * @param itemData
   * @param currentColumnItem
   */
  onSort = (itemData, currentColumnItem) => {
    const { _this } = this;
    let sortBy;
    // 支持三个排序状态：升序、降序、原始状态
    if (_this.props.sortWidthOriginStatus) {
      if (!currentColumnItem.sortBy) {
        sortBy = 'ASC';
      } else if (currentColumnItem.sortBy === 'ASC') {
        sortBy = 'DESC';
      } else if (currentColumnItem.sortBy === 'DESC') {
        sortBy = '';
      }
    } else {
      // 支持两个排序状态：升序、降序
      sortBy = !currentColumnItem.sortBy || currentColumnItem.sortBy === 'DESC'
        ? 'ASC'
        : 'DESC';
    }

    const { columnData, originColumnData } = _this.state;
    const resolveOriginColumnData = columnData.map((item) => {
      // 当前排序的列
      if (item.dataIndex === currentColumnItem.dataIndex) {
        return {
          ...item,
          title: itemData.title,
          sortBy,
        };
      }
      const originColumnItem = originColumnData.find(
        (oItem) => oItem.dataIndex === item.dataIndex,
      );
      return _this.props.sortMultiColumns
        ? {
          // 支持多个列同时排序
          ...item,
          title: originColumnItem?.title || item.title,
        }
        : {
          // 单个列排序
          ...item,
          title: originColumnItem?.title || item.title,
          sortBy: '',
        };
    });

    _this.loadGrid(
      {
        sortParams: {
          ...currentColumnItem,
          sortBy,
          allSortColumns: [...resolveOriginColumnData],
        },
      },
      () => {
        _this.setState(
          { originColumnData: resolveOriginColumnData },
          this.setColumnData,
        );
      },
    );
  };

  onFilterChange = (checked, value) => {
    const { _this } = this;
    const { filterValue } = _this.state;
    const { showFilterBtn } = _this.props;
    const targetIndex = filterValue.findIndex((v) => v === value);

    if (checked && targetIndex === -1) {
      filterValue.push(value);
    }
    if (!checked && targetIndex > -1) {
      filterValue.splice(targetIndex, 1);
    }
    _this.setState({ filterValue }, () => {
      if (!showFilterBtn) {
        this.setColumnData();
        _this.loadGrid();
      }
    });
  };

  /**
   * 筛选重置
   */
  onFilterReset = () => {
    const { _this } = this;
    _this.setState({ filterValue: [] }, () => {
      this.setColumnData();
      _this.loadGrid();
    });
  };

  /**
   * 筛选确认
   */
  onFilterConfirm = () => {
    const { _this } = this;
    this.setColumnData();
    _this.loadGrid();
  };
}
