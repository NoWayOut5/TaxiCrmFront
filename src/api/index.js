import axios from "axios";
import { setAuthToken } from '../stores/auth'

const token = localStorage.getItem('access_token')
const instance = axios.create({
  baseURL: 'https://taxicrmback-preprod.herokuapp.com',
  timeout: 30000,
});

instance.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export const urls = {
  cities: '/city/findall',

  users: '/user/findall',
  saveUser: '/user/save',
  changeUser: '/user',
  roles: '/userrole/findall',

  getContractor: '/shedule/getschedulecontractor',
  getYl: '/contractor/findall',

  shedule: '/shedule/findall',
  saveShedule: '/shedule/save',
  changeShedule: '/shedule',
  importExcel: '/shedule/import',
  closeAllShedule: '/shedule/close_all_by_contractor',

  changeDay: '/day/',
  saveDay: '/days/save',
  days: '',

  calls: '/call/findall',
  callsList: '/call/getlist',
  callsBegin: '/call/begin',
  callsInWorkList: '/call/inworklist',
  callsFinishOrder: '/call/end',
  addCall: '/call/save',

  login: '/auth/login',
  logout: '/auth/logout'
}

export default instance;