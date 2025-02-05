import React, { Component } from 'react';
import ReactDragListView from 'react-drag-listview';
import { tablePrefixCls } from '../constant';
import Tooltip from '../../tooltip';
import Icon from '../../icon';
import Popover from '../../popover';
import Checkbox from '../../checkbox';
import Button from '../../button';
import Modal from '../../modal';
// import { setConfig } from '../util';

const columnConfigPanelHeight = 466;
const popoverIgnoreClass = `${tablePrefixCls}-config-column-button`;

class ColumnConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  onDragEnd = (fromIndex, toIndex) => {
    const { hideConfigColumns, originColumnData, disabledSortColumns, setOriginColumnData } = this.props;
    // 禁止拖拽和排序的列（只能在首部）
    const disabledSortColumnData = originColumnData.filter(item1 => disabledSortColumns.includes(item1.dataIndex));
    // 其余列
    const restColumnData = originColumnData.filter(item1 => !disabledSortColumns.includes(item1.dataIndex));

    const _fromIndex = fromIndex;
    const _toIndex = toIndex;

    const hideColumnIndexList = hideConfigColumns.map(item => (
      restColumnData.findIndex(item1 => item1.dataIndex === item)
    ));

    const dataCopy = [...restColumnData].filter(item => !hideConfigColumns.includes(item.dataIndex));
    const item = dataCopy.splice(_fromIndex, 1)[0];
    dataCopy.splice(_toIndex, 0, item);

