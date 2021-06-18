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
    { label: "Город", name: "city", inputType: 'select', props: cities },
    { label: "Контрагент", name: "contractor", inputType: 'select', props: yls },
    { label: "Активно с",
      name: "datefrom",
      defaultValue: moment().format("YYYY-MM-DD")
    },
    { label: "Активно до",
      name: "dateto",
      defaultValue: moment().set({ 'year': 2099, 'month': 12, 'day': 31 }).format("YYYY-MM-DD")
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