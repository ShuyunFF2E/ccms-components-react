---
category: Components
title: Input
subtitle: 输入框
---

### 何时使用

需要用户进行输入时。

### API

### Input

| 属性         | 说明                                                        | 类型              | 默认值    |
| ------------ | ----------------------------------------------------------- | ----------------- | --------- |
| disabled     | 是否禁用状态                                                | boolean           | `false`   |
| defaultValue | 输入框默认内容                                              | string            | -         |
| value        | 输入框内容                                                  | string            | -         |
| size         | 输入框大小，可选值为 `large` `default` `small`              | string            | `default` |
| minLength    | 原生属性，最小输入长度                                      | number            | -         |
| maxLength    | 原生属性，最大输入长度                                      | number            | -         |
| prefix       | 带有前缀图标的 input                                        | string\|ReactNode | -         |
| suffix       | 带有后缀图标的 input                                        | string\|ReactNode | -         |
| addonAfter   | 带标签的 input，设置后置标签                                | string\|ReactNode | -         |
| addonBefore  | 带带标签的 input，设置前置标签                              | string\|ReactNode | -         |
| hasCounter   | 计数器，展示当前字数和最大长度，因此需要`maxLength`配合使用 | boolean           | `false`   |
| hasClear     | 可以点击清除图标删除内容                                    | boolean           | `false`   |
| onChange     | 输入框内容变化时的回调                                      | function(event)   | -         |
| onEnter      | 按下键盘回车按键的回调                                      | function(event)   | -         |

`Input` 其他属性保持跟原生一致

### Input.Textarea

| 属性         | 说明                               | 类型            | 默认值     |
| ------------ | ---------------------------------- | --------------- | ---------- |
| disabled     | 是否禁用状态                       | boolean         | `false`    |
| value        | 输入框内容                         | string          | -          |
| defaultValue | 输入框默认内容                     | string          | -          |
| autoSize     | 自适应内容高度                     | boolean         | `false`    |
| minRows      | 最小行数，设置了`autoSize`属性生效 | number          | `1`        |
| maxRows      | 最大行数，设置了`autoSize`属性生效 | number          | `Infinity` |
| rows         | 固定行数                           | number          | -          |
| className    | 输入框的 className 属性            | string          | -          |
| onEnter      | 按下键盘回车按键的回调             | function(event) | -          |

`Input.Textarea` 其他属性保持跟原生一致