    setOriginColumnData([
      ...disabledSortColumnData,
      ...restColumnData
        .map((hItem, index) => {
          if (hideColumnIndexList.includes(index)) {
            return hItem;
          }
          return dataCopy[index];
        }),
    ]);
  }

  renderConfig = () => {
    const {
      originColumnData,
      disabled,
      disabledConfigColumns,
      hideConfigColumns,
      // supportMemory,
      // tableId,
      refreshColumn,
    } = this.props;
    return (
      <ul className={`${tablePrefixCls}-tooltip-content`}>
        <p className="config-title">配置列的显示状态</p>
        {originColumnData.filter(c => !hideConfigColumns.includes(c.dataIndex)).map((item) => (
          <li>
            <Checkbox
              disabled={
                disabled
                || disabledConfigColumns.includes(item.dataIndex)
                || (item.show
                  && originColumnData.filter((i) => i.show).length === 1)
              }
              checked={item.show}
              onChange={(checked) => {
                Object.assign(item, { show: !!checked });
                // if (supportMemory) {
                //   setConfig(originColumnData, tableId);
                // }
                refreshColumn();
              }}
            >
              {typeof item.title === 'function' ? item.title(item) : item.title}
            </Checkbox>
          </li>
        ))}
      </ul>
    );
  };

  renderItem = ({ item, disabled, disabledConfigColumns, originColumnData, setOriginColumnData }) => (
    <Checkbox
      disabled={disabled || disabledConfigColumns.includes(item.dataIndex)}
      checked={item.columnChecked}
      onChange={(checked) => {
        const target = originColumnData.find(item1 => item1.dataIndex === item.dataIndex);
        if (target) {
          Object.assign(target, { columnChecked: !!checked });
          setOriginColumnData([...originColumnData]);
        }
      }}
    >
      {typeof item.title === 'function' ? item.title(item) : item.title}
    </Checkbox>
  )

  renderComplexConfig = () => {
    const {
      originColumnData,
      disabled,
      disabledConfigColumns,
      defaultConfigColumns,
      hideConfigColumns,
      originConfigColumnData,
      setOriginColumnData,
      refreshColumn,
      disabledSortColumns,
    } = this.props;
    const dragSelector = `${tablePrefixCls}-config-drag-icon`;
    const itemSelector = `${tablePrefixCls}-tooltip-complex-content-item`;
    return (
      <section className={`${tablePrefixCls}-tooltip-complex`}>
        <p className={`${tablePrefixCls}-tooltip-complex-title`}>配置列的显示状态</p>
        <div style={{ maxHeight: columnConfigPanelHeight - 128, overflow: 'auto' }}>
          {disabledSortColumns?.length ? (
            <ul className={`${tablePrefixCls}-tooltip-complex-content`} style={{ marginBottom: 12 }}>
              {originColumnData.filter(c => disabledSortColumns?.includes(c.dataIndex)).map(item => (
                <li className={itemSelector}>
                  {this.renderItem({ item, disabled, disabledConfigColumns, originColumnData, setOriginColumnData })}
                </li>
              ))}
            </ul>
          ) : null}
          <ReactDragListView
            onDragEnd={this.onDragEnd}
            handleSelector={`.${dragSelector}`}
            nodeSelector={`.${itemSelector}`}
            lineClassName={`${tablePrefixCls}-drag-line`}
          >
            <ul className={`${tablePrefixCls}-tooltip-complex-content`}>
              {originColumnData.filter(c => ![...hideConfigColumns, ...disabledSortColumns].includes(c.dataIndex)).map((item, index) => (
                <li className={itemSelector}>
                  {this.renderItem({ item, disabled, disabledConfigColumns, originColumnData, setOriginColumnData })}
                  <span className={`${tablePrefixCls}-tooltip-complex-operate-icon`}>
                    <Icon
                      type="down"
                      style={{
                        lineHeight: '20px',
                        visibility: index < originColumnData.length - hideConfigColumns.length - disabledSortColumns.length - 1
                          ? 'visible'
                          : 'hidden',
                      }}
                      onClick={() => this.onDragEnd(index, index + 1)}
                    />
                    <Icon
                      type="up"
                      style={{ lineHeight: '20px', visibility: index > 0 ? 'visible' : 'hidden' }}
                      onClick={() => this.onDragEnd(index, index - 1)}
                    />
                    <Icon type="move" style={{ lineHeight: '20px' }} className={dragSelector} />
                  </span>
                </li>
              ))}
            </ul>
          </ReactDragListView>
        </div>
        <div className={`${tablePrefixCls}-tooltip-complex-button-area`}>
          <Button
            size="small"
            type="link"
            onClick={() => {
              Modal.confirm({
                title: '确定恢复为系统默认设置吗？',
                body: '确定后，已编辑内容将不会被保存',
                outerClassName: `${tablePrefixCls}-modal-outer`,
                isReverseBtn: true,
                onOk: () => {
                  if (!defaultConfigColumns?.length) {
                    setOriginColumnData(originConfigColumnData.map(item => ({
                      ...item,
                      show: true,
                      columnChecked: true,
                    })), refreshColumn);
                  } else {
                    setOriginColumnData(originConfigColumnData.map(item => ({
                      ...item,
                      show: defaultConfigColumns.includes(item.dataIndex),
                      columnChecked: defaultConfigColumns.includes(item.dataIndex),
                    })), refreshColumn);
                  }
                },
                onClose: () => {
                  this.setState({visible: true});
                },
                onCancel: () => {
                  this.setState({visible: true});
                }
              });
            }}
            className={popoverIgnoreClass}
          >
            恢复默认
          </Button>
          <Button
            disabled={!originColumnData.filter((i) => i.columnChecked).length}
            size="small"
            type="primary"
            onClick={() => {
              setOriginColumnData(originColumnData.map(item => ({
                ...item,
                show: item.columnChecked,
              })), refreshColumn);
              this.setState({ visible: false });
            }}
            className={popoverIgnoreClass}
          >
            保存
          </Button>
          <Button
            size="small"
            type="normal"
            onClick={() => {
              setOriginColumnData(originConfigColumnData.map(item => {
                const targetColumn = originColumnData.find(item1 => item1.dataIndex === item.dataIndex) || {};
                return {
                  ...targetColumn,
                  columnChecked: targetColumn.show,
                };
              }), refreshColumn);
              this.setState({ visible: false });
            }}
            className={popoverIgnoreClass}
          >
            取消
          </Button>
        </div>
      </section>
    );
  }

  render() {
    const {
      isLoading,
      tableRef,
      loadingOpts,
      configColumnType,
    } = this.props;

    const isComplexConfig = configColumnType === 'complex';
    return (
      <Popover
        trigger="click"
        theme="light"
        placement="bottom-right"
        className={`${tablePrefixCls}-tooltip`}
        content={configColumnType === 'complex' ? this.renderComplexConfig() : this.renderConfig()}
        overlayStyle={{
          maxHeight: columnConfigPanelHeight,
          top: 40,
          right: 1,
          left: 'auto',
        }}
        contentStyle={{ maxHeight: columnConfigPanelHeight - 24 }}
        containerEle={tableRef.current}
        ignoreClassList={isComplexConfig ? [popoverIgnoreClass] : []}
        control
        visible={this.state.visible}
      >
        <Tooltip content="列设置" theme="light" overlayStyle={{ minWidth: 50 }}>
          <span
            className={`${tablePrefixCls}-config-icon`}
            style={isLoading || loadingOpts.loading ? { zIndex: -1 } : {}}
            onClick={() => {
              const { visible } = this.state;
              this.setState({ visible: !visible });
            }}
          >
            <Icon type="config" />
          </span>
        </Tooltip>
      </Popover>
    );
  }
}

export default ColumnConfig;
