---
title: CTable 新表格
nav:
    title: CTable 新表格
    path: /cloud-react
group:
    order: 14
    title: 数据
    path: /data
---

### 何时使用
可配置分页功能的表格组件。

### 一、API

### CTable 基础配置项

| 属性               | 说明                                                  | 类型             | 默认值       |
|------------------|-----------------------------------------------------|----------------|-----------|
| ajaxData         | 表格数据源                                               | function/array | -         | |
| columnData       | 表格列描述，具体详见下表 **columnData**                         | array          | -         | |
| rowKey           | 表格数据的唯一标识                                           | string         | 'id'      | |
| bordered         | 是否展示表格边框                                            | boolean        | false     | |
| headerBordered   | 表头带线条                                               | boolean        | false     | |
| size             | 表格大小，可选 `default` `small` `large`                   | string         | `default` | |
| maxHeight        | tbody最大高度                                           | string/number  | -         |
| onLoadGridAfter  | 表格刷新后回调，Function(res)                               | function       | () => {}  | |
| onLoadGridBefore | 表格刷新前回调，Function(params)                            | function       | () => {}  | |
| onRow            | 表格刷新后回调，设置自定义 row 属性，Function(record, index)        | 	function      | () => {}  | |
| scroll           | 表格是否可以在x/y方向上滚动，x或y可以是表示表体宽度和高度的数字 {x: 500, y: 300} | 	object        | -         | |

[comment]: <> (| noScroll         | 表格不展示滚动条，表格高度由内容高度决定，配置该参数后，无需设置表格高度                | 	boolean       | false     | |)

### CTable 手动刷新表格
this.tableRef.current.refreshTable(gotoFirstPage?, params?);

*refreshTable 参数：*

| 属性            | 说明                      | 类型      | 默认值  |
|---------------|-------------------------|---------|------|
| gotoFirstPage | 表格刷新后，是否跳转到第一页          | boolean | true | |
| params        | 分页等表格查询参数（暂不支持传入额外查询参数） | object  | {}   | |


### CTable 重新设置表格列 columnData
this.tableRef.current.setColumn(columnData, isReloadGrid?);

*setColumn 参数：*

| 属性           | 说明                | 类型      | 默认值   |
|--------------|-------------------|---------|-------|
| columnData   | 表格列数组             | array   | []    | |
| isReloadGrid | 重新设置表格列后，是否需要刷新表格 | boolean | false | |

### CTable 字段映射
| 属性          | 说明            | 类型     | 默认值        |
|-------------|---------------|--------|------------|
| totalsKey   | total 映射字段    | string | 'totals'   | |
| dataKey     | data 映射字段     | string | 'data'     | |
| childrenKey | children 映射字段 | string | 'children' | |

### CTable 分页相关配置
| 属性          | 说明                                                                                   | 类型      | 默认值   |
|-------------|--------------------------------------------------------------------------------------|---------|-------|
| supportPage | 是否支持分页                                                                               | boolean | false | |
| pageOpts    | 分页信息，详见**Pagination**组件：https://cloud-react.shuyun.com/v1/cloud-react/nav/pagination | object  | -     | |
| showTotal   | 显示总条数                                                                                | boolean | false | |
| showRefresh | 显示刷新按钮                                                                               | boolean | true  | |

### CTable 多级表格配置（树、展开行）
| 属性                    | 说明                                                           | 类型       | 默认值   |
|-----------------------|--------------------------------------------------------------|----------|-------|
| supportTree           | 是否支持树状表格                                                     | boolean  | false | |
| supportExpend         | 是否支持展开                                                       | boolean  | false | |
| onExpand              | 表格展开的回调函数，需要设置 supportExpend 为 true                          | function | -     | |
| expandedRowRender     | 表格展开区域的内容                                                    | function | -     | |
| expandable            | 表格展开功能的额外配置，详见 https://table-react-component.vercel.app/#api | object   | {}    | |
| expandIconColumnIndex | 展开行图标将插入哪一列的索引                                               | 	number  | 0     | |
| isExpendAloneColumn   | 树状表格的展开图标是否单独占据一列（只有两级的树状表格需要设置该属性）                          | 	boolean | false | |
| supportGroup          | 表格分组                                                         | 	boolean | false | |
| supportFullColumn     | 表格通栏                                                         | 	boolean | false | |

