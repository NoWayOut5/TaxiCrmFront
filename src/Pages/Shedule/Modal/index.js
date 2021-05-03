import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import { Controller, useForm } from 'react-hook-form'
import moment from 'moment'
import { Input, Modal, Select } from 'antd'

import globalStore from '../../../stores'
import {
  addShedule,
  changeShedule
} from '../../../stores/shedule'

import FormItem from '../../../Components/FormItem'

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
    { label: "Фио", name: "clname" },
    { label: "Телефон", name: "phone" },
    { label: "Пункт отправления", name: "startingpoint" },
    { label: "Способ перевозки", name: "transportway" },
    { label: "Понедельник (вперед)", inputType: 'day' },
    { label: "Понедельник (назад)", inputType: 'day' },
    { label: "Вторник (вперед)", inputType: 'day' },
    { label: "Вторник (назад)", inputType: 'day' },
    { label: "Среда (вперед)", inputType: 'day' },
    { label: "Среда (назад)", inputType: 'day' },
    { label: "Четверг (вперед)", inputType: 'day' },
    { label: "Четверг (назад)", inputType: 'day' },
    { label: "Пятница (вперед)", inputType: 'day' },
    { label: "Пятница (назад)", inputType: 'day' },
    { label: "Суббота (вперед)", inputType: 'day' },
    { label: "Суббота (назад)", inputType: 'day' },
    { label: "Воскресенье (вперед)", inputType: 'day' },
    { label: "Воскресенье (назад)", inputType: 'day' },
    { label: "Пункт назначения", name: "destination" },
    { label: "Примечание", name: "note" },
    {
      label: "Активно с",
      name: "datefrom",
      defaultValue: moment().format("YYYY-MM-DD")
    },
    {
      label: "Активно до",
      name: "dateto",
      defaultValue: moment().set({ 'year': 2099, 'month': 12, 'day': 31 }).format("YYYY-MM-DD")
    },
  ]

  const { Option } = Select;

  useEffect(() => {
    reset(modalProps)
  }, [modalProps])

  const onOk = () => {
    const data = JSON.parse(JSON.stringify(getValues()));
    delete data.days;

    if(modalProps && modalProps.sheduleid){
      changeShedule({ data, sheduleid: modalProps.sheduleid })
      changeIsOpenModal()
    }else{
      addShedule(data)
      changeIsOpenModal()
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
                <Input
                  value={''}
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