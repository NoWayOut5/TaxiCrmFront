import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from 'effector-react'

import callsStore, {
  changeRecord
} from '../../stores/call'

import {
  Modal,
  Input
} from 'antd'

import FormItem from '../../Components/FormItem'

const CallsModal = ({
  open,
  closeModal,
  changedRecordId
}) => {
  const { callsInWork } = useStore(callsStore)
  const { control, getValues, reset, register } = useForm();

  useEffect(() => {
    const item = callsInWork.find(item => item.callid == changedRecordId);
    reset(item)

    item && register('callid', item.callid)
  }, [changedRecordId, reset])

  const items = [
    { label: "Город", name: "city_name" },
    { label: "Юл", name: "contractor_name" },
    { label: "Фио", name: "clname" },
    { label: "Телефон", name: "phone" },
    { label: "Пункт отправления", name: "startingpoint" },
    { label: "Способ перевозки", name: "transportway" },
    { label: "Пункт назначения", name: "destination" },
    { label: "Примечание", name: "note" },
    { label: "Обрабатывается(ФИО сотрудника)", name: ''}
  ]

  const onOk = () => {
    changeRecord(getValues())
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
      {items.map(({ name, label }, ix) => (
        <FormItem
          label={label}
          key={ix}
        >
          <Controller
            as={<Input />}
            name={name}
            control={control}
          />
        </FormItem>
      ))}
    </Modal>
  )
}


export default CallsModal