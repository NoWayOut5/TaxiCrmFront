import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import globalStore from './index'

const callsStore = createStore({
  users: [],
  tableShedule: [],
  rolesNames: []
})

export const getUsers = createEffect(
  async () => {
    const response = await api.get(urls.users)
    return response;
  }
)

export const getUserRoles = createEffect(
  async () => {
    const response = await api.get(urls.userRoles)
    return response;
  }
)

export const getRolesList = createEffect(
  async () => {
    const response = await api.get(urls.rolesList)
    return response;
  }
)

export const saveUserRoles = createEffect(
  async (values) => {
    const response = await api.post(`/userrole/saveuserroles`, values)
    return response;
  }
)

export const addUser = createEffect(
  async (values) => {
    const response = await api.post(urls.saveUser, values)
    return response;
  }
)

export const deleteUser = createEffect(
  async (userId) => {
    const response = await api.delete(`/user/${userId}`)
    return response;
  }
)

export const changeUser = createEffect(
  async ({ userId, values }) => {
    const response = await api.put(`${urls.changeUser}/${userId}`, values)
    return response;
  }
)

callsStore
  .on(getUsers.done, (state, payload) => {
    return {
      ...state,
      users: payload.result.data
    }
  })
  .on(changeUser.done, (state, payload) => {
    const { users } = state;
    const { userId, values } = payload.params;

    const ix = users.findIndex(item => item.userid == userId)
    const newUsers = [...users]
    newUsers[ix] = values

    return {
      ...state,
      users: newUsers
    }
  })
  .on(addUser.done, (state, payload) => {
    return {
      ...state,
      users: [...state.users, payload.result.data]
    }
  })
  .on(deleteUser.done, (state, payload) => {
    const userId = payload.params

    return {
      ...state,
      users: state.users.filter(item => item.userid != userId)
    }
  })

  .on(getRolesList.done, (state, payload) => {
    return {
      ...state,
      rolesNames: payload.result.data
    }
  })
  .on(getUserRoles.done, (state, payload) => {
    const { users, rolesNames } = state;

    return {
      ...state,
      users: users.map(item => {
        const roleItem = rolesNames.find(role => role.userid == item.userId)
        return {
          ...item,
          role: roleItem
        }
      })

    }
  })


export default callsStore;