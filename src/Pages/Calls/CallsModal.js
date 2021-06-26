import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from 'effector-react'

import callsStore, { changeRecord, changeRecordInWorkTable } from '../../stores/call'
import globalStore from "../../stores";

import {
  Modal,
  Input, Select
} from 'antd'

import FormItem from '../../Components/FormItem'

const CallsModal = ({
  open,
  closeModal,
  changedRecordId
}) => {
  const [selectedItem, setSelectedItem] = useState();
  const { callsInWork } = useStore(callsStore)
  const { cities, yls } = useStore(globalStore)
  const { control, getValues, reset, register } = useForm();

  useEffect(() => {
    const item = callsInWork.find(item => item.callid == changedRecordId);
    if(item){
      setSelectedItem(item)
      reset(item)
      register('callid', item.callid)
    }
  }, [changedRecordId, reset])

  const items = [
    { label: "Город", name: "cityid", type: "cities-select" },
    { label: "Юл", name: "contractorid", type: "yls-select" },
    { label: "Фио", name: "clname" },
    { label: "Телефон", name: "phone" },
    { label: "Пункт отправления", name: "startingpoint" },
    /*{ label: "Способ перевозки", name: "transportway" },*/
    { label: "Пункт назначения", name: "destination" },
    { label: "Примечание", name: "note" },
    { label: "Класс авто", name: "autoclass" },
  ]

  const onOk = () => {
    changeRecordInWorkTable(getValues())
    closeModal();
  }

  const onCancel = () => {
    closeModal();
  }

  return (
    <Modal
      visible={open}
      onOk={onOk}
      onCancel={onCancel}
      style={{ top: 10, bottom: 10 }}
    >
      {items.map(({ name, label, type }, ix) => (
        <FormItem
          label={label}
          key={ix}
        >
          {{
            'cities-select': (
              <Controller
                as={
                  <Select style={{ width: 165 }}>
                    {cities.map((city, ix) => (
                      <Option
                        value={city.cityid}
                        key={ix}
                      >
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                }
                placeholder="Выберите город"
                name={name}
                control={control}
                defaultValue={(selectedItem && selectedItem.city_name) && cities.find(c => c.name == selectedItem.city_name).name}
              />
            ),
            'yls-select': (
              <Controller
                as={
                  <Select style={{ width: 165 }}>
                    {yls.map((yl, ix) => (
                      <Option
                        value={yl.contractorid}
                        key={ix}
                      >
                        {yl.name}
                      </Option>
                    ))}
                  </Select>
                }
                placeholder="Выберите юл"
                name={name}
                control={control}
                defaultValue={(selectedItem && selectedItem.contractor_name) && yls.find(yl => yl.name == selectedItem.contractor_name).name}
              />
            ),
            'undefined': (
              <Controller
                as={<Input />}
                name={name}
                control={control}
              />
            )
          }[type]}
        </FormItem>
      ))}
    </Modal>
  )
}


export default CallsModal