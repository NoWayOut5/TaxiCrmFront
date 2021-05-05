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

  const dataTable = tableShedule.map((item, index) => ({
    ...item,
    n: index + 1
  }))

  const renderDay = (dataIndex) => (value, row, index) => {
    const timeIn = row.tableDays.in && row.tableDays.in[dataIndex];
    const timeOut = row.tableDays.out && row.tableDays.out[dataIndex];

    if(!timeIn && !timeOut){
      return <div></div>
    }

    let time = ''

    if(timeIn && !timeOut){
      time = `Вперед ${timeIn}`
    }else if(timeOut && !timeIn){
      time = `Назад ${timeOut}`
    }else if(timeIn && timeOut){
      time = `Вперед ${timeIn} | Назад ${timeOut}`
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

  const renderDate = (value) => {
    return value.split(' ')[0]
  }
  const columns = [
    { title: 'N', dataIndex: 'n' },
    { title: 'Город', dataIndex: 'cityname' },
    { title: 'ФИО', dataIndex: 'clname' },
    { title: 'Телефон', dataIndex: 'phone' },
    { title: 'Пункт отправления', dataIndex: 'startingpoint' },
    { title: 'Класс авто', dataIndex: 'autoclass' },
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
    { title: 'Дата действия с', dataIndex: 'datefrom', render: renderDate },
    { title: 'Дата действия до', dataIndex: 'dateto', render: renderDate },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataTable}
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