---
order: 5
title: Radio.Group
desc: 复杂业务场景嵌套使用
---

```jsx
/**
 * title: Radio.Group
 * desc: 复杂业务场景嵌套使用
 */
import React from 'react';
import { Radio } from 'cloud-react';

class NestingRadio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parentValue: 1,
      childValue: 1,
    };
  }

  onParentChange = (value) => {
    this.setState({
      parentValue: value,
    });
    console.log(value, 'parentValue');
  };

  onChildChange = (value) => {
    this.setState({
      childValue: value,
    });
    console.log(value, 'childValue');
  };

  render() {
    return (
      <>
        <Radio.Group
          value={this.state.parentValue}
          onChange={this.onParentChange}
          vertical
        >
          <div>
            <Radio value={1}>React</Radio>
          </div>
          <Radio value={2}>Vue</Radio>
          <Radio value={3}>JQuery</Radio>
        </Radio.Group>
        <h2>数据库</h2>
        <Radio.Group
          className="test"
          value={this.state.childValue}
          onChange={this.onChildChange}
          vertical
        >
          <Radio value={1} radioClassName="test1" className="test2">mysql</Radio>
          <Radio value={2}>mogondb</Radio>
        </Radio.Group>
      </>
    );
  }
}

export default NestingRadio;
```
