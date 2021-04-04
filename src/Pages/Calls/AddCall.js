import React from 'react'
import {
  Button,
  Input
} from 'antd'
import { useStore } from 'effector-react'
import { useForm, Controller } from 'react-hook-form'

import callsStore, { addCall } from '../../stores/call';

import st from './index.module.scss'

const AddCall = (props) => {
  const { regster, control, getValues } = useForm()

  const onSave = () => {
    // console.log(getValues())
    addCall(getValues())
  }

  return (
    <div className={st.addCall}>
      <Controller
        as={<Input />}
        placeholder="Телефон"
        name="phone"
        control={control}
        type="phone"
      />
      <Controller
        as={<Input />}
        placeholder="Примечание"
        name="note"
        control={control}
        type="text"
      />
      <Button
        onClick={onSave}
      >
        Добавить заказ
      </Button>
    </div>
  )
}

export default AddCall