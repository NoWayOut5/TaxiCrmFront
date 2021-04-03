import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';

const globalStore = createStore({
  yls: [],
  cities: []
})

export const getCities = createEffect(
  async () => {
    const response = await api.get(urls.cities)
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
  .on(getCities.done, (state, payload) => {
    const cities = payload.result.data.map(item => ({ ...item, itemId: item.cityid }))

    return {
      ...state,
      cities
    }
  })
  .on(getYls.done, (state, payload) => {
    const yls = payload.result.data.map(item => ({ ...item, itemId: item.contractorid }))
    return {
      ...state,
      yls
    }
  })

export default globalStore;