---
order: 2
title: 基本使用 - 分类 可选择
desc: 对物件进行类型选择, onClick使用
---

````javascript
import React from 'react';
import Tag from 'cloud-react/tag';

export default class TagDemo extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			tags: [
				{ text: '游泳', checked: true },
				{ text: '冲浪', checked: true },
				{ text: '潜水', checked: false },
				{ text: '攀岩', checked: false, disabled: true },
				{ text: '空中瑜伽', checked: true, disabled: true }
			]
		};
	}

	handleClick = index => {

		const tagList = this.state.tags.map((item, _index) => {
			return {
				...item,
				checked: index === _index ? !item.checked : item.checked
			}
		});

		this.setState({
			tags: tagList
		});

	}

	render() {

		const { tags } = this.state;

		return (
			<>
				<label>时尚的运动：</label>
				{
					tags.map(({ checked, disabled, text }, index) => (
						<Tag
							key={index}
							checked={checked}
							disabled={disabled}
							onClick={ () => this.handleClick(index) }>
							{text}
						</Tag>
					))
				}
			</>
		);
	}
}

````
