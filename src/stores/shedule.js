import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import globalStore from './index'
import {values} from "mobx";

const callsStore = createStore({
  shedule: [],
  tableShedule: []
})

export const daysList = [
  'mon_in',
  'mon_out',
  'sat_in',
  'sat_out',
  'sun_in',
  'sun_out',
  'thu_in',
  'thu_out',
  'tue_in',
  'tue_out',
  'wed_in',
  'wed_out',
  'fri_in',
  'fri_out',
]

const dayToTable = (item) => {
  const tableDays = {
    in: {
      'mon_in': null,
      'sat_in': null,
      'sun_in': null,
      'thu_in': null,
      'tue_in': null,
      'wed_in': null,
      'fri_in': null,
    },
    out: {
      'mon_out': null,
      'sat_out': null,
      'sun_out': null,
      'thu_out': null,
      'tue_out': null,
      'wed_out': null,
      'fri_out': null
    }
  }

  Object.keys(tableDays.in).forEach(day => {
    item[day] && (tableDays.in[day.split('_')[0]] = item[day])
  })

  Object.keys(tableDays.out).forEach(day => {
    item[day] && (tableDays.out[day.split('_')[0]] = item[day])
  })

  return {
    ...item,
    tableDays
  }
}

export const addExcelShedule = createEvent('addExcelShedule')

export const getShedule = createEffect(
  async () => {
    const response = await api.get(urls.sheduleFindByContractor)
    return response;
  }
)

export const addShedule = createEffect(
  async (values) => {
    const response = await api.post(urls.saveShedule, values)
    return response;
  }
)

export const addSheduleNew = createEffect(
  async (values) => {
    const response = await api.post(urls.sheduleImport, values)
    return response;
  }
)

export const closeShedule = createEffect(
  async (id) => {
    const response = await api.post(`${urls.closeShedule}/${id}`, values)
    return response;
  }
)

export const changeShedule = createEffect(
  async (values) => {
    const { data, sheduleid } = values;

    const response = await api.put(urls.changeShedule + "/" + sheduleid, data)
    return response;
  }
)

export const changeSheduleNew = createEffect(
  async (values) => {
    const { data, sheduleid } = values;

    const response = await api.post(urls.sheduleImport, data)
    return response;
  }
)

export const closeAll = createEffect(
  async (values) => {
    const response = await api.get(urls.closeAllShedule, values)
    return response;
  }
)

export const sendExcelFile = createEffect(
  async (values) => {
    const response = await api.post(urls.importExcel, values)
    return response;
  }
)

callsStore
  .on(getShedule.done, (state, payload) => {
    const shedule = payload.result.data.map(item => ({
      ...item,
      itemId: item.cityid
    }))

    const tableShedule = shedule.map(dayToTable)

    return {
      ...state,
      shedule,
      tableShedule
    }
  })
  .on(addShedule.done, (state, payload) => {
    return {
      ...state,
      shedule: [...state.shedule, payload.result.data],
      tableShedule: [...state.shedule, dayToTable(payload.result.data)]
    }
  })
  .on(changeShedule.done, (state, payload) => {
    const { params: { sheduleid }, result: { data } } = payload;

    const newShedule = state.shedule.map(item => {
      return item.sheduleid == sheduleid ? { ...item, ...data } : item
    })

    return {
      ...state,
      shedule: newShedule,
      tableShedule: newShedule.map(dayToTable)
    }
  })
  .on(changeSheduleNew.done, (state, payload) => {
    const { params: { sheduleid }, result: { data } } = payload;

    const newShedule = state.shedule.map(item => {
      return item.sheduleid == sheduleid ? { ...item, ...data } : item
    })

    return {
      ...state,
      shedule: newShedule,
      tableShedule: newShedule.map(dayToTable)
    }
  })
  .on(addExcelShedule, (state, payload) => {
    return {
      ...state,
      shedule: [...state.shedule, payload],
      tableShedule: [...state.shedule, dayToTable(payload)]
    }
  })


export default callsStore;