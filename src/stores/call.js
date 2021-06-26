import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import globalStore from "./index";

const callsStore = createStore({
  calls: [],
  callsInWork: []
})

export const getCalls = createEffect(
  async () => {
    const response = await api.get(urls.calls)
    return response;
  }
)

export const getCallsList = createEffect(
  async () => {
    const response = await api.get(urls.callsList + '120')
    // const response = await api.get(urls.calls)
    return response;
  }
)

export const getCallsInWork = createEffect(
  async () => {
    const response = await api.get(urls.callsInWorkList);
    return response;
  }
)

export const takeInOrder = createEffect(
  async ({ sheduleid, dayid }) => {
    const response = await api.post(`${urls.callsBegin}/${sheduleid}/${dayid}`)
    return response;
  }
)

export const finishOrder = createEffect(
  async (callId) => {
    const response = await api.post(`${urls.callsFinishOrder}/${callId}`)
    return response;
  }
)

export const addCall = createEffect(
  async ({ note, phone, start_call_time = '', finish_call_time = '' }) => {
    const response = await api.post(`${urls.addCall}?note=${note}&phone=${phone}`, { phone, note, start_call_time, finish_call_time })
    return response;
  }
)

export const addCallNew = createEffect(
  async ({ note, phone, start_call_time = '', finish_call_time = '' }) => {
    const response = await api.get(`${urls.createCall}/${phone}/${note}`, { phone, note, start_call_time, finish_call_time })
    return response;
  }
)

export const changeRecordInWorkTable = createEffect(
  async (values) => {
    const response = await api.put(`${urls.saveCall}/${values.callid}`, values)
    return response;
  }
)

callsStore
  .on(getCalls.done, (state, payload) => {
    return {
      ...state,
      callsInWork: payload.result.data
    }
  })
  .on(getCallsList.done, (state, payload) => {
    return {
      ...state,
      calls: payload.result.data
    }
  })
  .on(getCallsInWork.done, (state, payload) => {
    return {
      ...state,
      callsInWork: payload.result.data,
    }
  })
  .on(takeInOrder.done, (state, payload) => {
    const { params: { sheduleid }, result } = payload;
    const calls = state.calls.filter(item => item.sheduleid != sheduleid)
    const callsRecord = state.calls.find(item => item.sheduleid == sheduleid)
    const callsInWork = [...state.callsInWork, callsRecord]

    return {
      ...state,
      calls,
      callsInWork
    }
  })
  .on(finishOrder.done, (state, payload) => {
    const { params: callid, result } = payload;
    const callsInWork = state.callsInWork.filter(item => item.callid != callid)

    return {
      ...state,
      callsInWork
    }
  })
  .on(changeRecordInWorkTable.done, (state, payload) => {
    const { result: { data } } = payload;
    const { callsInWork } = state;

    return {
      ...state,
      callsInWork: callsInWork.map(item => item.callid == data.callid ? { ...item, ...data } : item)
    }
  })
  .on(addCall.done, (state, payload) => {
    return {
      ...state,
      callsInWork: [...state.callsInWork, payload.result.data]
    }
  })
  .on(addCallNew.done, (state, payload) => {
    return {
      ...state,
      callsInWork: [...state.callsInWork, payload.result.data]
    }
  })

export default callsStore;