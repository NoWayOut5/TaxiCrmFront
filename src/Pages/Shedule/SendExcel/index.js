import React from 'react';
import readXlsxFile from 'read-excel-file'
import convertToJson from "read-excel-file/schema"
import moment from 'moment'

import {
  Button,
  Input, notification
} from 'antd'

import st from '../index.module.scss'
import { setLoaderState } from '../../../stores'
import { addExcelShedule, closeAll, getShedule } from '../../../stores/shedule'
import api, { urls } from '../../../api'

const createDate = (num) => {
  const date = (num * 24).toString()
  let hours, minutes;

  if(date.indexOf('.') == -1){
    if(date.length == 1){
      return '0' + date + ':00'
    }else{
      return date + ":00"
    }
  }else{
    [hours, minutes] = date.split('.');

    if(minutes[0] !== '0'){
      minutes = ((minutes * 12 / 2) + 0).toString()
    }

    if(hours.length == 1){
      hours = '0' + hours;
    }

    if(minutes.length > 2){
      minutes = minutes.slice(0, 2)
    }

    return `${hours}:${minutes}`
  }
}

const createYearStr = (date) => {
  if(date instanceof Date){
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
  }
}

const schema = {
  'Город': {
    prop: 'city',
    type: String
  },
  'ФИО       пациента': {
    prop: 'clname',
    type: String,
  },
  'Примечание': {
    prop: 'note',
    type: String
  },
  'Адрес проживания  (Пункт А)': {
    prop: 'startingpoint',
    type: String,
  },
  'Пункт назначения  (Пункт Б)': {
    prop: 'destination',
    type: String,
  },
  'Телефон': {
    prop: 'phone',
    type: String,
  },
  'Класс авто': {
    prop: 'autoclass',
    type: String,
  },
  'Способ перевозки': {
    prop: 'transportway',
    type: String,
  },
  'Контрагент': {
    prop: 'contractor',
    type: String,
  },
  'Заказчик': {
    prop: 'customer',
    type: String,
  },
  'Наименование центра': {
    prop: 'destname',
    type: String,
  },
  'Наименование центра': {
    prop: 'destname',
    type: String,
  },

  'Понедельник вперед': {
    prop: 'mon_in',
    type: createDate
  },
  'Понедельник Назад': {
    prop: 'mon_out',
    type: createDate
  },
  'Вторник Вперёд': {
    prop: 'tue_in',
    type: createDate
  },
  'Вторник Назад': {
    prop: 'tue_out',
    type: createDate,
  },
  "Среда Вперёд": {
    prop: 'wed_in',
    type: createDate,
  },
  "Среда Назад": {
    prop: 'wed_out',
    type: createDate,
  },
  "Четверг Вперёд": {
    prop: 'thu_in',
    type: createDate,
  },
  "Четверг Назад": {
    prop: 'thu_out',
    type: createDate,
  },
  "Пятница Вперёд": {
    prop: 'fri_in',
    type: createDate,
  },
  "Пятница Назад": {
    prop: 'fri_out',
    type: createDate,
  },
  "Суббота Вперёд": {
    prop: 'sat_in',
    type: createDate,
  },
  "Суббота Назад": {
    prop: 'sat_out',
    type: createDate,
  },
  "Воскресенье Вперёд": {
    prop: 'sun_in',
    type: createDate,
  },
  "Воскресенье Назад": {
    prop: 'sun_out',
    type: createDate,
  },
  "Дата действия с": {
    prop: 'date_from',
    type: createYearStr,
  },
  "Дата действия до": {
    prop: 'date_to',
    type: createYearStr,
  },
}

const SendExcel = ({
  name,
  onParseExcel,
  title
}) => {

  const onSendExcelFile = async (json) => {
    const dataAfterPromises = []
    setLoaderState(true)

    try{
      await closeAll();
    } catch (err){
      return;
    }

    const promisesArr = json.rows.map((item, ix) => () => {
      const pr = new Promise(((resolve, reject) => {
        api.post(urls.importExcel, item)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      }))

      return pr;
    })

    async function runPromisesInSequence(promises) {
      let isBreak = false

      for (let p of promises) {
        try{
          await p();
        }catch(err){
          isBreak = true;
          break;
        }
      }

      return new Promise((resolve, reject) => {
        isBreak ? reject() : resolve();
      })
    }

    runPromisesInSequence(promisesArr)
      .then(() => {
        getShedule();
        setLoaderState(false);
        notification.open({ message: 'Файлы успешно загружены' });
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onChange = (ev) => {
    readXlsxFile(ev.target.files[0]).then((rows) => {
      const newRows = rows.map((item, ix) => {
        return ix == 0 ? item.map(headerRow => headerRow.replace(/\r?\n|\r/g, ' ')) : item;
      })
      onSendExcelFile(convertToJson(newRows, schema))
      ev.target.value = '';
    })
  }

  return (
    <div>
      <label className="ant-btn" htmlFor={name}>
        {title}
      </label>
      <input
        type="file"
        id={name}
        onChange={onChange}
        className={st.fileInput}
      />
    </div>
  )
}

export default SendExcel;