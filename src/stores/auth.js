import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import axios from 'axios'

const globalStore = createStore({
  user: {
    token: localStorage.getItem('access_token'),
    auth: !!localStorage.getItem('access_token')
  }
})

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

export default globalStore;