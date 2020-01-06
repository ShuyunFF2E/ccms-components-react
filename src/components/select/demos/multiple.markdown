---
order: 8
title: 是否多选
desc: 下拉多选
---

```javascript
import React from 'react';
import { Select } from 'cloud-react';

const Option = Select.Option;

const dataList = [
	{
		label: '苹果',
		value: 'apple'
	},
	{
		label: '草莓',
		value: 'strawberry'
	},
	{
		label: '荔枝',
		value: 'litchi'
	}
];

export default function SelectDemo() {
	const handleChange = value => {
		console.log(value);
	};

	const handleOpen = () => console.log('open');
	const handleClose = () => console.log('close');

	const values = ['apple', 'strawberry', 'litchi'];
	const values2 = [];

	return (
		<div style={{ display: 'flex', height: 150 }}>
			<Select
				placeholder="请选择..."
				defaultValue={values}
				onSelectOpen={handleOpen}
				onSelectClose={handleClose}
				onChange={handleChange}
				style={{ margin: '0 10px 10px 0', width: 200 }}
				multiple
				searchable
			>
				{dataList.map((item, index) => (
					<Option
						value={item.value}
						disabled={item.disabled}
						key={index}
					>
						{item.label}
					</Option>
				))}
			</Select>

			<Select
				placeholder="请选择..."
				labelInValue={true}
				allowClear
				defaultValue={values2}
				onSelectOpen={handleOpen}
				onSelectClose={handleClose}
				onChange={handleChange}
				style={{ margin: '0 10px 10px 0', width: 200 }}
				multiple
				hasSelectAll
			>
				{dataList.map((item, index) => (
					<Option
						value={item.value}
						disabled={item.disabled}
						key={index}
					>
						{item.label}
					</Option>
				))}
			</Select>

			<Select
				style={{ width: 200 }}
				placeholder="xxxxx"
				defaultValue={values}
				onChange={handleChange}
				dataSource={dataList}
				multiple />
		</div>
	);
}
```
