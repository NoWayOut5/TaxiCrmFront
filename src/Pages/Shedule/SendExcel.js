import React from 'react';
import readXlsxFile from 'read-excel-file'
import convertToJson from "read-excel-file/schema"

import {
  Button,
  Input
} from 'antd'

import st from './index.module.scss'

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

const schema = {
  'Город': {
    prop: 'city',
    type: String
  },
  'ФИО пассажира': {
    prop: 'clname',
    type: String,
  },
  'Примечание': {
    prop: 'note',
    type: String
  },
  'Пункт отправления  (Пункт А)': {
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
  
  'Понедельник Вперёд': {
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
}

const SendExcel = ({
  name,
  onParseExcel,
  title
}) => {

  const onChange = (ev) => {
    readXlsxFile(ev.target.files[0]).then((rows) => {
      const newRows = rows.map((item, ix) => {
        return ix == 0 ? item.map(headerRow => headerRow.replace(/\r?\n|\r/g, ' ')) : item;
      })
      onParseExcel(convertToJson(newRows, schema))
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