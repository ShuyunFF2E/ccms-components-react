---
order: 4
title: 自定义底部区域是否显示
desc: 设置hasFooter控制底部区域显示/隐藏
---

```javascript
import React from 'react';
import Modal from '../index';
import Button from 'ccms-components-react/button';
const blank = '\u00A0';

export default class ModalDemo extends React.Component {
	 constructor(props) {
		 super(props);
		 this.state = {
		 	visible: false,
		 	hasFooter: true
		 };
	 }
	 
	 // 打开带底部区域的弹出框
	 openHasFooterModal = () => {
		this.setState({
			visible: true,
			hasFooter: true
		});
	 };
	 // 打开不带底部区域的弹出框
	 openNoFooterModal = () => {
		this.setState({
			visible: true,
			hasFooter: false
		});
	 };
	 
	 handleOk = () => {
	 	this.setState({
			visible: false
		});
	 };
	 
	 handleClose = () => {
	 	this.setState({
			visible: false
		});
	 };
	 
	 render() {
		 return (
			 <div>
				 <Button type='primary' onClick={this.openNoFooterModal}>隐藏底部区域弹出框</Button>
				 {blank}
				 <Button type='normal' onClick={this.openHasFooterModal}>显示底部区域弹出框</Button>
				 <br/>
				 <Modal 
				 	visible={this.state.visible}
				 	hasFooter={this.state.hasFooter}
				 	onOk={this.handleOk}
				 	onCancel={this.handleClose}
					onClose={this.handleClose}>
				 	this is a has or no Footer demo
				 </Modal>
			 </div>
		 );
	 }
}
```
