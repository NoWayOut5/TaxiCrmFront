import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import axios from 'axios'

const globalStore = createStore({
  user: {
    token: localStorage.getItem('access_token'),
    auth: !!localStorage.getItem('access_token'),
    message: null
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
    const { token } = payload.result.data
    localStorage.setItem('access_token', token)

    return {
      ...state,
      user: {
        auth: true,
        token
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

    return {
      ...state,
      user: {
        auth: false,
        token: null
      }
    }
  })
  .on(logoutUser.fail, (state, payload) => {
    localStorage.removeItem('access_token')
    location.href = '/'

    return {
      ...state,
      user: {
        auth: false,
        token: null,
        message: null
      }
    }
  })
  .on(logoutEvent, (state) => {
    return {
      ...state,
      user: {
        auth: false,
        token: null,
        message: null
      }
    }
  })

export default globalStore;