---
order: 1
title: CTable
desc: 虚拟列表
---

```jsx
/**
 * title: 虚拟列表（性能原因，不支持单选和多选）
 * desc: 使用三方库 virtuallist-antd：https://www.npmjs.com/package/virtuallist-antd
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CTable, Pagination, Select, Form } from 'cloud-react';
import { VList } from "virtuallist-antd";

const fetchData = ({ pageNum, pageSize }) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: new Array(pageSize).fill(1).map((item, index) => (
          { id: 121410327 + pageNum + index, name: `手机号优先继续发送${pageNum + index}`, createTime: '2021/12/14 10:19:02', creator: 'liyuan.meng', num: 12222, orderNum: '33,342', status: index % 2 === 0 ? '生效': '失效' }
        )),
        totals: 100
      })
    }, 500)
  })
}

const fetchStatusList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { label: '生效', value: 1 },
        { label: '失效', value: 2 }
      ])
    }, 500)
  })
}

const columns = [
  { title: '活动ID', dataIndex: 'id', width: 230, fixed: 'left' },
  {
    title: '活动名称', dataIndex: 'name', width: 240, render: val => {
      return <CTable.TextTpl value={val} />
    }
  },
  {
    title: '创建时间', dataIndex: 'createTime', width: 240, render: val => {
      return <CTable.TimeTpl value={val} />
    }
  },
  {
    title: '人数',
    dataIndex: 'num',
    align: 'right',
    width: 120,
    render: val => <CTable.NumberTpl value={val} precision={0} />
  },
  { title: '创建人', dataIndex: 'creator', width: 260 }
];

export default function CTableDemo() {
  const [queryParams, setQueryParams] = useState({
    pageNum: 1,
    pageSize: 1000
  })
  const [loading, setLoading] = useState(false);
  const [ajaxData, setAjaxData] = useState({ data: [], totals: 0 });
  
  useEffect(() => {
    setLoading(true);
    fetchData(queryParams).then(res => {
      setAjaxData({
        data: res.data,
        totals: res.totals
      })
    }).finally(() => {
      setLoading(false);
    })
  }, []);
  
  return (
    <div>
      <p style={{ marginBottom: 15 }}>共{ajaxData.data.length}条数据</p>
      <CTable
        style={{ height: 400 }}
        columnData={columns}
        ajaxData={ajaxData}
        loadingOpts={{
          loading,
          layer: true
        }}
        rowKey="id"
        rcTableConfig={{
          components: useMemo(() => {
            return VList({
              height: 400,
              vid: "first"
            });
          }, [])
        }}
      />
    </div>
  );
}
```
