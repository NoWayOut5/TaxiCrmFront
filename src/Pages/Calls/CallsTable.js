import React from 'react'
import { takeInOrder } from '../../stores/call'
import { Table, Button } from 'antd'

const CallsTable = ({
  data,
}) => {
  const dataSource = data.map((item, ix) => ({
    'n': ix + 1,
    table_time: `${item.shedule_day} : ${item.sheduletime}`,
    ...item
  }))

  const columns = [
    { title: 'N', dataIndex: 'n', },
    { title: 'Город', dataIndex: 'cityname' },
    { title: 'ЮЛ', dataIndex: 'contractorname' },
    { title: 'Фио', dataIndex: 'clname' },
    { title: 'Телефон', dataIndex: 'phone' },
    { title: 'Примечание', dataIndex: 'note' },
    { title: 'Адресс отправления', dataIndex: 'startingpoint' },
    { title: 'Адресс назначения', dataIndex: 'destination' },
    { title: 'Дата (текущая дата)', dataIndex: 'shedule_day' },
    { title: 'Время (вперед/назад из расписания)', dataIndex: 'shedule_time' },
    {
      title: 'Статус обработки',
      render: (row) => {
        return row.user_in_work ? 'В обработке' : 'Не взят в работу'
      }
    },
    {
      title: 'Фио сотрудника',
      render: ({ sheduleid, dayid, user_in_work }) => {
        const btn = (
          <Button
            onClick={() => takeInOrder({ sheduleid, dayid })}
          >
            Взять в работу
          </Button>
        )
        return user_in_work ? user_in_work : btn
      }
    },
  ]

  return (
    <Table
      columns={columns}
      size="middle"
      pagination={{ showSizeChanger: true }}
      dataSource={dataSource}
    />
  )
}


export default CallsTable