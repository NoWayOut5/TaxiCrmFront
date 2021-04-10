import React from 'react'
import { Table, Button } from 'antd'
import { finishOrder } from '../../stores/call'

import st from './index.module.scss'

const CallsInWorkTable = ({
  data,
  openModal
}) => {
  const dataSource = data.map((item, ix) => ({
    'n': ix + 1,
    table_time: `${item.shedule_day} : ${item.sheduletime}`,
    ...item
  }))

  const columns = [
    { title: 'N', dataIndex: 'n' },
    { title: 'Город', dataIndex: 'city_name' },
    { title: 'Примечание', dataIndex: 'note' },
    { title: 'ЮЛ', dataIndex: 'contractor_name' },
    { title: 'Фио', dataIndex: 'clname' },
    { title: 'Телефон', dataIndex: 'phone' },
    { title: 'Адресс отправления', dataIndex: 'startingpoint' },
    { title: 'Адресс назначения', dataIndex: 'destination' },
    { title: 'Дата (текущая дата)', dataIndex: 'shedule_day' },
    { title: 'Время (вперед/назад)', dataIndex: 'shedule_time' },
    {
      title: '',
      render: (row) => (
        <Button
          onClick={(ev) => {
            ev.stopPropagation()
            finishOrder(row.callid)
          }}
        >
          Завершить заказ
        </Button>
      )
    },
  ]

  return (
    <div
      className={st.callsInWork}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ showSizeChanger: true }}
        size="small"
        className={st.callsInWorkTable}
        onRow={(record) => {
          return {
            onDoubleClick(){
              openModal(record.callid);
            }
          }
        }}
      />
    </div>

  )
}

export default CallsInWorkTable