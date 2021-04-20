import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from 'effector-react'
import globalStore from 'stores'
import userStore, { saveUserRoles } from 'stores/users'
import capitalizeFirstLetter from 'helpers/capitalizeFirstLetter'

import {
  Input,
  Modal,
  Select
} from 'antd'
import FormCheckbox from 'Components/FormCheckbox'

import st from '../index.module.scss'

const UserFormModal = ({
  open,
  modalProps = {},

  onAddUser,
  onChangeUser,
  changeModal,
}) => {
  const [ roles, setRoles ] = useState(modalProps.userRolesNames ? modalProps.userRolesNames : []);
  const { register, getValues, reset, control, setValue, errors } = useForm({
    defaultValues: {
      ...modalProps
    }
  });
  const { yls, cities } = useStore(globalStore)
  const { rolesNames } = useStore(userStore)
  const { Option } = Select;

  const onOk = () => {
    const values = getValues()
    !values.password && (values.password = "")

    if (modalProps.userid) {
      onChangeUser(modalProps.userid, values)
      saveUserRoles({
        ...values,
        roles: roles.map(item => ({ sysname: item }))
      })
    } else {
      onAddUser({ values, roles }).then((res) => {
        saveUserRoles({
          ...res.data,
          roles: roles.map(item => ({ sysname: item }))
        })
      })
    }
  }

  const onChangeCheckbox = (name) => (ev) => {
    if(ev.target.checked){
      setRoles(prev => [...prev, name])
    } else{
      setRoles(prev => prev.filter(item => name !== item))
    }
  }

  useEffect(() => {
    register('name')
    register('login')
    register('password')
    register('enabled')
    register('contractorid')
  }, [register])

  useEffect(() => {
    reset(modalProps)
  }, [modalProps, reset])

  return (
    <Modal
      visible={open}
      onCancel={() => changeModal(false)}
      onOk={onOk}
      className={st.modal}
      title={true ? "Добавление пользователя" : "Изменение пользователя"}
    >
      <div className={st.controlsGroup}>
        <Controller
          as={<Input/>}
          name="name"
          placeholder="Имя"
          control={control}
          className={st.input}
        />
        <Controller
          as={<Input/>}
          name="login"
          placeholder="Логин"
          control={control}
          className={st.input}
        />
        <Controller
          as={<Input/>}
          placeholder="Пароль"
          name="password"
          control={control}
          className={st.input}
        />
        <Controller
          render={({ onChange, onBlur, value }) => (
            <Select
              onChange={onChange}
              onBlur={onBlur}
              // value={yls[modalProps.contractorid] && yls[modalProps.contractorid].name}
              value={value}
              className={st.select}
              placeholder="Юл (выбираем из справочника юл)"
            >
              {yls && yls.map(item => (
                <Option
                  key={item.contractorid}
                  value={item.contractorid}
                >
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
          name="contractorid"
          control={control}
        />
        <Controller
          render={({ onChange, onBlur, value }) => {
            return (
              <Select
                onChange={onChange}
                onBlur={onBlur}
                value={value == '0' ? 'Заблокирован' : 'Активен'}
                placeholder="Статус"
              >
                <Option value="0">Заблокирован</Option>
                <Option value="1">Активен</Option>
              </Select>
            )
          }}
          name="enabled"
          control={control}
          className={st.input}
          defaultValue="1"
        />
      </div>
      {rolesNames.map((item, ix) => (
        <FormCheckbox
          name={item.sysname}
          onChange={onChangeCheckbox(item.sysname)}
          checked={roles.find(r => r == item.sysname)}
          key={ix}
        >
          {capitalizeFirstLetter(item.name)}
        </FormCheckbox>
      ))}
    </Modal>
  )
}

export default UserFormModal