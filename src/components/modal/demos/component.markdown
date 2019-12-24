---
order: 11
title: 内部使用其他组件
desc: 在modal中使用其他组件
---

```javascript
import React from 'react';
import { Button, Modal, Message, Select, Tabs, Table } from 'cloud-react';

export default class ModalDemo extends React.Component {
	 constructor(props) {
		 super(props);
		 this.state = {
		 	visible: false
		 };
        this.state.dataList = [
            {
                label: '苹果',
                value: 'apple'
            },
            {
                label: '草莓',
                value: 'strawberry'
            }
        ];
	 }

	 // 打开弹出框
	 openBasicModal = () => {
	 	this.setState({
	 		visible: true
	 	});
	 };

	 // 确认按钮回调函数
	 handleOk = () => {
		this.setState({
			visible: false
		});
	 };

     message = () => {
         Message.success('欢迎使用message组件', { duration: 0, contextContainer: document.getElementsByClassName('cloud-modal-container')[0]});
     };

     handleChange = value => {
        console.log(value);
     };

	 render() {
         const Option = Select.Option;
         const resource = (settings, params) => {
            // 返回一个promise
            return fetch('https://www.lovejavascript.com/learnLinkManager/getLearnLinkList').then(res => res.json());
         };
        const columnData = [
            {
                key: 'name',
                text: '名称',
                align: 'left'
            },{
                key: 'info',
                text: '使用说明'
            }
        ];
        const modalStyle = {
            height: '300px'
        };
	 	 return (
			 <div>
				 <Button type='primary' onClick={this.openBasicModal}>使用更多组件</Button>
				 <Modal
				 	title='basic title'
                    bodyStyle={modalStyle}
				 	visible={this.state.visible}
				 	onOk={this.handleOk}
				 	onCancel={this.handleOk}
				 	onClose={this.handleOk}>
                    <Button onClick={this.message}>message组件</Button>
                    <br/><br/>
                    <Select
                        labelInValue
                        placeholder="请选择..."
                        defaultValue="strawberry"
                        onChange={this.handleChange}>
                            {this.state.dataList.map((item, index) => (
                                <Option value={item.value} key={index}>
                                    {item.label}
                                </Option>
                            ))}
                    </Select>
                    <br/>
                    <Tabs defaultActiveKey="eat" onChange={this.handleChange} step={500}>
                        <Tabs.Panel tab="选项1" key='1'>选项1111111111111</Tabs.Panel>
                        <Tabs.Panel tab="禁用我？？" key="bbb3" disabled>试试</Tabs.Panel>
                        <Tabs.Panel tab="选项1" key='14'>选项1111111111111</Tabs.Panel>
                        <Tabs.Panel tab="吃饭" key="eat4">吃饭啊啊啊啊啊</Tabs.Panel>
                        <Tabs.Panel tab="加关闭按钮" key="aaa4" closable>为什么要关掉我！</Tabs.Panel>
                        <Tabs.Panel tab="禁用我？？" key="bbb4" disabled>试试</Tabs.Panel>
                    </Tabs>
                    <br/>
                    <Table
                        gridManagerName="test-table"
                        ajaxData={resource}
                        columnData={columnData}
                    />
				 </Modal>
			 </div>
		 );
	 }
}
```
