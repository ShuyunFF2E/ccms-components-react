---
order: 1 title: ComplexRadio desc: 默认样式
---

```jsx
import React, { useState, useEffect } from 'react';
import { ComplexRadio, Radio, Button } from 'cloud-react';

export default function ComplexRadioDemo() {
  const [value, setValue] = useState();

  const onChange = (value) => {
    console.log('AAAA', value);
    setValue(value);
  };

  return (
    <div>
      <div style={{ marginBottom: 50 }}>
        <h5>标题+头像</h5>
        <ComplexRadio
          radioClassName="test1"
          className="test2"
          titleStyle={{ minWidth: 'fit-content' }}
          title="单选文字"
          imgSrc="https://brand-guide.shuyun.com/IAM/52e939494f3b.png"
          value="A"
          checked
        />
      </div>
      <div style={{ marginBottom: 50 }}>
        <h5>标题+说明</h5>
        <ComplexRadio
          titleStyle={{ minWidth: 'fit-content' }}
          title="单选文字"
          content="说明文案"
          value="A"
          checked
        />
      </div>
      <div>
        <h5>标题+说明+头像</h5>
        <ComplexRadio
          titleStyle={{ minWidth: 'fit-content' }}
          title="单选文字"
          content="说明文案"
          value="A"
          imgSrc="https://brand-guide.shuyun.com/IAM/52e939494f3b.png"
          checked
        />
      </div>
    </div>
  );
}
```
