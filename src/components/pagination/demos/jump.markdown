---
order: 4
title: 跳转
desc: 快速跳转到某一页
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
					current={this.state.current}
					total={500}
					pageSize={this.state.pageSize}
					pageSizeOptions={[100,200,300]}
					showPageSizeOptions={true}
					showQuickJumper={true}
				/>
			</>
		);
	}
}
````
