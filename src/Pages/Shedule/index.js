import React, { useEffect, useState } from 'react';
import api, { urls } from 'api';
import moment from 'moment'
import readXlsxFile from 'read-excel-file'
import { useForm, Controller } from "react-hook-form";
import globalStore from '../../stores'
import { useStore } from 'effector-react'

import SendExcel from "./SendExcel";
import FormItem from '../../Components/FormItem'
import Loader from '../../Components/Loader'
import {
  Button,
  Table,
  Modal,
  Input,
  Form,
  Select,
  Upload,
  notification
} from 'antd'

import { UploadOutlined } from '@ant-design/icons';
import st from './index.module.scss'

const uniqId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const days = {
  '1': 'понедельник',
  '2': 'вторник',
  '3': 'среда',
  '4': 'четверг',
  '5': 'пятница',
  '6': 'суббота',
  '7': 'воскресенье',
}

const shortDays = {
  'пн': 'pn',
  'вт': 'vt',
  'ср': 'sr',
  'чт': 'cht',
  'пт': 'pt',
  'сб': 'sb',
  'вс': 'vs',
}

const shortDaysEng = {
  'mon': 'pn',
  'tue': 'vt',
  'wed': 'sr',
  'thu': 'cht',
  'fri': 'pt',
  'sat': 'sb',
  'sun': 'vs',
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const FileInput = ({
  name,
  onChange
}) => (
  <div>
    <input
      type="file"
      id={name}
      onChange={onChange}
    />
  </div>
)

const SheduleTable = ({
  shedule,

  setIsModalOpen,
  setModalProps
}) => {
  const { cities } = useStore(globalStore)
  const dataSource = shedule.map((item, ix) => {
    const daysTitle = []

    const cityname = cities.find(city => item.cityid == city.cityid)

    item.days && item.days.forEach((day) => {
      if(day.sheduleid >= 10){
        daysTitle[shortDaysEng[day.name]] = day.time
      }else{
        daysTitle[shortDays[day.name]] = day.time
      }
    })

    return {
      ...item,
      n: ix,
      key: ix,
      cityname: cityname ? cityname.name : "",
      daysTitle
    };
  });

  const columns = [
    { title: 'N', dataIndex: 'n' },
    { title: 'Город', dataIndex: 'cityname' },
    { title: 'ФИО', dataIndex: 'clname' },
    { title: 'Телефон', dataIndex: 'phone' },
    { title: 'Адресс проживания', dataIndex: 'startingpoint' },
    { title: 'Способ перевозки', dataIndex: 'transportway' },
    { title: 'Понедельник', dataIndex: ["daysTitle", "pn"] },
    { title: 'Вторник', dataIndex: ["daysTitle", "vt"] },
    { title: 'Среда', dataIndex: ["daysTitle", "sr"] },
    { title: 'Четверг', dataIndex: ["daysTitle", "cht"] },
    { title: 'Пятница', dataIndex: ["daysTitle", "pt"] },
    { title: 'Суббота', dataIndex: ["daysTitle", "sb"] },
    { title: 'Воскресенье', dataIndex: ["daysTitle", "vs"] },
    { title: 'Пункт назначения', dataIndex: 'destination' },
    { title: 'Примечание', dataIndex: 'note' },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
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

const ChangeSheduleModal = ({
  isModalOpen,
  modalProps = {},

  changeIsOpenModal,
  onAddShedule,
  setModalProps,
  onChangeShedule
}) => {
  const { cities, yls } = useStore(globalStore)
  const { control, getValues, reset } = useForm();
  const [ days, setDays ] = useState([])

  const items = [
    { label: "Город", name: "cityid", inputType: 'select', props: cities },
    { label: "Юл", name: "contractorid", inputType: 'select', props: yls },
    { label: "Фио", name: "clname" },
    { label: "Телефон", name: "phone" },
    { label: "Адрес проживания", name: "startingpoint" },
    { label: "Способ перевозки", name: "transportway" },
    { label: "Понедельник (вперед)", inputType: 'day', dayDirection: 'in', dayName: 'пн', newDayName: 'mon' },
    { label: "Понедельник (назад)", inputType: 'day', dayDirection: 'out', dayName: 'пн', newDayName: 'mon' },
    { label: "Вторник (вперед)", inputType: 'day', dayDirection: 'in', dayName: 'вт', newDayName: 'tue' },
    { label: "Вторник (назад)", inputType: 'day', dayDirection: 'out', dayName: 'вт', newDayName: 'tue' },
    { label: "Среда (вперед)", inputType: 'day', dayDirection: 'in', dayName: 'ср', newDayName: 'wed' },
    { label: "Среда (назад)", inputType: 'day', dayDirection: 'out', dayName: 'ср', newDayName: 'wed' },
    { label: "Четверг (вперед)", inputType: 'day', dayDirection: 'in', dayName: 'чт', newDayName: 'thu' },
    { label: "Четверг (назад)", inputType: 'day', dayDirection: 'out', dayName: 'чт', newDayName: 'thu' },
    { label: "Пятница (вперед)", inputType: 'day', dayDirection: 'in', dayName: 'пт', newDayName: 'fri' },
    { label: "Пятница (назад)", inputType: 'day', dayDirection: 'out', dayName: 'пт', newDayName: 'fri' },
    { label: "Суббота (вперед)", inputType: 'day', dayDirection: 'in', dayName: 'сб', newDayName: 'sat' },
    { label: "Суббота (назад)", inputType: 'day', dayDirection: 'out', dayName: 'сб', newDayName: 'sat' },
    { label: "Воскресенье (вперед)", inputType: 'day', dayDirection: 'in', dayName: 'вс', newDayName: 'sun' },
    { label: "Воскресенье (назад)", inputType: 'day', dayDirection: 'out', dayName: 'вс', newDayName: 'sun' },
    { label: "Пункт назначения", name: "destination" },
    { label: "Примечание", name: "note" },
    { label: "Активно с", name: "datefrom", defaultValue: moment().format("MM/DD/YYYY") },
    { label: "Активно до", name: "dateto", defaultValue: moment().set({ 'year': 2099, 'month': 12, 'day': 31 }).format("MM/DD/YYYY") },
  ]

  const { Option } = Select;

  useEffect(() => {
    reset(modalProps)
  }, [modalProps])

  useEffect(() => {
    if(modalProps && modalProps.days){
      setDays(modalProps.days)
    }
  }, [modalProps ? modalProps.days : []])

  const onOk = () => {
    const data = JSON.parse(JSON.stringify(getValues()));
    delete data.days;

    if(modalProps.sheduleid){
      onChangeShedule(modalProps.sheduleid, data)
    }else{
      onAddShedule(data)
    }
  }

  const onCancel = () => {
    changeIsOpenModal();
    setModalProps(null);
  }

  const changeDay = (ev, item) => {
    setDays((prevState) => {
      const newState = [ ...prevState ]
      const selectedDay = newState.find(day => day.dayid == item.dayid)
      selectedDay.time = ev.target.value;
      selectedDay.changed = true;

      return newState;
    })
  }

  const addDay = (ev, item, sheduleid) => {
    const { dayDirection, dayName } = item

    setDays(prevState => {
      const newState = [ ...prevState ];

      newState.push({
        direction: dayDirection,
        name: dayName,
        time: ev.target.value,
        sheduleid,
        created: true
      })

      return newState;
    })
  }

  return (
    <Modal
      visible={isModalOpen}
      onCancel={onCancel}
      onOk={onOk}
      style={{ top: 10, bottom: 10 }}
    >
      {items.map((column, ix) => {
        const { label, name, inputType, props = [], defaultValue = '', dayName, dayDirection } = column;
        let selectedDay = null;

        if(dayName && days.length){
          selectedDay = days.find(d => d.name == dayName && d.direction == dayDirection)
        }

        return (
          <FormItem
            label={label}
            key={ix}
          >
            {{
              'select': (
                <Controller
                  as={
                    <Select style={{ width: 120 }}>
                      {props.map((item, ix) => (
                        <Option
                          value={item.itemId}
                          key={ix}
                        >
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  }
                  defaultValue={props[0] && props[0].itemId}
                  name={name}
                  control={control}
                />
              ),
              'day': (
                <Input
                  value={selectedDay ? selectedDay.time : ''}
                />
              ),
              'undefined': (
                <Controller
                  as={<Input />}
                  name={dayName ? dayName + '_' + dayDirection : name }
                  control={control}
                  defaultValue={defaultValue}
                />
              )
            }[inputType]}
          </FormItem>
        )
      })}
    </Modal>
  )
}

const Shedule = ({
  loaderState,
  setLoaderState
}) => {
  const [shedule, setShedule] = useState([])
  const { cities, yls } = useStore(globalStore)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalProps, setModalProps] = useState(null)

  const handleShedule = (data) => {
    const resData = data.map(item => {
      return {
        ...item,
        itemId: item.cityid,
      }
    })

    return resData;
  }

  useEffect(() => {
    api.get(urls.shedule).then((res) => {
      setShedule(handleShedule(res.data))
    })
  }, [])

  const onAddShedule = (values) => {
    api.post(urls.saveShedule, values).then(res => {
      setShedule(prev => ([...prev, res.data]))
      setModalProps(null)
      changeIsOpenModal()
    })
  }

  const onChangeShedule = (id, values) => {
    api.put(`${urls.changeShedule}/${id}`, values).then(res => {
      setShedule(prev => {
        return prev.map(item => item.sheduleid == res.data.sheduleid ? res.data : item)
      })
      setModalProps(null)
      changeIsOpenModal()
    })
  }

  const onSendExcelFile = async (json) => {
    setLoaderState(true)

    const promisesArr = json.rows.map((item, ix) => () => {
      const pr = new Promise(((resolve, reject) => {
        api.post(urls.importExcel, item)
          .then(response => {
            setShedule(prev => ([...prev, response.data]))
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      }))

      return pr;
    })

    async function runPromisesInSequence(promises) {
      for (let p of promises) {
        try{
          await p();
        }catch(err){
          notification.error({ message: `Файл не был загружен` });
        }
      }

      return new Promise((resolve) => {
        resolve();
      })
    }

    runPromisesInSequence(promisesArr).then(() => {
      setLoaderState(false);
      notification.open({ message: 'Файлы успешно загружены' });
    })
  }

  const changeIsOpenModal = () => {
    setIsModalOpen(prev => !prev)
  }

  return (
    <div>
      <SheduleTable
        shedule={shedule}
        setIsModalOpen={setIsModalOpen}
        setModalProps={setModalProps}
        cities={cities}
      />
      <ChangeSheduleModal
        cities={cities}
        yls={yls}
        modalProps={modalProps}
        isModalOpen={isModalOpen}
        changeIsOpenModal={changeIsOpenModal}
        setModalProps={setModalProps}
        onAddShedule={onAddShedule}
        onChangeShedule={onChangeShedule}
      />
      <div className={st.excelContainer}>
        <Button
          onClick={() => {
            setModalProps(null)
            changeIsOpenModal()
          }}
        >
          Добавить
        </Button>
        <SendExcel
          onParseExcel={onSendExcelFile}
          name="excelFile"
          title="Загрузить excel файл"
        />
      </div>

    </div>
  );
}

export default Shedule;