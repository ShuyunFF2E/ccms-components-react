---
order: 1
title: Checkbox
desc: 默认样式
---

````javascript
import React, { useState } from 'react';
import Checkbox from 'ccms-components-react/checkbox';


export default function CheckboxDemo() {
	
	const handleChange = (value, checked) => {
		console.log('handleChange', value, checked);
	};
	
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(true);

	const handleIndeterminateChange = (checked, value) => {
		console.log('handleIndeterminateChange', value, checked);
		setChecked(!checked);
		setIndeterminate(false);
	};
	
	return <div>
			<Checkbox>default</Checkbox>
            <br/>
			<Checkbox defaultChecked={true} onChange={handleChange} value={1}>checked</Checkbox>
			<br/>
            <Checkbox indeterminate={indeterminate} defaultChecked={checked} onChange={handleIndeterminateChange} value={2}>indeterminate</Checkbox>
            <br/>
            <Checkbox disabled></Checkbox>
		</div>
}
````
