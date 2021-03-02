import React, { useEffect, useState } from 'react';
import api, { urls } from 'api';
import { useForm, Controller } from "react-hook-form";
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
    <Checkbox {...props} />
  </div>
)

const UserFormModal = ({
  open,
  modalProps = {},

  onAddUser,
  onChangeUser,
  changeModal,
}) => {
  const { register, getValues, reset, control } = useForm({
    defaultValues: {
      enabled: '1',
      ...modalProps
    }
  });
  const { Option } = Select;

  const onOk = () => {
    console.log(modalProps)
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
  }, [])

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

      <Controller
        as={<Input/>}
        name="name"
        // onChange={onChange}
        placeholder="Имя"
        control={control}
      />
      <Controller
        as={<Input/>}
        name="login"
        // onChange={onChange}
        placeholder="Логин"
        control={control}
      />
      <Controller
        as={<Input/>}
        placeholder="Пароль"
        // onChange={onChange}
        name="password"
        control={control}
      />
      {/*<Input*/}
      {/*  name="name"*/}
      {/*  ref={register}*/}
      {/*  placeholder="Имя"*/}
      {/*  onChange={onChange}*/}
      {/*/>*/}
      {/*<Input*/}
      {/*  name="login"*/}
      {/*  ref={register}*/}
      {/*  placeholder="Логин"*/}
      {/*  onChange={onChange}*/}
      {/*/>*/}
      {/*<Input*/}
      {/*  name="password"*/}
      {/*  ref={register}*/}
      {/*  placeholder="Пароль"*/}
      {/*  onChange={onChange}*/}
      {/*/>*/}
      <Controller
        as={
          <Select style={{ width: 120 }}>
            <Option value="0">Заблокирован</Option>
            <Option value="1">Активен</Option>
          </Select>
        }
        defaultValue="Активен"
        name="enabled"
        // onChange={onChangeSelect}
        control={control}
      />
      {/*<Select*/}
      {/*  defaultValue="1"*/}
      {/*  name="enabled"*/}
      {/*  onChange={onChangeSelect}*/}
      {/*  style={{ width: 120 }}*/}
      {/*>*/}
      {/*  <Option value="0">Заблокирован</Option>*/}
      {/*  <Option value="1">Активен</Option>*/}
      {/*</Select>*/}
      <FormCheckbox className={st.checkbox}>
        Роль администратор системный
      </FormCheckbox>
      <FormCheckbox className={st.checkbox}>
        Роль работа со звонками
      </FormCheckbox>
      <FormCheckbox className={st.checkbox}>
        Роль администратор расписания
      </FormCheckbox>
      <FormCheckbox className={st.checkbox}>
        Роль просмотр счетов
      </FormCheckbox>
    </Modal>
  )
}

const Table2 = ({
  users,
  changeModalState,
  onDeleteUser
}) => {
  const dataSource = users.map(item => ({ ...item, change: item.userid }))

  const changeUser = (userId) => {
    const selectedUser = users.find(item => item.userid == userId)
    changeModalState(selectedUser)
  }

  const columns = [
    {
      title: 'Имя(ЮЛ)',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
    },
    {
      title: 'Пароль',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Статус',
      dataIndex: 'enabled',
      key: 'enabled',
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