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
    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: "wrap" }}>
      <div>
        <h5>标题+头像</h5>
        <Radio.Group vertical value={value} defaultValue={"E"} onChange={onChange} className="test">
          {radioList.map((item, index) => (
            <ComplexRadio
              title={item.label}
              imgSrc={item.imgSrc}
              value={item.value}
              disabled={index > 3}
            />
          ))}
        </Radio.Group>
      </div>
      <div>
        <h5>标题+说明</h5>
        <Radio.Group vertical value={value} defaultValue={"E"} onChange={onChange}>
          {radioList.map((item, index) => (
            <ComplexRadio
              title={item.label}
              content={item.content}
              value={item.value}
              disabled={index > 3}
            />
          ))}
        </Radio.Group>
      </div>
      <div>
        <h5>标题+说明+头像</h5>
        <Radio.Group vertical value={value} defaultValue={"E"} onChange={onChange}>
          {radioList.map((item, index) => (
            <ComplexRadio
              title={item.label}
              content={item.content}
              value={item.value}
              imgSrc={item.imgSrc}
              disabled={index > 3}
            />
          ))}
        </Radio.Group>
      </div>
    </div>
  );
}
```
