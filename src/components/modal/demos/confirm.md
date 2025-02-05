---
order: 2
title: 确认对话框
desc: 通过API调用方式弹出confirm确认对话框
---

```jsx

            /**
             * title: 确认对话框
             * desc: 通过API调用方式弹出confirm确认对话框
             */
import React from 'react';
import { Button, Modal } from 'cloud-react';

const blank = '\u00A0';

class ModalDemo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: ''
		};
	}

	handleOk = () => {
		this.setState({
			content: '你点击了确定'
		});
	};

	openConfirmModal = () => {
		Modal.confirm({
			isShowIcon: false,
			title: '基本确认对话框',
			body: '杭州数云信息技术有限公司是国内领先的全域消费者增长方案提供商',
			cancelBtnOpts: { type: 'secondary' },
			isReverseBtn: true,
			// hasFooter: false,
      //       className: "test",
			onOk: () => {
				this.handleOk();
			},
			onCancel: () => {
				this.setState({
					content: '你点击了取消'
				});
			}
		});
	};

	openCustomerIconConfirmModal = () => {
		Modal.confirm({
			title: '自定义图标确认对话框',
			isShowIcon: true,        
			title: '确定要删除吗？',
			body: '这里是删除后相应状态的描述。',
			onOk: () => {
				this.handleOk();
			},
			onCancel: () => {
				this.setState({
					content: '你点击了取消'
				});
			}
		});
	};


	openCustomConfirmModal = () => {
		Modal.confirm({
			title: '自定义弹窗按钮',
			okText: '好',
			cancelText: '关闭',
			body: '按钮的文案修改了',
			onOk: () => {
				this.setState({
					content: '你点击了好'
				});
			},
			onCancel: () => {
				this.setState({
					content: '你点击了关闭'
				});
			}
		});
	}

	openAsyncConfirmModal = () => {
		Modal.confirm({
			title: '异步弹窗框',
			body: '这是个异步的example，请点击确定按钮测试验证',
			onOk: () => {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve();
						this.handleOk();
					}, 3000);
				}).catch(() => {
					console.log('error');
				});
			},
			onCancel: () => {
				this.setState({
					content: '你点击了取消'
				});
			}
		});
	};

	render() {
		return (
			<div>
				<Button type="primary" onClick={this.openConfirmModal}>
					基础确认对话框+多行文本
				</Button>
				{blank}
				<Button type="primary" onClick={this.openCustomerIconConfirmModal}>
					自定义图标确认对话框
				</Button>
				{blank}
				<Button type="normal" onClick={this.openAsyncConfirmModal}>
					异步确认对话框
				</Button>
				{blank}
				<Button type="normal" onClick={this.openCustomConfirmModal}>
					修改按钮文案
				</Button>
				{blank}
				<br />
				<br />
			</div>
		);
	}
}

export default ModalDemo;
```
