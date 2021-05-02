import React, { useEffect, useState } from 'react';
import api, { urls } from 'api';
import { useForm, Controller } from "react-hook-form";
import { useStore } from 'effector-react'
import globalStore from '../../stores'
import userStore, {
  getUserRoles,
  getRolesList,
  deleteUser,
  getUsers,
  addUser,
  changeUser
} from '../../stores/users'

import {
  Checkbox,
  Select,
  Input,
  Table,
  Button,
  Modal
} from 'antd';

import UsersTable from './Table'
import UsersModal from './Modal'

import st from './index.module.scss'


const Users = (props) => {
  const { users } = useStore(userStore)
  const [modalState, setModalState] = useState({ isOpen: false, modalProps: {} })

  const onAddUser = async (values) => {
    const res = await addUser(values)
    setModalState({ modalProps: {}, isOpen: false })
    return res;
  }

  const onChangeUser = async (userId, values) => {
    await changeUser({ userId, values })
    setModalState({ modalProps: {}, isOpen: false })
  }

  const onDeleteUser = async (userId) => {
    deleteUser(userId)
  }

  useEffect(async () => {
    await getUsers()
    await getRolesList();
    await getUserRoles()
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
      <UsersTable
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
        <UsersModal
          changeModal={setModalState}
          open={modalState.isOpen}
          modalProps={modalState.modalProps}
          setModalState={setModalState}
        />
      }
    </div>
  )
}

export default Users;