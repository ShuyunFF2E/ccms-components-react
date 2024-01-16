---
order: 1
title: 下拉菜单选择器（新）
desc: 基本用法。
---

```jsx

/**
 * title: 下拉菜单选择器（新）
 * desc: 展示箭头
 */
import React, { useState } from 'react';
import { 
	CDropdown as Dropdown,
	Icon,
	CMenu as Menu,
    Button
} from 'cloud-react';

const { Item } = Menu;

export default class DropdownDemo extends React.Component {

	 handleMenuClick = key => {
        Message.success(`菜单Item onClick ${key}`);
    }

    onOpenChange = e => {
        console.log(`收缩、展开 ${e}`);
        Message.success(`收缩、展开 ${e}`);
    }

	render() {
        // 'bottom', 'bottomLeft', 'bottomRight', 'top', 'topLeft', 'topRight'。
        const style = { display: 'flex', gap: '30px', flexWrap: 'wrap' };
        const overlay = (
            <Dropdown.Menu onClick={this.handleMenuClick}>
                <Dropdown.Item icon={<Icon type="shop-line"/>} id="tenement">租户</Dropdown.Item>
                <Dropdown.Item icon={<Icon type="people"/>} id="client">客户</Dropdown.Item>
                <Dropdown.Item icon={<Icon type="group"/>} id="clientBase">客户群</Dropdown.Item>
            </Dropdown.Menu>
        );
		return (
            <div>
                <p style={{ marginBottom: 10 }}>箭头居中</p>
                <div style={style}>
                    <Dropdown
                        arrow={{ pointAtCenter: true }}
                        overlay={overlay}
                        placement="bottom">
                        <Button type="normal">向下-箭头居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow={{ pointAtCenter: true }}
                        overlay={overlay}
                        placement="bottomLeft">
                        <Button type="normal">向左下-箭头居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow={{ pointAtCenter: true }}
                        overlay={overlay}
                        placement="bottomRight">
                        <Button type="normal">向右下-箭头居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow={{ pointAtCenter: true }}
                        overlay={overlay}
                        placement="top">
                        <Button type="normal">向上-箭头居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow={{ pointAtCenter: true }}
                        overlay={overlay}
                        placement="topLeft">
                        <Button type="normal">向左上-箭头居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow={{ pointAtCenter: true }}
                        overlay={overlay}
                        placement="topRight">
                        <Button type="normal">向右上-箭头居中</Button>
                    </Dropdown>
                </div>
                <p style={{ marginTop: 24, marginBottom: 10 }}>箭头不居中</p>
                <div style={{ ...style }}>
                    
                    <Dropdown
                        arrow
                        overlay={overlay}
                        placement="bottom">
                        <Button type="normal">向下-箭头不居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow
                        overlay={overlay}
                        placement="bottomLeft">
                        <Button type="normal">向左下-箭头不居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow
                        overlay={overlay}
                        placement="bottomRight">
                        <Button type="normal">向右下-箭头不居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow
                        overlay={overlay}
                        placement="top">
                        <Button type="normal">向上-箭头不居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow
                        overlay={overlay}
                        placement="topLeft">
                        <Button type="normal">向左上-箭头不居中</Button>
                    </Dropdown>
                    <Dropdown
                        arrow
                        overlay={overlay}
                        placement="topRight">
                        <Button type="normal">向右上-箭头不居中</Button>
                    </Dropdown>
                </div>
            </div>
		);
	}
}
```