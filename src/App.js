import React, { useEffect, useState } from "react";
import { Tabs } from 'antd';
import api, { urls } from 'api';

import UsersPage from './Pages/Users'
import Calls from './Pages/Calls'
import Reports from "./Pages/Reports";
import Shedule from "./Pages/Shedule";

import st from './styles/app.module.scss'

function App() {
  const [cities, setSities] = useState([])
  const [yls, setYls] = useState([])

  useEffect(() => {
    api.get(urls.cities).then((res) => {
      const resData = res.data.map(item => ({ ...item, itemId: item.cityid }))
      setSities(resData)
    })
    api.get(urls.getYl).then(res => {
      const resData = res.data.map(item => ({ ...item, itemId: item.contractorid }))
      setYls(resData)
    })
  }, [])

  const { TabPane } = Tabs;

  return (
    <div className={st.tabs}>
      <Tabs
        defaultActiveKey="2"
        type="card"
      >
        <TabPane tab="Звонки" key="1">
          Звон
        </TabPane>
        <TabPane tab="Расписание" key="2">
          <Shedule
            cities={cities}
            yls={yls}
          />
        </TabPane>
        <TabPane tab="Отчеты" key="3">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="Пользователи" key="4">
          <UsersPage/>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default App;
