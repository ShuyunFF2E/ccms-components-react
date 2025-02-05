---
title: Tooltip 文字提示
nav:
  title: Tooltip 文字提示
  path: /cloud-react
group:
  order: 1
  title: 通用
  path: /common
---

### 何时使用

鼠标移入则显示提示，移出消失。

可用来代替系统默认的 `title` 提示。

### API

| 参数              | 说明                                                                                                                                                    | 类型     | 默认值        |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------| -------- | ------------- |
| content         | 内容（可以为任意一段 html 内容）                                                                                                                                   | string   |               |
| theme           | 主题, 可选 `dark` `light` `error`                                                                                                                         | string   | dark          |
| trigger         | 触发方式 `hover` `click`                                                                                                                                  | string   | hover         |
| visible         | 用于手动控制浮层显隐                                                                                                                                            | boolean  | undefined             |
| control         | 配置成true，结合visible使用，实现手动控制浮层显隐 | boolean | false |
| onVisibleChange | 显示隐藏的回调                                                                                                                                               | (visible: boolean) => void  | () => {}       |
| container       | <del>渲染节点，默认渲染到 body 上(如果指定容器，将会给指定容器添加 position:relative)，<b style="color: red">已废弃</b></del>                                                        | function | document.body |
| mouseEnterDelay | 鼠标移入后延时多少才显示 Tooltip，单位：毫秒                                                                                                                            | number   | 1             |
| mouseLeaveDelay | 鼠标移出后延时多少才隐藏 Tooltip，单位：毫秒                                                                                                                            | number   | 1             |
| placement       | 气泡框位置，可选 `auto` `top` `left` `right` `bottom` `top-left` `top-right` `bottom-left` `bottom-right` `left-top` `left-bottom` `right-top` `right-bottom` | string   | auto          |
| className       | 设置类样式                                                                                                                                                 | string   | ''            |
| overlayStyle    | 自定义卡片样式                                                                                                                                               | object   | {}            |
| alwaysShow      | 设置 visible 为 true 后，点击其他位置，tooltip 不消失                                                                                                                | bool   | false            |
| showArrow       | 配置箭头的显隐，默认为true                                                                                                                                       | bool   | false            |
| scrollContainer | 设置滚动根节点， 代码根据此根节点计算提示语的偏移量 | DOM | document.body |

 ### 代码演示 

### 位置
<embed src="@components/tooltip/demos/placement.md" /> 

### 受控
<embed src="@components/tooltip/demos/control.md" />

### 主题
<embed src="@components/tooltip/demos/theme.md" /> 

### 触发方式
<embed src="@components/tooltip/demos/tigger.md" />

### 配置箭头显隐
<embed src="@components/tooltip/demos/showArrow.md" />

### 解决方案
<embed src="@components/tooltip/demos/select.md" />