### CTable 多选/单选配置
| 属性                | 说明                                                                                 | 类型       | 默认值   |
|-------------------|------------------------------------------------------------------------------------|----------|-------|
| supportCheckbox   | 是否支持多选                                                                             | boolean  | false | |
| checkedData       | 已选数据，支持两种写法。在 "多选表格（checkbox.md）" demo 中查看说明                                       | array    | []    | |
| supportRadio      | 是否支持单选                                                                             | boolean  | false | |
| onCheckedAfter    | 选中行回调，需要设置 supportCheckbox 为 true，Function(checkedList, checkedRow, checked)       | function | -     | | 
| onCheckedAllAfter | 选中当页回调，需要设置 supportCheckbox 为 true，Function(checkedList, currentPageData, checked) | function | -     | |
| showFooterSelect  | 配置是否显示已选条数                                                                         | boolean  | true  | |
| disabled          | 禁用多选/单选按钮                                                                          | boolean  | false | |
| showCheckedAll    | 是否展示表格全选当页按钮                                                                       | boolean  | true  | |

### CTable 表格拖拽配置
| 属性           | 说明         | 类型        | 默认值   |
|--------------|------------|-----------|-------|
| supportDrag  | 是否支持表格拖拽行  | 	bool     | false | |
| showDragIcon | 是否展示拖拽手柄   | 	bool     | false | |
| onDragAfter  | 表格拖拽行回调    | 	function | -     | |
| dragSelector | 指定表格拖拽的选择器 | 	string   | ''    | |

### CTable 表格固定表头
| 属性           | 说明        | 类型                                                                           | 默认值   |
|--------------|-----------|------------------------------------------------------------------------------|-------|
| sticky       | 表头固定      | 	object { offsetHeader?: number, getContainer?: () => Window / HTMLElement } | {}    | |
| stickyFooter | 表尾固定在页面底部 | 	bool                                                                        | false | |

### CTable 表格排序（此处是全局配置，配置每列的排序详看 columnData 配置）
| 属性                    | 说明                                     | 类型       | 默认值   |
|-----------------------|----------------------------------------|----------|-------|
| sortWidthOriginStatus | 表格排序状态分为升序和降序，配置该参数为 true，排序状态可以恢复原始状态 | 	boolean | false | |
| sortMultiColumns      | 是否支持多个列同时排序                            | 	boolean | false | |

### CTable 表格配置列的显示和隐藏
| 属性                    | 说明          | 类型        | 默认值   |
|-----------------------|-------------|-----------|-------|
| supportConfigColumn   | 是否支持列的显示和隐藏 | 	boolean  | false | |
| configColumnType        | 类型：`default` `complex`   | 	string | default     | |
| defaultShowColumns    | 默认展示的列      | 	Array    | []    | |
| disabledConfigColumns | 不可进行编辑的列    | 	Array    | []    | |
| hideConfigColumns     | 不展示在编辑区域的列  | 	Array    | []    | |
| defaultConfigColumns  | 默认列（恢复默认操作使用，type 为 `complex` 时可用）  | 	Array    | []    | |
| disabledSortColumns | 不可移动顺序的列（只允许设置在列首，type 为 `complex` 时可用）    | 	Array    | []    | |
| onColumnChange        | 改变列后的回调函数   | 	function | -     | |

### CTable 自定义模板配置
| 属性              | 说明                                                                                           | 类型                   | 默认值       |
|-----------------|----------------------------------------------------------------------------------------------|----------------------|-----------|
| footerTpl       | 自定义 footer                                                                                   | function             | -         | |
| footerHeight    | 分页部分高度，设置 footerTpl，需要设置 footerHeight                                                        | number               | undefined | |
| footerSelectTpl | 自定义 已选n条 模板                                                                                  | HTMLElement          | null      | |
| footerTotalTpl  | 自定义 共n条 模板                                                                                   | HTMLElement/function | null      | |
| emptyTpl        | 自定义数据为空模板                                                                                    | function             | -         | |
| emptyText       | 自定义数据为空模板的文本（无需重新配置暂无数据图片）                                                                   | function             | -         | |
| rowClassName    | 自定义行类名                                                                                       | function             | -         | |
| lightCheckedRow | 选中行高亮                                                                                        | boolean              | false     | |
| disabledData    | 禁用行（也可以通过给 data 设置 disabled: true 来实现禁用行）                                                    | array                | []        | |
| loadingOpts     | 表格自定义loading属性，详细见**Loading**组件：https://cloud-react.shuyun.com/v1/cloud-react/action/loading | object               | []        | |
| loadingTpl      | 自定义 loading                                                                                  | function             | -         | |

