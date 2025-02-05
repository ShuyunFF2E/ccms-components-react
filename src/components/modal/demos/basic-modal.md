---
order: 6
title: 基础用法
desc: 使用modal打开基本对话框，点击遮罩区域关闭对话框
---

```jsx

            /**
             * title: 基础用法
             * desc: 使用modal打开基本对话框，点击遮罩区域关闭对话框
             */
import React from 'react';
import { Button, Modal, Select, CPicker, Radio, Form, Message } from 'cloud-react';

const { RangePicker } = CPicker;

const blank = '\u00A0';

class ModalDemo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
	}

	// 打开可在遮罩区域关闭的弹出框
	openMaskCloseModal = () => {
		this.setState({
			visible: true,
			showMask: true,
			clickMaskCanClose: true
		});
	};

	// 打开无遮罩层对话框
	openHideMaskModal = () => {
		this.setState({
			visible: true,
			showMask: false
		});
	};

	// 确认按钮回调函数
	handleOk = () => {
		this.setState({
			visible: false
		});
	};

	// 关闭回调函数
	handleClose = () => {
		this.setState({
			visible: false
		});
	};

	handleCancel = () => {
		this.setState({
			visible: false
		});
	};

	showMessage = () => {
		Message.info('你点击了提交按钮');
	};

	render() {
		return (
			<div>
				<Button type="primary" onClick={this.openMaskCloseModal}>
					点击遮罩区域关闭对话框
				</Button>
				{blank}
				<Button type="normal" onClick={this.openHideMaskModal}>
					不显示遮罩层
				</Button>
				<Modal
					title="异步关闭"
					okBtnOpts={{ type: 'primary' }}
					cancelBtnOpts={{ type: 'secondary' }}
					size="medium"
					visible={this.state.visible}
					showMask={this.state.showMask}
					isReverseBtn={true}
					clickMaskCanClose={this.state.clickMaskCanClose}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					onClose={this.handleClose}>
					<Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
						<Form.Item label="下拉选择">
							<Select isAppendToBody style={{ width: 200 }}>
								<Select.Option value={12}>选择我没错的</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item label="日期组件">
							<RangePicker allowClear showToday />
						</Form.Item>
						<Form.Item label="你的性别">
							<Radio.Group defaultValue={1}>
								<Radio value={1}>男</Radio>
								<Radio value={2}>女</Radio>
								<Radio value={3}>未知</Radio>
							</Radio.Group>
						</Form.Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default ModalDemo;
```
