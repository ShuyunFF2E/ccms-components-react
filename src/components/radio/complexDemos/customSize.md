---
order: 1 title: ComplexRadio desc: 默认样式
---

```jsx

/**
 * title: 自定义宽高
 * desc: 卡片宽度有最小值，如果业务方要求卡片宽度比最小宽度小，需要自行设置
 */
import React, { useState, useEffect } from 'react';
import { ComplexRadio, Radio, Button } from 'cloud-react';

export default function ComplexRadioDemo() {
  const [value, setValue] = useState();
  const radioList = [
    { label: '淘系用户复购', value: 'A', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '对私域中绑定了淘系账号的客户进行群发' },
    { label: '自定义人群', value: 'B', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '自定义筛选客户进行群发' },
    { label: '单选文字1', value: 'C', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '说明文案1' },
    { label: '单选文字2', value: 'D', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '说明文案2' },
    { label: '单选文字3', value: 'E', imgSrc: 'https://brand-guide.shuyun.com/IAM/52e939494f3b.png', content: '说明文案3' }
  ];

  const onChange = (value) => {
    console.log('AAAA', value);
    setValue(value);
  };

  return (
    <div>
      <h5>自定义卡片宽高</h5>
      <Radio.Group value={value} defaultValue={"E"} onChange={onChange} horizontal style={{ flexWrap: 'wrap' }}>
        {radioList.map((item, index) => (
          <ComplexRadio
            style={{ width: 180, height: 100 }}
            titleStyle={{ minWidth: 100 }}
            title={item.label}
            content="对私域中绑定了淘系账号的客户进行群发"
            value={item.value}
            type="card"
            disabled={index > 2}
          />
        ))}
      </Radio.Group>
    </div>
  );
}
```
