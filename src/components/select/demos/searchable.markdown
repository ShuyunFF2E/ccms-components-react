---
order: 4
title: 带搜索的单选
desc: 可对选项进行搜索
---

````javascript
import React from 'react';
import Select from 'ccms-components-react/select';

const Option = Select.Option;

const dataList = [{
  label: '苹果',
  value: 'apple'
}, {
  label: '草莓',
  value: 'strawberry'
}, {
  label: '荔枝',
  value: 'litchi'
}]

export default function SelectDemo() {
  const handleChange = value => {
    console.log('select --- ' + value);
  }

  const handleSearch = value => {
    console.log(value);
  }

  return (
    <Select
      searchable
      placeholder="带搜索的下拉单选"
      onSearch={handleSearch}
      onChange={handleChange}>
      {
        dataList.map((item, index) => (
          <Option value={item.value} key={index} >{item.label}</Option>
        ))
      }
    </Select>
  )
}
````
