import React, { useEffect, useState } from 'react'
import api, { urls } from 'api';
import { useStore } from 'effector-react'
import callsStore, {
  getCalls,
  getCallsList,
  getCallsInWork,
  takeInOrder
} from "../../stores/call";
import globalStore from '../../stores'
import { observer } from 'mobx-react'

import { Controller, useForm } from 'react-hook-form'
import {
  Button, Input, Modal, Select,
  Table,
} from 'antd'

import CallsTable from './CallsTable'
import CallsInWorkTable from './CallsInWorkTable'
import CallsModal from './CallsModal'
import AddCall from './AddCall'

import st from "../Users/index.module.scss";

const Calls = ({
  isActiveTab
}) => {
  const [isOpenModal, setIsOpenModal] = React.useState()
  const [changedRecordId, setChangedRecordId] = React.useState()
  const [isMounted, setIsMounted] = React.useState(null)

  const { calls, callsInWork } = useStore(callsStore)
  const { yls, cities } = useStore(globalStore)

  const openModal = (recordId) => {
    setIsOpenModal(true)
    setChangedRecordId(recordId)
  }

  const closeModal = () => {
    setIsOpenModal(false)
    setChangedRecordId(null)
  }

  useEffect(() => {
    if(isActiveTab){
      getCallsList();
      getCallsInWork();
      let interval;

      if(process.env.NODE_ENV == 'production'){
        interval = setInterval(() => {
          getCallsList();
          getCallsInWork();
        }, 5000)
      }

      return () => {
        if(process.env.NODE_ENV == 'production'){
          clearInterval(interval)
        }
      }
    }
  }, [isActiveTab])

  return (
    <div>
      <AddCall />
      <CallsTable
        data={calls}
      />
      <CallsInWorkTable
        data={callsInWork}
        openModal={openModal}
      />
      {isOpenModal &&
      <CallsModal
        open={isOpenModal}
        closeModal={closeModal}
        changedRecordId={changedRecordId}
      />
      }
    </div>
  )
}

export default Calls;