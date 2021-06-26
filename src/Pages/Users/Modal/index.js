import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from 'effector-react'
import globalStore from 'stores'
import userStore, { addUser, changeUser, saveUserRoles, addUserRoles } from 'stores/users'
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

  setModalState
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

  const onOk = async () => {
    const values = JSON.parse(JSON.stringify(getValues()));

    values.enabled = parseInt(values.enabled);
    const rolesItems = roles.map(item => {
      return { sysname: item.sysname }
    })

    if (modalProps.userid) {
      await saveUserRoles({ values, userId: modalProps.userid, roles: rolesItems })
    } else {
      !values.password && (values.password = "")
      await addUserRoles({ values, roles: rolesItems })
    }

    setModalState({ modalProps: {}, isOpen: false })
  }

  const onChangeCheckbox = (roleItem) => (ev) => {
    if(ev.target.checked){
      setRoles(prev => [...prev, roleItem])
    } else{
      setRoles(prev => prev.filter(item => roleItem.sysname !== item.sysname))
    }
  }

  useEffect(() => {
    register('name')
    register('login')
    register('password')
    register('enabled')
    register('contractorid')
    register('cityid')
  }, [register])

  useEffect(() => {
    reset(modalProps)
  }, [modalProps, reset])

  return (
    <Modal
      visible={open}
      onCancel={() => setModalState(false)}
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
              value={value}
              className={st.select}
              placeholder="Юл (выбираем из справочника юл)"
            >
              <Option
                value={null}
              >
                Отсутствует
              </Option>
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
          render={({ onChange, onBlur, value }) => (
            <Select
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              className={st.select}
              placeholder="Выбрать город"
            >
              {cities && cities.map(item => (
                <Option
                  key={item.cityid}
                  value={item.cityid}
                >
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
          name="cityid"
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
          onChange={onChangeCheckbox(item)}
          checked={roles.find(r => r.sysname == item.sysname)}
          key={ix}
        >
          {capitalizeFirstLetter(item.name)}
        </FormCheckbox>
      ))}
    </Modal>
  )
}

export default UserFormModal