---
order: 1
title: 分页基础用法
desc: 基础分页。
---

````javascript
import React from 'react';
import Pagination from 'ccms-components-react/pagination';


export default class PaginationDemo extends React.Component {
	state = {
		current: 1,
		pageSize: 10
	}

	onChange = (current, pageSize) => {
		console.log('current: %d,pageSize: %s', current, pageSize)
		this.setState({
			current,
			pageSize
		})
	}

	render() {
		return (
			<>
				<Pagination
					onChange={this.onChange}
					total={50}
					current={this.state.current}
					pageSize={this.state.pageSize}
				/>
			</>
		);
	}
}
````
