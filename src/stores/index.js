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

export default globalStore;

export const getYlNameById = (contractorid) => {
  const { yls } = globalStore.getState();

  if(contractorid){
    const selectedYl = yls.find(c => c.contractorid == contractorid)
    return selectedYl && selectedYl.name
  }
}
export const getCityNameById = (cityid) => {
  const { cities } = globalStore.getState();

  if(cityid){
    const selectedCity = cities.find(c => c.cityid == cityid)
    return selectedCity && selectedCity.name
  }
}