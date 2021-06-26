import React, {useEffect, useState} from 'react'
import InputMask from 'react-input-mask';
import {
  Button,
  Input
} from 'antd'
import { useStore } from 'effector-react';
import { useForm, Controller } from 'react-hook-form';
import cx from 'classnames'

import callsStore, { addCall, addCallNew } from '../../stores/call';

import st from './index.module.scss'

const InputWithMask = (props) => {
  const [value, setValue] = useState(props.value)

  useEffect(() => {
    setValue(props.value)
  }, [props])

  return (
   <InputMask
     mask={value ? "9(999)-999-9999" : null}
     value={value}
     onChange={(ev) => {
       setValue(ev.target.value);
       props.onChange(ev.target.value);
     }}
   >
     <input
       type="text"
       className={cx("ant-input", st.callInput)}
       autoComplete="on"
       placeholder="8(9__)-___-_____"
     />
   </InputMask>
  )
};

const AddCall = (props) => {
  const { register, control, getValues, reset, setValue } = useForm()
  const [ phone, setPhone ] = useState();

  useEffect(() => {
    register('phone')
  })

  const onSave = async (ev) => {
    ev.preventDefault();

    await addCallNew(getValues())
    reset({ phone: '', note: '' });
    setPhone('')
  }

  const changePhone = (value) => {
    setValue('phone', value);
    setPhone(value);
  }

  return (
    <div className={st.addCall}>
      <form>
        <InputWithMask
          onChange={changePhone}
          value={phone}
        />
        {/*<Controller*/}
        {/*  as={<InputWithMask />}*/}
        {/*  placeholder="Телефон"*/}
        {/*  name="phone"*/}
        {/*  control={control}*/}
        {/*  type="phone"*/}
        {/*/>*/}
        <Controller
          as={<Input />}
          placeholder="Примечание"
          name="note"
          control={control}
          type="text"
          defaultValue=""
        />
        <Button
          onClick={onSave}
          type="primary"
        >
          Добавить заказ
        </Button>
      </form>
    </div>
  )
}

export default AddCall