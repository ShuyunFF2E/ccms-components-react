---
title: Radio 单选按钮
nav:
  title: Radio 单选按钮
  path: /cloud-react
group:
  order: 3
  title: 数据
  path: /data
---

### 何时使用

定义一组 radio

### API Radio.Group

| 属性         | 说明                    | 类型                       | 默认值 |
| ------------ | ----------------------- | -------------------------- | ------ |
| defaultValue | 默认 radio 选中的值     | any                        | --     |
| value        | 设置当前选中的值        | any                        | --     |
| onChange     | 选中 radio 的回调函数   | function(value, evt:Event) | --     |
| disabled     | 定义内部 radio 是否禁用 | boolean                    | false  |
| horizontal   | 定义 radio 横向布局     | boolean                    | false  |
| vertical     | 定义 radio 竖向布局     | boolean                    | false  |
| textStyle      | 复选框后面的内容样式      | object            | {}     |
| onChange       | 变化时回调函数          | Function(e:Event) | --     |
| supportUnSelect       | 变化时回调函数          | Function(e:Event) | --     |
| className       | RadioGroup 类名          | string | --     |

### API Radio

| 属性     | 说明                    | 类型    | 默认值 |
| -------- | ----------------------- | ------- | ------ |
| value    | 当前 radio 对应的值     | any     | --     |
| checked  | 指定当前 radio 是否选中 | boolean | false  |
| disabled | 是否禁用                | boolean | false  |
| desc       | 单选提示         | string 或 React.node  | null    |
| supportUnSelect       | 是否支持反选         |  boolean  | false   |
| radioClassName       | Radio 和 ComplexRadio 类名       |  string  | --   |

### API ComplexRadio

*ComplexRadio 支持 Radio 的基础属性。*

*业务方自己设置 `卡片Radio` 的宽高时，会存在一些样式问题，这是历史原因，需要业务方自行调整，可查看 [自定义卡片式Radio宽高](https://cloud-react.shuyun.com/v1/cloud-react/data/radio#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8D%A1%E7%89%87%E5%BC%8F-radio-%E7%9A%84%E5%AE%BD%E9%AB%98)*

| 属性           | 说明                    | 类型              | 默认值 |
| -------------- | ----------------------- | ----------------- | ------ |
| content | 内容        | string ｜ number           | ''     |
| title | 标题        | string           | ''     |
| imgSrc        | 图片     | string           | ''     |
| checked        | 选中     | boolean           | false     |
| disabled        | 禁用     | boolean           | false     |
| type | 显示类型 | "card" | "default" | "default"|
| value        | 当前 radio 对应的值     | any           | --     |
| textOverflowEllipsis        | content 超长显示 ...     | boolean           | false     |
| contentStyle        | content 样式，设置 textOverflowEllipsis 为 true 的时候，需要设置 content 的宽度    | object           | {}     |
| titleStyle        | title 样式    | object           | {}     |
| borderRadiusSize       | 圆角大小： `small`: 3px；`default`: 6px；`large`: 12px；         | string | `default`     |
| supportUnSelect       | 是否支持反选         |  boolean  | false   |


### 代码演示
### 基础 Radio
<embed src="@components/radio/demos/basic-radio.md" />

<embed src="@components/radio/demos/complex.md" />

### 禁用
<embed src="@components/radio/demos/disabled.md" />

### 基础 RadioGroup
<embed src="@components/radio/demos/group.md" />

### 布局
<embed src="@components/radio/demos/layout.md" />

### 反选
<embed src="@components/radio/demos/unSelect.md" />

### 复杂 Radio
<embed src="@components/radio/complexDemos/basic.md" />

### 复杂 RadioGroup
<embed src="@components/radio/complexDemos/group.md" />

### 卡片式 Radio
<embed src="@components/radio/complexDemos/card.md" />

### 自定义卡片式Radio宽高
<embed src="@components/radio/complexDemos/customSize.md" />