### CTable 业务相关配置
| 属性                   | 说明                              | 类型       | 默认值   |
|----------------------|---------------------------------|----------|-------|
| isDelay              | 刷新表格时，是否延迟loading，一般在纯前端表格中使用   | boolean  | false | |
| isCheckboxFixed      | 是否固定多选框列或单选框列                   | boolean	 | false | |
| ~~useCustomScroll~~  | ~~业务中是否使用自定义滚动条~~，无需设置，原设置过的不影响 | 	boolean | true  | |
| scrollIntoTop        | 翻页后表格自动滚到顶部                     | 	boolean | true  | |
| reloadAfterSetColumn | 重新设置表格列后，是否需要刷新表格               | 	boolean | false | |
| disablePageOnLoad    | 切换分页，数据未返回时，是否需要禁用分页按钮          | 	boolean | true  | |
| watchColumnData      | 是否监听 columnData 变化              | 	boolean | false | |
| useRootWindow        | window 对象是否使用根 window           | 	boolean | false | |
| hideEmptyFooter      | 配置表格无数据返回，不展示 footer            | 	boolean | false | |

### CTable 其他功能配置
| 属性                  | 说明                           | 类型       | 默认值   |
|---------------------|------------------------------|----------|-------|
| supportResizeColumn | 是否支持配置列的拉伸                   | boolean	 | false | |
| summaryData         | 表格合计（API 同 columnData）       | 	array   | []    | |
| showFilterBtn       | 过滤下拉是否展示确认取消按钮               | 	boolean | false | |
| tooltipConfigs      | 表格行展示tooltip，详见**表格禁用行**Demo | 	array   | []    | |
| rcTableConfig      | rcTable 配置，API 详见 https://table-react-component.vercel.app/ | 	object   | {}    | |

[comment]: <> (| supportConfigColumn | 是否支持配置列的隐藏和展示  | boolean	   |   false   | |)

[comment]: <> (| supportMemory | 是否开启表格记忆功能（开发中）  | boolean     |   false   | | )

[comment]: <> (| tableId | 表格ID。supportMemory 为 true 的时候，需要设置 tableId；其他场景无需设置（开发中）  | string     |   ''   | | )

### CTable columnData
| 属性                 | 说明                                                                                                                                       | 类型                     | 默认值     |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------|------------------------|---------|
| title              | 表头                                                                                                                                       | string/function        | -       |
| titleTooltipConfig | 表头tooltip配置                                                                                                                              | object（同 tooltip 组件配置） | {}      |
| titleTooltipAlign  | 表头tooltip展示位置 `left` `right`                                                                                                             | boolean                | `right` |
| dataIndex          | 列对应的唯一标识                                                                                                                                 | string                 | -       |
| align              | 对齐方式 `left` `right` `center`                                                                                                             | string                 | `left`  |
| width              | 列宽                                                                                                                                       | string/number          | -       |
| fixed              | 是否固定列                                                                                                                                    | boolean                | false   |
| ellipsis           | 文字超出显示省略号                                                                                                                                | boolean                | false   |
| render             | 自定义列模板                                                                                                                                   | function               | -       |
| sortable           | 是否支持排序                                                                                                                                   | boolean                | false   |
| sorter             | 自定义列排序规则                                                                                                                                 | function               | -       |
| sortBy             | 指定列默认排序规则（正序/倒叙）`ASC` `DESC`                                                                                                             | string                 | ''      |
| onCell             | 为每个单元格设置自定义参数 Function(record, index)                                                                                                    | function               | -       |
| minWidth           | 列最小宽度（**该属性效果不流畅，可以给 columnData 中的每一项都设置 width 属性，可达到同样效果**）                                                                             | number                 | -       |
| filters            | 配置表格列筛选项 [{ text: '男', value: 'male' }, { text: '女', value: 'female' }]                                                                  | array                  | []      |
| className          | 给列设置类名                                                                                                                                   | string                 | ''      |
| type               | 列模板类型，可传值：数字类型-`NUMBER`、时间类型-`TIME`、时间范围类型-`TIME_RANGE`、文本类型-`TEXT`、链接类型-`LINK`、标签类型-`TAG` | string                 | -       |
| typeConfig         | 搭配 type 使用，支持参数详见下表 ⬇️                                                                                                                   | object                 | {}      |

