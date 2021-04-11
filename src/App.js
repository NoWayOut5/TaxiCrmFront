import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react'
import { Tabs } from 'antd';
import api, { urls } from 'api';
import { useStore } from "effector-react";
import globalStore, { getCities, getYls } from "./stores";
import authStore, { logoutUser } from "./stores/auth";

import {
  Button
} from 'antd'
import UsersPage from './Pages/Users'
import Calls from './Pages/Calls'
import Reports from "./Pages/Reports";
import Shedule from "./Pages/Shedule";
import Auth from './Pages/Auth'
import Loader from "./Components/Loader";

import st from './styles/app.module.scss'


const App = observer((props) => {
  const [loaderState, setLoaderState] = useState();
  const { user } = useStore(authStore)

  useEffect(() => {
    if(user.auth){
      getCities();
      getYls();
    }
  }, [user.auth])

  const { TabPane } = Tabs;

  if(!user.auth){
    return <Auth />
  }

  return (
    <div className={st.tabs}>
      <Loader
        start={loaderState}
        position="top"
      />
      <Tabs
        defaultActiveKey="4"
        type="card"
        tabBarExtraContent={{
          right: <Button onClick={logoutUser}>Выход</Button>
        }}
        style={{ width: '100%' }}
      >
        <TabPane tab="Звонки" key="1">
          <Calls />
        </TabPane>
        <TabPane tab="Расписание" key="2">
          <Shedule />
        </TabPane>
        <TabPane tab="Отчеты" key="3">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="Пользователи" key="4">
          <UsersPage />
        </TabPane>
      </Tabs>
    </div>
  )
})

export default App;
