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

const DEFAULT_TAB = "1"
const ROLES = {
  admin: 'ROLE_ADMIN',
  calls: 'ROLE_WORKWITHCALLS',
  shedule: 'ROLE_SCHEDULEADMIN',
  reporst: 'ROLE_VIEWREPORTS'
}

const App = observer((props) => {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

  const { loaderState } = useStore(globalStore);
  const { user: { auth, roles: userRoles } } = useStore(authStore)
  const { TabPane } = Tabs;
  const userIsRepostRole = (userRoles.length == 1 && userRoles.find(r => r == ROLES.reporst))

  useEffect(() => {
    if(auth && !userIsRepostRole){
      getCities();
      getYls();
    }
  }, [auth])

  if(!auth){
    return <Auth />
  }

  const tabs = [
    { title: 'Звонки', role: ROLES.calls, content: Calls, props: { isActiveTab: activeTab == '1' } },
    { title: 'Расписание', role: ROLES.shedule, content: Shedule },
    { title: 'Отчеты', role: ROLES.reporst, content: "В разработке" },
    { title: 'Пользователи', role: ROLES.admin, content: UsersPage },
  ].filter((tab, key) => {
    const selectedRole = userRoles.find(userRole => {
      return userRole == ROLES.admin || userRole == tab.role;
    })

    if(selectedRole){
      return tab
    }
  })

  return (
    <div className={st.tabs}>
      <Loader
        start={loaderState}
        position="top"
      />
      <Tabs
        defaultActiveKey={DEFAULT_TAB}
        type="card"
        tabBarExtraContent={{
          right: <Button onClick={logoutUser}>Выход</Button>
        }}
        style={{ width: '100%' }}
        onChange={(activeTab) => {
          setActiveTab(activeTab)
        }}
      >
        {tabs.map((item, ix) => (
          <TabPane tab={item.title} key={ix + 1}>
            {typeof item.content !== 'string' ?
              React.createElement(item.content, item.props && item.props) :
              item.content
            }
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
})

export default App;
