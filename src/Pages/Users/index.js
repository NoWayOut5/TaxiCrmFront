import React, { useEffect, useState } from 'react';
import api, { urls } from 'api';
import { useForm, Controller } from "react-hook-form";
import { useStore } from 'effector-react'
import globalStore from '../../stores'
import {
  getRoles,
  deleteUser
} from '../../stores/users'

import {
  Checkbox,
  Select,
  Input,
  Table,
  Button,
  Modal
} from 'antd';

import st from './index.module.scss'

/*
*
enabled: 1
login: "1"
name: "тест1"
password: "1"
userid: 1
*
* */

const FormCheckbox = (props) => (
  <div>
    <Checkbox {...props} className={st.checkbox} />
  </div>
)

const UserFormModal = ({
  open,
  modalProps = {},

  onAddUser,
  onChangeUser,
  changeModal,
}) => {
  const { register, getValues, reset, control, setValue } = useForm({
    defaultValues: {
      ...modalProps
    }
  });
  const { yls, cities } = useStore(globalStore)
  const { Option } = Select;

  const onOk = () => {
    if (modalProps.userid) {
      onChangeUser(modalProps.userid, getValues())
    } else {
      onAddUser(getValues())
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

  useEffect(() => {
    console.log(getValues())
  })

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
        />
      </div>
      <FormCheckbox>
        Роль администратор системный
      </FormCheckbox>
      <FormCheckbox>
        Роль работа со звонками
      </FormCheckbox>
      <FormCheckbox>
        Роль администратор расписания
      </FormCheckbox>
      <FormCheckbox>
        Роль просмотр счетов
      </FormCheckbox>
    </Modal>
  )
}

const Table2 = ({
  users,
  changeModalState,
  setModalState,
  onDeleteUser
}) => {
  const dataSource = users.map(item => ({ ...item, change: item.userid }))

  const changeUser = (userId) => {
    const selectedUser = users.find(item => item.userid == userId)
    setModalState({ isOpen: true, modalProps: selectedUser })
  }

  const columns = [
    { title: 'Имя(ЮЛ)', dataIndex: 'name' },
    { title: 'Логин', dataIndex: 'login' },
    { title: 'Пароль', dataIndex: 'password' },
    { title: 'Роль', dataIndex: 'role' },
    {
      title: 'Статус',
      dataIndex: 'enabled',
      render: (value) => {
        return value == '0' ? 'Заблокирован' : 'Активен'
      }
    },
    {
      title: '',
      dataIndex: 'change',
      key: 'change',
      render: (item) => (
        <div>
          <Button
            className={st.tableButton}
            onClick={() => changeUser(item)}
            type="primary"
          >
            Изменить
          </Button>
          <Button
            type="primary"
            onClick={() => onDeleteUser(item)}
          >
            Удалить
          </Button>
        </div>
      )

    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      className={st.usersTable}
      style={{ width: 'auto' }}
    />
  )
}

const Users = (props) => {
  const [users, setUsers] = useState([])
  const [modalState, setModalState] = useState({ isOpen: false, modalProps: {} })

  const onAddUser = (values) => {
    api.post(urls.saveUser, values).then(res => {
      const newUsers = [...users]
      newUsers.push(res.data)
      setUsers(newUsers);

      setModalState({ modalProps: {}, isOpen: false })
    })
  }

  const onChangeUser = (userId, values) => {
    api.put(`${urls.changeUser}/${userId}`, values).then(res => {
      const ix = users.findIndex(item => item.userid == res.data.userid)
      const newUsers = [...users]
      newUsers[ix] = res.data
      setUsers(newUsers);

      setModalState({ modalProps: {}, isOpen: false })
    })
  }

  const onDeleteUser = (userId) => {
    api.delete(`/user/${userId}`).then(res => {
      const newUsers = users.filter(item => item.userid != userId)
      setUsers(newUsers);
    })
  }

  useEffect(() => {
    api.get(urls.users).then((res) => {
      setUsers(res.data)
    })
    getRoles()
  }, [])

  const changeModalState = (props) => {
    setModalState(prevState => {
      const values = {
        modalProps: { ...prevState.modalProps, ...props },
        isOpen: !prevState.isOpen
      }
      return values;
    })
  }

  return (
    <div className={st.users}>
      <Table2
        users={users}
        changeModalState={changeModalState}
        setModalState={setModalState}
        onDeleteUser={onDeleteUser}
      />
      <Button
        type="primary"
        onClick={changeModalState}
      >
        Добавить пользователя
      </Button>
      {modalState.isOpen &&
        <UserFormModal
          changeModal={setModalState}
          open={modalState.isOpen}
          modalProps={modalState.modalProps}
          onAddUser={onAddUser}
          onChangeUser={onChangeUser}
        />
      }
    </div>
  )
}

export default Users;