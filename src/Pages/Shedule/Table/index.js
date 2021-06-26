import React from 'react'
import { useStore } from 'effector-react'
import globalStore from 'stores'
import sheduleStore, {
  changeShedule,
  getShedule
} from 'stores/shedule'
import moment from 'moment';

import {
  Table,
  Button
} from 'antd'

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
      time = `${timeIn} |`
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
    {
      title: '',
      render: (row) => {
        const sendData = async () => {
          const data = JSON.parse(JSON.stringify(row))
          delete data.n;
          delete data.tableDays;

          data.dateto = moment().format("YYYY-MM-DD HH:mm:ss")
          await changeShedule({ data, sheduleid: data.sheduleid });
          getShedule();
        }

        return (
          <Button type="primary" onClick={sendData}>Закрыть</Button>
        )
      }


    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataTable}
      showHeader={true}
      size="middle"
      bordered={true}
      style={{ height: '100%' }}
      pagination={{ showSizeChanger: true, defaultPageSize: 50 }}
      scroll={{ x: true }}
      rowClassName={st.row}
      rowKey={rec => rec.sheduleid}
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