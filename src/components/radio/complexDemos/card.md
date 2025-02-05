---
order: 1 title: ComplexRadio desc: 默认样式
---

```jsx
import React, { useState, useEffect } from 'react';
import { ComplexRadio, Radio, Button } from 'cloud-react';

export default function ComplexRadioDemo() {
  const [value, setValue] = useState();
  const radioList = [
    { label: '单选文字', value: 'A', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '说明文案' },
    { label: '单选文字', value: 'B', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '说明文案' },
    { label: '单选文字', value: 'C', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '说明文案' },
    { label: '单选文字', value: 'D', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '说明文案' },
    { label: '单选文字', value: 'E', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '说明文案' }
  ];

  const onChange = (value) => {
    console.log('AAAA', value);
    setValue(value);
  };

  return (
    <div>
      <div>
        <h5>基础卡片</h5>
        <Radio.Group value={value} defaultValue={"E"} onChange={onChange} horizontal style={{ flexWrap: 'wrap' }} className="test">
          {radioList.map((item, index) => (
            <ComplexRadio
            radioClassName="test1"
              className="test2"
              title={item.label}
              value={item.value}
              type="card"
              disabled={index > 2}
            />
          ))}
        </Radio.Group>
      </div>
      <div>
        <h5>基础卡片 + 说明</h5>
        <Radio.Group value={value} defaultValue={"E"} onChange={onChange} vertical>
          {radioList.map((item, index) => (
            <ComplexRadio
              title={item.label}
              content={item.content}
              value={item.value}
              type="card"
              disabled={index > 2}
            />
          ))}
        </Radio.Group>
      </div>
    </div>
  );
}
```
