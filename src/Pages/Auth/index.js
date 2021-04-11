import React, { useEffect, useRef } from 'react'
import { useStore } from 'effector-react'
import { Controller, useForm } from 'react-hook-form'
import authStore, { authUser } from '../../stores/auth'
import cx from 'classnames'

import {
  Input,
  Button,
  notification
} from 'antd'

import st from './index.module.scss'

const Auth = (props) => {
  const { control, getValues, reset } = useForm();
  const asd = useStore(authStore)
  const message = asd.user.message

  // useEffect(() => {
  //   asd.user.message && message !== asd.user.message && notification.error({ message: asd.user.message })
  // })

  useEffect(() => {
    console.log(asd.user.message)
  })

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
          className={cx(st.login, message && st.error)}
          control={control}
        />
        <Controller
          as={<Input />}
          name="password"
          control={control}
          type="password"
          placeholder="Пароль"
          className={cx(st.login, message && st.error)}
          size="large"
        />
        <div className={st.errorMessage}>
          {message}
        </div>
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