**（1）type 为 数字类型-`NUMBER`**
（_可根据下表配置 typeConfig，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-数值类型)；也可以使用组件形式 <Table.NumberTpl/>，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-使用列模板形式)_）
| 属性                | 说明                                         | 类型                        | 默认值           |
| ------------------- | -------------------------------------------- | --------------------------- | ---------------- |
| value            | 展示值，使用组件的形式必传，使用 typeConfig 忽略此字段             | number                 | -                |
| typeConfig.precision            | 数值保留的小数位数              | number                 | 0                |
| typeConfig.isThousands            | 是否使用千分位格式              | bool                 | true                |
| typeConfig.prefix            | 前缀              |  string                 | ''                |
| typeConfig.suffix            | 后缀              |  string                 | ''                |

**（2）type 为 时间类型-`TIME`**
（_可根据下表配置 typeConfig，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-时间类型)；也可以使用组件形式 <Table.TimeTpl/>，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-使用列模板形式)_）
| 属性                | 说明                                         | 类型                        | 默认值           |
| ------------------- | -------------------------------------------- | --------------------------- | ---------------- |
| value            | 展示值，使用组件的形式必传，使用 typeConfig 忽略此字段             | string                 | -                |
| typeConfig.format            | 格式化日期，和 moment.js format 支持参数一致，例如：YYY-MM-DD HH:MM:SS              | string                 | -                |

**（3）type 为 时间范围类型-`TIME_RANGE`**
（_可根据下表配置 typeConfig，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-时间范围类型)；也可以使用组件形式 <Table.TimeRangeTpl/>，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-使用列模板形式)_）
| 属性                | 说明                                         | 类型                        | 默认值           |
| ------------------- | -------------------------------------------- | --------------------------- | ---------------- |
| value            | 展示值，使用组件的形式必传，使用 typeConfig 忽略此字段             | string                 | -                |
| typeConfig.format            | 格式化日期，和 moment.js format 支持参数一致，例如：YYY-MM-DD HH:MM:SS              | string                 |  -               |
| typeConfig.startKey            | 开始时间的 key 值             | string                 | -                |
| typeConfig.endKey            | 结束时间的 key 值             | string                 | -                |
| typeConfig.startValue            | 开始时间值             | string                 | -                |
| typeConfig.endValue            | 结束时间值             | string                 | -                |

**（4）type 为 文本类型-`TEXT`**
（_可根据下表配置 typeConfig，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-文本类型)；也可以使用组件形式 <Table.LinkTpl/>，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-使用列模板形式)_）
| 属性                | 说明                                         | 类型                        | 默认值           |
| ------------------- | -------------------------------------------- | --------------------------- | ---------------- |
| value            | 展示值，使用组件的形式必传，使用 typeConfig 忽略此字段             | string                 | -                |
| typeConfig.line            | 展示行数            | number                 | 1                |

**（5）type 为 链接类型-`LINK`**
（_可根据下表配置 typeConfig，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-文本类型)；也可以使用组件形式 <Table.LinkTpl/>，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-使用列模板形式)_）
| 属性                | 说明                                         | 类型                        | 默认值           |
| ------------------- | -------------------------------------------- | --------------------------- | ---------------- |
| value            | 展示值，使用组件的形式必传，使用 typeConfig 忽略此字段             | string                 | -                |
| typeConfig.line            | 展示行数            | number                 | 1                |
| typeConfig.linkKey            | 链接 key（取自 row 中的字段）             | string                 | ''                |
| typeConfig.link            | 链接值             | string                 | ''                |
| typeConfig.onClick            | 点击链接的回调函数             | func                 | -                |

