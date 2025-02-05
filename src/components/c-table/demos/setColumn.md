```jsx

/**
 * title: 解决 columnData 中 render 闭包问题
 * desc: 使用 setColumnData 解决在 columnData 中 render 闭包问题（在 render 中使用外部数据，外部数据改变，render 中数据未更新）
 */
import React, { useState, useEffect, createRef } from 'react';
import { CTable, Button } from 'cloud-react';

const data = [
  {
    id: '121410322',
    name: 'ouid疲劳度2',
    createTime: '2021/12/13 15:47:33',
    creator: 'jiaojiao.diao',
    num: 198,
    orderNum: '122',
    status: 'success',
  },
  {
    id: '121410323',
    name: '继续发送手机3',
    createTime: '2021/12/13 15:36:42',
    creator: 'nan.run',
    num: 1232,
    orderNum: '1332',
    status: 'fail',
  },
  {
    id: '121410321',
    name: '手机号优先继续发送1',
    createTime: '2021/12/14 10:19:02',
    creator: 'liyuan.meng',
    num: 12222,
    orderNum: '33342',
    status: 'waiting',
  },
  {
    id: '121410324',
    name: '继续发送手机4',
    createTime: '2021/12/13 11:14:40',
    creator: 'xiaotong.fan',
    num: 12122112,
    orderNum: 112122112,
    status: 'success',
  },
  {
    id: '121410325',
    name: '继续发送手机5',
    createTime: '2021/12/13 11:03:05',
    creator: 'zhenxiao.guo',
    num: 1000000,
    orderNum: 200000,
    status: 'fail',
  },
  ...new Array(20).fill(1).map((item, index) => (
    {
      id: `${121410327 + index}`,
      name: `手机号优先继续发送${index}`,
      createTime: '2021/12/14 10:19:02',
      creator: 'liyuan.meng',
      num: '12,222',
      orderNum: '33,342',
      status: index % 2 === 0 ? 'fail' : 'success',
    }
  ))
];

function TableDemo() {
  const tableRef = createRef();
  const [statusList, setStatusList] = useState([]);

  const columns = [
    { title: '活动ID', dataIndex: 'id', width: 130 },
    { title: '活动名称', dataIndex: 'name', width: 140 },
    {
      title: '创建时间', dataIndex: 'createTime', width: 140, render: val => {
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
    { title: '创建人', dataIndex: 'creator', width: 130 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, row) => {
        return (
          <div>{statusList.find(item => item.value === row.status)?.label}</div>
        )
      }
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setStatusList([
        { label: '成功', value: 'success' },
        { label: '失败', value: 'fail' },
        { label: '等待', value: 'waiting' },
      ])
    }, 2000)
  }, [])
  
  useEffect(() => {
    // 如果没有这段代码，表格状态列数据不会更新
    if (statusList?.length) {
      tableRef.current.setColumn(columns);
    }
  }, [statusList])

  return (
    <div>
      <CTable
        ref={tableRef}
        maxHeight={260}
        columnData={columns}
        ajaxData={{ totals: data.length, data }}
      />
    </div>
  );
}

export default TableDemo;
```
