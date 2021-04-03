import React from 'react'
import { useStore } from 'effector-react'
import { Controller, useForm } from 'react-hook-form'
import authStore, { authUser } from '../../stores/auth'

import {
  Input,
  Button
} from 'antd'

import st from './index.module.scss'

const Auth = (props) => {
  const { control, getValues, reset } = useForm();
  const asd = useStore(authStore)

  const onSend = () => {
    const { login, password } = getValues()
    authUser({ login, password })
  }

  return (
    <div className={st.auth}>
      <div className={st.authForm}>

        <Controller
          as={<Input />}
          name="login"
          type="text"
          placeholder="Имя пользователя"
          size="large"
          className={st.login}
          control={control}
        />
        <Controller
          as={<Input />}
          name="password"
          className={st.password}
          control={control}
          type="password"
          placeholder="Пароль"
          size="large"
        />
        <Button
          className={st.button}
          type="primary"
          onClick={onSend}
        >
          Login
        </Button>
      </div>
    </div>
  )
}


export default Auth