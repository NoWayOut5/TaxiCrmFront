import React, { useEffect, useState } from 'react';
import api, { urls } from 'api';
import moment from 'moment'

import {
  Button,
  Table,
  Modal,
  Input,
  Form,
  Select
} from 'antd'
import { useForm, Controller } from "react-hook-form";

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

const FormItem = ({ label, children }) => (
  <div className={st.formItem}>
    <div className={st.label}>{label} : </div>
    <div className={st.formItemChildren}> {children}</div>
  </div>
)

const SheduleTable = ({
  shedule,
  cities,

  setIsModalOpen,
  setModalProps
}) => {

  const dataSource = shedule.map((item, ix) => {
    const daysTitle = {}
    const cityname = cities.find(city => item.cityid == city.cityid)

    item.days.forEach(day => {
      daysTitle[shortDays[day.name]] = day.time
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
    {
      title: 'N',
      dataIndex: 'n',
    },
    {
      title: 'Город',
      dataIndex: 'cityname',
    },
    {
      title: 'ФИО',
      dataIndex: 'clname',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
    },
    {
      title: 'Адресс проживания',
      dataIndex: 'startingpoint',
    },
    {
      title: 'Способ перевозки',
      dataIndex: 'transportway',
    },
    {
      title: 'Понедельник',
      dataIndex: ["daysTitle", "pn"],
    },
    {
      title: 'Вторник',
      dataIndex: ["daysTitle", "vt"],
    },
    {
      title: 'Среда',
      dataIndex: ["daysTitle", "sr"],
    },
    {
      title: 'Четверг',
      dataIndex: ["daysTitle", "cht"],
    },
    {
      title: 'Пятница',
      dataIndex: ["daysTitle", "pt"],
    },
    {
      title: 'Суббота',
      dataIndex: ["daysTitle", "sb"],
    },
    {
      title: 'Воскресенье',
      dataIndex: ["daysTitle", "vs"],
    },
    {
      title: 'Пункт назначения',
      dataIndex: 'destination',
    },
    {
      title: 'Примечание',
      dataIndex: 'note',
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowClassName={st.row}
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
  modalProps: {
    days: dasdas = []
  },
  cities,
  yls,

  changeIsOpenModal,
  onAddShedule,
  onChangeShedule
}) => {
  const { control, getValues, reset } = useForm();
  const [ days, setDays ] = useState(dasdas)

  const { Option } = Select;

  const items = [
    { label: "Город", name: "cityid", inputType: 'select', props: cities },
    { label: "Юл", name: "contractorid", inputType: 'select', props: yls },
    { label: "Фио", name: "clname" },
    { label: "Телефон", name: "phone" },
    { label: "Адрес проживания", name: "startingpoint" },
    { label: "Способ перевозки", name: "transportway" },
    { label: "Понедельник (вперед)", inputType: 'dayInput', dayDirection: 'in', dayName: 'пн', uuid: uniqId() },
    { label: "Понедельник (назад)", inputType: 'dayInput', dayDirection: 'out', dayName: 'пн', uuid: uniqId() },
    { label: "Вторник (вперед)", inputType: 'dayInput', dayDirection: 'in', dayName: 'вт', uuid: uniqId() },
    { label: "Вторник (назад)", inputType: 'dayInput', dayDirection: 'out', dayName: 'вт', uuid: uniqId() },
    { label: "Среда (вперед)", inputType: 'dayInput', dayDirection: 'in', dayName: 'ср', uuid: uniqId() },
    { label: "Среда (назад)", inputType: 'dayInput', dayDirection: 'out', dayName: 'ср', uuid: uniqId() },
    { label: "Четверг (вперед)", inputType: 'dayInput', dayDirection: 'in', dayName: 'чт', uuid: uniqId() },
    { label: "Четверг (назад)", inputType: 'dayInput', dayDirection: 'out', dayName: 'чт', uuid: uniqId() },
    { label: "Пятница (вперед)", inputType: 'dayInput', dayDirection: 'in', dayName: 'пт', uuid: uniqId() },
    { label: "Пятница (назад)", inputType: 'dayInput', dayDirection: 'out', dayName: 'пт', uuid: uniqId() },
    { label: "Суббота (вперед)", inputType: 'dayInput', dayDirection: 'in', dayName: 'сб', uuid: uniqId() },
    { label: "Суббота (назад)", inputType: 'dayInput', dayDirection: 'out', dayName: 'сб', uuid: uniqId() },
    { label: "Воскресенье (вперед)", inputType: 'dayInput', dayDirection: 'in', dayName: 'вс', uuid: uniqId() },
    { label: "Воскресенье (назад)", inputType: 'dayInput', dayDirection: 'out', dayName: 'вс', uuid: uniqId() },
    { label: "Пункт назначения", name: "destination" },
    { label: "Примечание", name: "note" },
    { label: "Активно с", name: "datefrom", defaultValue: moment().format("MM/DD/YYYY") },
    { label: "Активно до", name: "dateto", defaultValue: moment().set({ 'year': 2099, 'month': 12, 'day': 31 }).format("MM/DD/YYYY"), },
  ]

  useEffect(() => {
    reset(modalProps)
  }, [modalProps])

  useEffect(() => {
    const { days: dddd = [] } = modalProps
    setDays(dddd)
  }, [modalProps.days])

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onOk = () => {
    const data = JSON.parse(JSON.stringify(getValues()));
    delete data.days;

    if(modalProps.sheduleid){
      onChangeShedule(modalProps.sheduleid, data, days)
    }else{
      onAddShedule(data, days)
    }
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
      onCancel={changeIsOpenModal}
      onOk={onOk}
      style={{ top: 10, bottom: 10 }}
    >
      {items.map((column, ix) => {
        const { label, name, inputType, props = [], defaultValue = '', dayName, dayDirection, uuid } = column;
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
              'dayInput': (
                <Input
                  value={selectedDay ? selectedDay.time : ''}
                  onChange={(ev) => {
                    (selectedDay && selectedDay.dayid) ? changeDay(ev, selectedDay, modalProps.sheduleid) : addDay(ev, { dayName, dayDirection })
                  }}
                />
              ),
              'undefined': (
                <Controller
                  as={<Input />}
                  name={name}
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
  cities,
  yls
}) => {
  const [shedule, setShedule] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalProps, setModalProps] = useState({})

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
    api.get('/shedule/findall').then((res) => {
      setShedule(handleShedule(res.data))
    })
  }, [])

  const addDay = (values) => {
    api.post(urls.saveDay, values)
  }

  const changeDay = (values) => {
    api.put(urls.changeDay + values.dayid, values)
  }

  const onAddShedule = (values, days) => {
    api.post(urls.saveShedule, values).then(res => {
      setShedule(prev => ([...prev, res.data]))
      setModalProps({})
      changeIsOpenModal()
    })

    // days.forEach(item => {
    //   item.created && addDay(item)
    //   item.changed && changeDay(item)
    // })
  }

  const onChangeShedule = (id, values, changedDays) => {
    api.put(`${urls.changeShedule}/${id}`, values).then(res => {
      setShedule(prev => {
        return prev.map(item => item.sheduleid == res.data.sheduleid ? res.data : item)
      })
      setModalProps({});
      changeIsOpenModal()
    })

    // days.forEach(item => {
    //   item.dayid ? addDay(item) : changeDay(item)
    // })
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
        onAddShedule={onAddShedule}
        onChangeShedule={onChangeShedule}
      />
      <Button
        onClick={() => {
          setModalProps({})
          changeIsOpenModal()
        }}
      >
        Добавить
      </Button>

    </div>
  );
}

export default Shedule;