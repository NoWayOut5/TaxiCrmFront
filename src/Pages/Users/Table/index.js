import React from 'react'
import { Button, Table } from 'antd'
import st from '../index.module.scss'
import { logoutUser } from '../../../stores/auth'
import globalStore from '../../../stores'
import { useStore } from 'effector-react'

const UsersTable = ({
  users,
  changeModalState,
  setModalState,
  onDeleteUser
}) => {
  const { yls } = useStore(globalStore);

  const dataSource = users.map((item, ix) => {
    const contractor = yls.find(yl => yl.contractorid == item.contractorid)
    return {
      ...item,
      change: item.userid,
      contractor: contractor ? contractor.name : '',
      ix
    }
  })

  const changeUser = (userId) => {
    const selectedUser = users.find(item => item.userid == userId)
    setModalState({ isOpen: true, modalProps: selectedUser })
  }

  const columns = [
    { title: 'Имя', dataIndex: 'name' },
    { title: 'Логин', dataIndex: 'login' },
    { title: 'Контрагент', dataIndex: 'contractor'},
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
      rowKey="ix"
    />
  )
}

export default UsersTable;