import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import globalStore from './index'

const reportsStore = createStore({
  reports: [],
})

export const getReports = createEffect(
  async (timeDepth) => {
    const response = await api.get(`${urls.getReports}${timeDepth}`)
    return response;
  }
)


reportsStore
  .on(getReports.done, (state, payload) => {
    return {
      ...state,
      reports: payload.result.data
    }
  })

export default reportsStore;