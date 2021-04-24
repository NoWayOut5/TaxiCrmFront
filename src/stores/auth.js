import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import axios from 'axios'

const globalStore = createStore({
  user: {
    token: localStorage.getItem('access_token'),
    auth: !!localStorage.getItem('access_token'),
    message: null,
    roles: localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : []
  }
})

export const logoutEvent = createEvent('logoutEvent')

export const authUser = createEffect(
  async ({ login, password }) => {
    const response = await api.post(urls.login, { login, password })
    return response;
  }
)

export const logoutUser = createEffect(
  async () => {
    const response = await api.post(urls.logout)
    return response;
  }
)

export const getYls = createEffect(
  async (sheduleId, dayId) => {
    const response = await api.get(urls.getYl)
    return response;
  }
)

globalStore
  .on(authUser.done, (state, payload) => {
    const { token, roles } = payload.result.data
    localStorage.setItem('access_token', token)
    localStorage.setItem('roles', JSON.stringify(roles))

    return {
      ...state,
      user: {
        ...state.user,
        token,
        roles,
        auth: true
      },
    }
  })
  .on(authUser.fail, (state, payload) => {
    const { message } = payload.error.response.data
    return {
      ...state,
      user: {
        ...state.user,
        message
      }
    }
  })
  .on(logoutUser.done, (state, payload) => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('roles')

    return {
      ...state,
      user: {
        ...state.user,
        auth: false,
        token: null,
        roles: []
      }
    }
  })
  .on(logoutUser.fail, (state, payload) => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('roles')
    location.href = '/'

    return {
      ...state,
      user: {
        ...state.user,
        auth: false,
        token: null,
        message: null,
        roles: []
      }
    }
  })
  .on(logoutEvent, (state) => {
    return {
      ...state,
      user: {
        ...state.user,
        auth: false,
        token: null,
        message: null,
        roles: []
      }
    }
  })

export default globalStore;