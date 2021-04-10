import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import globalStore from './index'

const callsStore = createStore({
  shedule: [],
  tableShedule: []
})

const dayToTable = (item) => {
  const tableDays = { in: {}, out: {} }

  item.days && item.days.forEach(day => {
    tableDays[day.direction] && (tableDays[day.direction][day.name] = day.time)
  })

  return {
    ...item,
    tableDays
  }
}

export const addExcelShedule = createEvent('addExcelShedule')

export const getShedule = createEffect(
  async () => {
    const response = await api.get(urls.shedule)
    return response;
  }
)

export const addShedule = createEffect(
  async (values) => {
    const response = await api.post(urls.saveShedule, values)
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
  .on(addExcelShedule, (state, payload) => {
    return {
      ...state,
      shedule: [...state.shedule, ...payload],
      tableShedule: [...state.shedule, ...payload.map(dayToTable)]
    }
  })


export default callsStore;