---
title: 外部控制触发
desc: 手动触发tooltip。
---

```jsx

            /**
             * title: 外部控制触发
             * desc: 手动触发tooltip。
             */
import React from 'react';
import { Button, Tooltip } from 'cloud-react';

class ToolTipDemo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: 'click close toolTip',
			show: false
		};
	}

	onChangeStatus = () => {
		this.setState({ show: !this.state.show });
	};

	onStatusChange = show => {
		console.log(show)
		this.setState({ show });
	};

	render() {
		const { content, show } = this.state;
		const style = { marginRight: '10px' };
		return (
			<div id="wrap" className="wrapClass">
				<Button style={style} onClick={this.onChangeStatus}>
					{show ? 'Close' : 'Show'} tooltip
				</Button>
				<Tooltip content={content} placement="top" visible={show} control onVisibleChange={this.onStatusChange}>
					<span>Click button to {show ? 'close' : 'show'} toolTip.</span>
				</Tooltip>
			</div>
		);
	}
}
export default ToolTipDemo;
```
