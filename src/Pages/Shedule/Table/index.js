import React from 'react'
import { useStore } from 'effector-react'
import globalStore from '../../../stores'
import sheduleStore from '../../../stores/shedule'

import { Table } from 'antd'

import st from '../index.module.scss'

const SheduleTable = ({
  setIsModalOpen,
  setModalProps
}) => {
  const { cities } = useStore(globalStore)
  const { shedule, tableShedule } = useStore(sheduleStore)

  const renderDay = (dataIndex) => (value, row, index) => {
    const timeIn = row.tableDays.in && row.tableDays.in[dataIndex];
    const timeOut = row.tableDays.out && row.tableDays.out[dataIndex];

    let time = ''

    if(timeIn && !timeOut){
      time = `${timeIn} | `
    }else if(timeOut && !timeIn){
      time = `      | ${timeOut}`
    }else if(timeIn && timeOut){
      time = `${timeIn} | ${timeOut}`
    }

    return {
      children: (
        <div>{time}</div>
      ),
      props: {
        style: { whiteSpace: 'nowrap' }
      }
    };
  }

  const columns = [
    { title: 'N', dataIndex: 'n' },
    { title: 'Город', dataIndex: ["city", "name"] },
    { title: 'ФИО', dataIndex: 'clname' },
    { title: 'Телефон', dataIndex: 'phone' },
    { title: 'Адрес проживания', dataIndex: 'startingpoint' },
    { title: 'Способ перевозки', dataIndex: 'transportway' },
    { title: 'Понедельник', dataIndex: ["tableDays", "in", "mon"], render: renderDay("mon") },
    { title: 'Вторник', dataIndex: ["tableDays", "in", "tue"], render: renderDay("tue") },
    { title: 'Среда', dataIndex: ["tableDays", "in", "wed"], render: renderDay("wed") },
    { title: 'Четверг', dataIndex: ["tableDays", "in", "thu"], render: renderDay("thu") },
    { title: 'Пятница', dataIndex: ["tableDays", "in", "fri"], render: renderDay("fri") },
    { title: 'Суббота', dataIndex: ["tableDays", "in", "sat"], render: renderDay("sat") },
    { title: 'Воскресенье', dataIndex: ["tableDays", "in", "sun"], render: renderDay("sun") },
    { title: 'Пункт назначения', dataIndex: 'destination' },
    { title: 'Примечание', dataIndex: 'note' },
  ]

  return (
    <Table
      columns={columns}
      dataSource={tableShedule}
      showHeader={true}
      size="middle"
      bordered={true}
      rowClassName={st.row}
      style={{ height: '100%' }}
      pagination={{ showSizeChanger: true }}
      scroll={{ x: true }}
      onRow={(row) => ({
        onDoubleClick: () => {
          setModalProps(row)
          setIsModalOpen(true)
        }
      })}
    />
  )
}


export default SheduleTable