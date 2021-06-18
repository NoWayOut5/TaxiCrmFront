import React, { useEffect, useState } from 'react';
import api, { urls } from 'api';
import moment from 'moment'
import readXlsxFile from 'read-excel-file'
import { useForm, Controller } from "react-hook-form";
import sheduleStore, {
  getShedule,
} from '../../stores/shedule'
import { useStore } from 'effector-react'

import {
  Button,
  Table,
  Modal,
  Input,
  Form,
  Select,
  Upload,
  notification
} from 'antd'

import SendExcel from "./SendExcel/index";
import FormItem from '../../Components/FormItem'
import Loader from '../../Components/Loader'
import FileInput from '../../Components/FileInput'
import SheduleTable from './Table'
import SheduleModal from './Modal'

import st from './index.module.scss'

const uniqId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const Shedule = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalProps, setModalProps] = useState(null)

  useEffect(() => {
    getShedule();
  }, [])

  const changeIsOpenModal = () => {
    setIsModalOpen(prev => !prev)
  }

  return (
    <div>
      <SheduleTable
        setIsModalOpen={setIsModalOpen}
        setModalProps={setModalProps}
      />
      {isModalOpen &&
        <SheduleModal
          modalProps={modalProps}
          isModalOpen={isModalOpen}
          changeIsOpenModal={changeIsOpenModal}
          setModalProps={setModalProps}
        />
      }
      <div className={st.excelContainer}>
        <Button
          type="primary"
          onClick={() => {
            setModalProps(null)
            changeIsOpenModal()
          }}
        >
          Добавить
        </Button>
        <SendExcel
          name="excelFile"
          title="Загрузить excel файл"
        />
      </div>

    </div>
  );
}

export default Shedule;