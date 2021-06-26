import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import { Controller, useForm } from 'react-hook-form'
import moment from 'moment'
import { Input, Modal, Select } from 'antd'
import InputMask from 'react-input-mask'

import globalStore, { getYlNameById, getCityNameById } from '../../../stores'
import {
  addShedule,
  changeShedule,
  changeSheduleNew,
  addSheduleNew,
  getShedule,
  daysList
} from 'stores/shedule'

import FormItem from '../../../Components/FormItem'
import cx from "classnames";
import st from "../../Calls/index.module.scss";

const InputWithMask = (props) => {
  // console.log(props)
  return (
    <InputMask
      mask="99:99"
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      className={cx("ant-input", st.callInput)}
      placeholder="00:00"
    />
  )
};

const ChangeSheduleModal = ({
  isModalOpen,
  modalProps = {},

  changeIsOpenModal,
  setModalProps,
}) => {
  const { cities, yls } = useStore(globalStore)
  const { control, getValues, reset } = useForm();

  const items = [
    { label: "Город", name: "cityid", inputType: 'select', props: cities },
    { label: "Юл", name: "contractorid", inputType: 'select', props: yls },
    { label: "Активно с",
      name: "datefrom",
      defaultValue: moment().format("YYYY-MM-DD")
    },
    { label: "Активно до",
      name: "dateto",
      defaultValue: moment().set({ 'year': 2100, 'month': 01, 'day': 01 }).format("YYYY-MM-DD")
    },
    { label: "Фио", name: "clname" },
    { label: "Телефон", name: "phone" },
    { label: "Пункт отправления", name: "startingpoint" },
    { label: "Пункт назначения", name: "destination" },
    { label: "Класс авто", name: "autoclass" },
    { label: "Способ перевозки", name: "transportway" },
    { label: "Примечание", name: "note" },
    { label: "Понедельник (вперед)", name: "mon_in", inputType: 'day' },
    { label: "Понедельник (назад)", name: "mon_out", inputType: 'day' },
    { label: "Вторник (вперед)", name: "tue_in", inputType: 'day' },
    { label: "Вторник (назад)", name: "tue_out", inputType: 'day' },
    { label: "Среда (вперед)", name: "wed_in", inputType: 'day' },
    { label: "Среда (назад)", name: "wed_out", inputType: 'day' },
    { label: "Четверг (вперед)", name: "thu_in", inputType: 'day' },
    { label: "Четверг (назад)", name: "thu_out", inputType: 'day' },
    { label: "Пятница (вперед)", name: "fri_in", inputType: 'day' },
    { label: "Пятница (назад)", name: "fri_out", inputType: 'day' },
    { label: "Суббота (вперед)", name: "sat_in", inputType: 'day' },
    { label: "Суббота (назад)", name: "sat_out", inputType: 'day' },
    { label: "Воскресенье (вперед)", name: "sun_in", inputType: 'day' },
    { label: "Воскресенье (назад)", name: "sun_out", inputType: 'day' },
    { label: "Заказчик", name: "customer" },
    { label: "Наименование центра", name: "destname" }
  ]

  const { Option } = Select;

  useEffect(() => {
    console.log('wrf')
    reset(modalProps)
  }, [modalProps])

  const sendData = async () => {
    const data = JSON.parse(JSON.stringify(getValues()));
    delete data.days;

    Object.keys(data).map(item => {
      if(daysList.indexOf(item) > -1 && data[item] && data[item].length > 5){
        data[item] = data[item].slice(0, 5)
      }
    })

    let res;

    const contractor = getYlNameById(data.contractorid)
    const city = getCityNameById(data.cityid)

    if(modalProps && modalProps.sheduleid){
      res = await changeSheduleNew({
        data: {
          ...data,
          city,
          contractor,
          sheduleid: modalProps.sheduleid
        },
        sheduleid: modalProps.sheduleid
      })
      changeIsOpenModal()
    }else{
      res = await addSheduleNew({ ...data, city, contractor })
      changeIsOpenModal()
    }

    return res;
  }

  const onOk = async () => {
    const data = await sendData();
    if(data.status == 200){
      getShedule();
    }
  }

  const onCancel = () => {
    changeIsOpenModal();
    setModalProps(null);
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
                <Controller
                  as={<InputWithMask />}
                  name={name}
                  control={control}
                  defaultValue={defaultValue}
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

export default ChangeSheduleModal