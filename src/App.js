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

const DEFAULT_TAB = "0"
const ROLES = {
  admin: 'ROLE_ADMIN',
  calls: 'ROLE_WORKWITHCALLS',
  shedule: 'ROLE_SCHEDULEADMIN',
  reporst: 'ROLE_VIEWREPORTS'
}

// const ProtectedTab = ({ children, role, renderItem, ...props }) => {
//   const { user: {roles: userRole} } = useStore(authStore);
//
//   console.log(userRole.find(r => r == ROLES.admin))
//
//   // if(!userRole.find(r => r == ROLES.admin) || !userRole.find(r => r == role)){
//   //   return null
//   // }
//
//   return null;
//
//   const { TabPane } = Tabs;
//
//   return (
//     <TabPane {...props}>
//       {children}
//     </TabPane>
//   )
// }

const App = observer((props) => {
  const [loaderState, setLoaderState] = useState();
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const { user: { auth, roles: userRoles } } = useStore(authStore)

  useEffect(() => {
    if(auth && !(userRoles.length == 1 && userRoles.find(r => r == ROLES.reporst))){
      getCities();
      getYls();
    }
  }, [auth])

  const { TabPane } = Tabs;

  if(!auth){
    return <Auth />
  }

  const tabs = [
    { title: 'Звонки', role: ROLES.calls, content: Calls, props: { isActiveTab: activeTab == '1' } },
    { title: 'Расписание', role: ROLES.shedule, content: Shedule },
    { title: 'Отчеты', role: ROLES.reporst, content: "Content of Tab Pane 3" },
    { title: 'Пользователи', role: ROLES.admin, content: UsersPage },
  ]

  const renderedTabs = tabs.filter((tab, key) => {
    if(userRoles.find(r => r == ROLES.admin) || userRoles.find(r => r == tab.role)){
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
        {renderedTabs.map((item, ix) => (
          <TabPane tab={item.title} key={ix}>
            {typeof item.content !== 'string' ? React.createElement(item.content, item.props ? { isActiveTab: activeTab == '1' } : {}) : item.content}
          </TabPane>
        ))}
        {/*<ProtectedTab*/}
        {/*  tab="Звонки"*/}
        {/*  key="1"*/}
        {/*  role={ROLES.calls}*/}
        {/*>*/}
        {/*  <Calls isActiveTab={activeTab == "1"} />*/}
        {/*</ProtectedTab>*/}
        {/*<ProtectedTab*/}
        {/*  tab="Расписание"*/}
        {/*  key="2"*/}
        {/*  role={ROLES.shedule}*/}
        {/*>*/}
        {/*  <Shedule />*/}
        {/*</ProtectedTab>*/}
        {/*<ProtectedTab*/}
        {/*  tab="Отчеты"*/}
        {/*  key="3"*/}
        {/*  role={ROLES.reporst}*/}
        {/*>*/}
        {/*  Content of Tab Pane 3*/}
        {/*</ProtectedTab>*/}
        {/*<ProtectedTab*/}
        {/*  tab="Пользователи"*/}
        {/*  key="4"*/}
        {/*  role={ROLES.admin}*/}
        {/*>*/}
        {/*  <UsersPage />*/}
        {/*</ProtectedTab>*/}
      </Tabs>
    </div>
  )
})

export default App;
