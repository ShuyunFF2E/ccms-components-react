---
title: 在 Select 上使用 Tooltip
desc: 
---

```jsx

            /**
             * title: 在 Select 上使用 Tooltip
             * desc: 切换 Select 下拉内容时，Tooltip 内容也会切换。若不生效，可以给 Tooltip 添加 key={value}
             */
import React, { useState } from 'react';
import { Select, Tooltip } from 'cloud-react';

function ToolTipDemo() {
  const list = [
    { label: '数据赢家', value: '1' },
    { label: '淘域赢家', value: '2' },
    { label: '私域赢家', value: '3' },
    { label: '微信会员中心', value: '4' }
  ];
  const [value, setValue] = useState('1');

  return (
    <Tooltip content={list.find(item => item.value === value).label}>
      <Select
        value={value}
        onChange={setValue}
        dataSource={list}
      />
    </Tooltip>
  );
}
export default ToolTipDemo;
```