**（6）type 为 标签类型-`TAG`**
（_可根据下表配置 typeConfig，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-标签类型)；也可以使用组件形式 <Table.TagTpl/>，查看 [Demo](https://cloud-react.shuyun.com/v1/cloud-react/data/c-table#标准化表格-使用列模板形式)_）
| 属性                | 说明                                         | 类型                        | 默认值           |
| ------------------- | -------------------------------------------- | --------------------------- | ---------------- |
| value            | 展示值，使用组件的形式必传，使用 typeConfig 忽略此字段             | string                 | -                |
| typeConfig.formatValue            | 格式化 value             | function                 | -                |


**注意事项**

列表数据中包含 `disabled` 和 `checked` 关键字，若不启用 禁用行 和 选中行 功能，请勿将该字段传递到表格数据中！

### 二、代码演示

### 基础表格

<embed src="@components/c-table/demos/basic.md" /> 

### 表头带线条

<embed src="@components/c-table/demos/header-bordered.md" /> 

### 全边框表格

<embed src="@components/c-table/demos/bordered.md" /> 

### 多选表格

<embed src="@components/c-table/demos/checkbox.md" /> 

<embed src="@components/c-table/demos/checkbox1.md" /> 

### 单选表格

<embed src="@components/c-table/demos/radio.md" /> 

### 树状表格（两级）

<embed src="@components/c-table/demos/tree.md" /> 

### 树状表格（多级）

<embed src="@components/c-table/demos/tree1.md" /> 

### 表格可编辑

<embed src="@components/c-table/demos/edit.md" /> 

### 表格展开行

<embed src="@components/c-table/demos/expand-row.md" /> 

### 表格带图标

<embed src="@components/c-table/demos/custom-column-icon.md" /> 

<embed src="@components/c-table/demos/custom-column-icon-link.md" /> 

<embed src="@components/c-table/demos/custom-column-tag.md" /> 

### 表格固定列

<embed src="@components/c-table/demos/fixed-column.md" /> 

### 表格分组

<embed src="@components/c-table/demos/group.md" /> 

### 表格通栏

<embed src="@components/c-table/demos/fullColumn.md" /> 

### 表尾合计

<embed src="@components/c-table/demos/summary.md" />

### 表格合并列/行

<embed src="@components/c-table/demos/row-col-span.md" /> 

### 表格行高亮

<embed src="@components/c-table/demos/light-row.md" /> 

### 点击行高亮

<embed src="@components/c-table/demos/light-click-row.md" />

### 表格排序

<embed src="@components/c-table/demos/sort-with-page.md" /> 

<embed src="@components/c-table/demos/sort-front.md" /> 

<embed src="@components/c-table/demos/sort-store.md" /> 

### 表格过滤

<embed src="@components/c-table/demos/filter.md" />

### 手动刷新表格

<embed src="@components/c-table/demos/refresh-table.md" /> 

### 表格禁用行

<embed src="@components/c-table/demos/disabled0.md" /> 

<embed src="@components/c-table/demos/disabled1.md" /> 

<embed src="@components/c-table/demos/disabled2.md" /> 

### 表格行拖拽

<embed src="@components/c-table/demos/drag.md" /> 

<embed src="@components/c-table/demos/drag1.md" />

### 表格列拉伸

<embed src="@components/c-table/demos/resize.md" />

<embed src="@components/c-table/demos/resize1.md" />

### 表格固定表头和表尾

<embed src="@components/c-table/demos/sticky.md" />

### 表格懒加载

<embed src="@components/c-table/demos/lazyload.md" />

### 虚拟列表

<embed src="@components/c-table/demos/virtual-list.md" />

### 列设置
<embed src="@components/c-table/demos/config-column-basic.md" />
<embed src="@components/c-table/demos/config-column.md" />


### 分体式表格（灵活）

<embed src="@components/c-table/demos/splitTable.md" />

### 标准化列表格

#### 数值类型
<embed src="@components/c-table/demos/uniform_number.md" />

#### 时间类型
<embed src="@components/c-table/demos/uniform_time.md" />

#### 时间范围类型
<embed src="@components/c-table/demos/uniform_time_range.md" />

#### 文本类型

<embed src="@components/c-table/demos/uniform_text.md" />

#### 标签类型
<embed src="@components/c-table/demos/uniform_tag.md" />

#### 使用列模板形式
<embed src="@components/c-table/demos/uniform_tpl.md" />

### 解决方案

<embed src="@components/c-table/demos/setColumn.md" />

<embed src="@components/c-table/demos/front-table2.md" />

<embed src="@components/c-table/demos/goods-table.md" />

[comment]: <> (<embed src="@components/c-table/demos/front-table.md" />)

[comment]: <> (<embed src="@components/c-table/demos/front-table1.md" />)

[comment]: <> (<embed src="@components/c-table/demos/front-table2.md" />)

<embed src="@components/c-table/demos/table-in-tab.md" />
