import React from 'react'
import { takeInOrder } from '../../stores/call'
import { Table, Button } from 'antd'
import { useStore } from "effector-react";
import globalStore from "../../stores";

import st from './index.module.scss'

const CallsTable = ({
  data,
}) => {
  const { cities, yls } = useStore(globalStore);

  const dataSource = data.map((item, ix) => ({
    ...item,
    table_time: `${item.shedule_day} : ${item.sheduletime}`,
    cityname: item.city_name && cities.find(c => c.cityid == item.city_name),
    contractorname: item.contractor_name && yls.find(y => y.contractorid == item.contractor_name),
    'n': ix + 1,
  }))

  const columns = [
    { title: 'N', dataIndex: 'n', },
    { title: 'Город', dataIndex: 'cityname' },
    { title: 'ЮЛ', dataIndex: 'contractorname' },
    { title: 'Фио', dataIndex: 'clname' },
    { title: 'Телефон', dataIndex: 'phone' },
    { title: 'Примечание', dataIndex: 'note' },
    { title: 'Адрес отправления', dataIndex: 'startingpoint' },
    { title: 'Адрес назначения', dataIndex: 'destination' },
    { title: 'Дата', dataIndex: 'shedule_day' },
    { title: 'Время', dataIndex: 'shedule_time' },
    { title: 'Время московское', dataIndex: 'shed_time_msk' },
    { title: 'Время пользователя', dataIndex: 'shed_time_user' },
    {
      title: 'Статус обработки',
      render: (row) => {
        return row.user_name ? 'В обработке' : 'Не взят в работу'
      }
    },
    {
      title: 'Фио сотрудника',
      render: ({ sheduleid, dayid, user_name }) => {
        const btn = (
          <Button
            onClick={() => takeInOrder({ sheduleid, dayid })}
          >
            Взять в работу
          </Button>
        )
        return user_name ? user_name : btn
      }
    },
  ]

  return (
    <div className={st.calls}>
      <Table
        columns={columns}
        size="small"
        pagination={{ showSizeChanger: true }}
        dataSource={dataSource}
        className={st.callsTable}
      />
    </div>
  )
}


export default CallsTable