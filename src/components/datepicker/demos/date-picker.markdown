---
order: 4
title: 日期选择器
desc: 基本用法，日期选择器。
---

````javascript
import React from 'react';
import DatePicker from 'cloud-react/datepicker';


export default class DatePickerDemo extends React.Component {
	
	onInpChange = value => console.log(value);
	
	render() {
		return (
			<div>
			   <DatePicker showToday={true} maxDate={new Date('2019/11/5')} onChange={this.onInpChange} placeholder="年月日" />
			   <br /><br />
			   <DatePicker showNow={true} mode="DATE_HOUR" onChange={this.onInpChange}  showTimePicker={true}  placeholder="年月日 时" />
			   <br /><br />
			   <DatePicker showNow={true} mode="DATE_HOUR_MINUTE" onChange={this.onInpChange} showTimePicker={true} placeholder="年月日 时分"/>
			   <br /><br />
			   <DatePicker showNow={true} showTimePicker={true} onChange={this.onInpChange} placeholder="年月日 时分秒"/>
			</div>
		);
	}
}
````
