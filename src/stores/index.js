import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';

import { setCitiesNames } from './shedule'

const globalStore = createStore({
  yls: [],
  cities: [],
  loaderState: false
})

export const setLoaderState = createEvent('setLoaderState')

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
  .on(setLoaderState, (state, payload) => {
    return {
      ...state,
      loaderState: payload
    }
  })
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

// getCities.done.watch((payload) => {
//   setCitiesNames(payload.result.data)
// })

export default globalStore;