import React, { useState, useEffect } from 'react';
import {
  DatePicker
} from "antd";
import reportsStore, { getReports } from "../../stores/reports";
import { useStore } from "effector-react";

import Table from './Table'

import st from './index.module.scss'

const Reports = (props) => {
  const [selectedDate, setSelectedDate] = React.useState();
  const { reports } = useStore(reportsStore)

  const selectDate = (date, dateString) => {
    dateString && getReports(dateString);
    setSelectedDate(dateString);
  }

  return (
    <div className={st.reports}>
      <DatePicker
        onChange={selectDate}
        className={st.datepicker}
      />
      <Table
        reports={selectedDate ? reports : []}
      />
    </div>
  )
}

export default Reports;