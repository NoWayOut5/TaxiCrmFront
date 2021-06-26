import React from 'react'
import { Table, Button } from 'antd'
import { finishOrder } from '../../stores/call'
import globalStore from "../../stores";
import moment from "moment";

import st from './index.module.scss'
import { useStore } from "effector-react";

const CallsInWorkTable = ({
  data,
  openModal
}) => {
  const { cities, yls } = useStore(globalStore)

  const dataSource = data.map((item, ix) => {
    const city_name = item.cityid ? cities.find(c => c.cityid == item.cityid).name : item.city_name
    const contractor_name = item.contractorid ? yls.find(y => y.contractorid == item.contractorid).name : item.contractor_name

    return {
      ...item,
      table_time: `${item.shedule_day} : ${item.sheduletime}`,
      city_name,
      contractor_name,
      'n': ix + 1,
    }
  })

  const columns = [
    { title: 'N', dataIndex: 'n' },
    { title: 'Город', dataIndex: 'city_name' },
    { title: 'Примечание', dataIndex: 'note' },
    { title: 'Класс авто', dataIndex: 'autoclass' },
    { title: 'ЮЛ', dataIndex: 'contractor_name' },
    { title: 'Фио', dataIndex: 'clname' },
    { title: 'Телефон', dataIndex: 'phone' },
    { title: 'Адрес отправления', dataIndex: 'startingpoint' },
    { title: 'Адрес назначения', dataIndex: 'destination' },
    {
      title: 'Дата (текущая дата)',
      dataIndex: 'shedule_day',
      render: (row) => moment(row).format('yyyy-MM-DD hh:mm:ss')
    },
    { title: 'Время (вперед/назад)', dataIndex: 'shedule_time' },
    {
      title: '',
      render: (row) => (
        <Button
          type="primary"
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
        rowKey={row => row.callid}
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