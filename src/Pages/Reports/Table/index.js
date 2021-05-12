import React from 'react';

import { Table } from 'antd'

const r = [
  {
    "autoclass": "string",
    "cityid": 0,
    "cityname": "string",
    "clname": "string",
    "contractorid": 0,
    "contractorname": "string",
    "dayid": 0,
    "destination": "string",
    "note": "string",
    "phone": "string",
    "shed_time_loc": "2021-05-09T00:29:34.577Z",
    "shed_time_msk": "2021-05-09T00:29:34.577Z",
    "shed_time_user": "2021-05-09T00:29:34.577Z",
    "shed_time_utc": "2021-05-09T00:29:34.577Z",
    "shedule_day": "string",
    "shedule_time": {
      "hour": 0,
      "minute": 0,
      "nano": 0,
      "second": 0
    },
    "sheduleid": 0,
    "start_call_time": "2021-05-09T00:29:34.577Z",
    "startingpoint": "string",
    "transportway": "string",
    "user_name": "string"
  }
]

const ReportsTable = ({
  reports,

}) => {

  const columns = [
    { title: 'Контрагент', dataIndex: 'contractorname' },
    { title: 'Город', dataIndex: 'cityname' },
    { title: 'Пассажир', dataIndex: 'clname' },
    { title: 'Телефон', dataIndex: 'phone' },
    { title: 'Класс авто', dataIndex: 'autoclass' },
    { title: 'Пункт отправления', dataIndex: 'startingpoint' },
    { title: 'Пункт назначения', dataIndex: 'destination' },
    { title: 'Дата заказа (местная)', dataIndex: 'shed_time_loc' },
    { title: 'Дата заказа (мск)', dataIndex: 'shed_time_msk' },
    { title: 'Примечание', dataIndex: 'note' },
  ]

  const dataTable = reports;

  return (
    <Table
      columns={columns}
      dataSource={dataTable}
      pagination={{ showSizeChanger: true }}
      showHeader={true}
      size="middle"
      bordered={true}
    />
  )
}

export default ReportsTable;