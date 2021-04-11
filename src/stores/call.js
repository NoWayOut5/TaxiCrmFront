import { createStore, createEvent, createEffect } from 'effector';
import api, { urls } from 'api';
import globalStore from "./index";

const callsStore = createStore({
  calls: [],
  callsInWork: []
})

export const changeRecord = createEvent('changeOrder')

export const getCalls = createEffect(
  async () => {
    const response = await api.get(urls.calls)
    return response;
  }
)

export const getCallsList = createEffect(
  async () => {
    const response = await api.get(urls.callsList + '300')
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
  async ({ note, phone }) => {
    const response = await api.post(`${urls.addCall}`, { phone, note })
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
  .on(changeRecord, (state, payload) => {
    const { callid } = payload;
    const { callsInWork } = state

    return {
      ...state,
      callsInWork: callsInWork.map(item => item.callid == callid ? {...item, ...payload} : item)
    }
  })
  .on(addCall.done, (state, payload) => {
    return {
      ...state,
      callsInWork: [...state.callsInWork, payload.result.data]
    }
  })

export default callsStore;