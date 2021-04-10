import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import globalStore from './index'

const callsStore = createStore({
  users: [],
  tableShedule: []
})

export const getUsers = createEffect(
  async () => {
    const response = await api.get(urls.users)
    return response;
  }
)

export const getRoles = createEffect(
  async () => {
    const response = await api.get(urls.roles)
    return response;
  }
)

export const addUser = createEffect(
  async (values) => {
    const response = await api.post(urls.saveShedule, values)
    return response;
  }
)

export const deleteUser = createEffect(
  async (values) => {
    const response = await api.post(urls.saveShedule, values)
    return response;
  }
)

export const changeUser = createEffect(
  async (values) => {
    const response = await api.post(urls.saveShedule, values)
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
  .on(getRoles.done, (state, payload) => {
    return {
      ...state,
      usersRoles: payload.result.payload
    }
  })
  .on(changeUser.done, (state, payload) => {
    return {
      ...state,
      usersRoles: payload.result.data
    }
  })
  .on(addUser.done, (state, payload) => {
    return {
      ...state,
      users: [...state.users, payload.result.data]
    }
  })
  .on(deleteUser.done, (state, payload) => {
    const { userId } = payload.params
    return {
      ...state,
      users: state.users.filter(item => item.userid != userId)
    }
  })

export default callsStore;