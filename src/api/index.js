import axios from "axios";
import { setAuthToken } from '../stores/auth'

const token = localStorage.getItem('access_token')
const instance = axios.create({
  baseURL: 'https://taxicrmcommon.herokuapp.com',
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

  getContractor: '/shedule/getschedulecontractor',
  getYl: '/contractor/findall',

  shedule: '/shedule/findall',
  saveShedule: '/shedule/save',
  changeShedule: '/shedule',
  importExcel: '/shedule/import',

  changeDay: '/day/',
  saveDay: '/days/save',
  days: '',

  calls: '/call/findall',
  callsList: '/call/getlist',
  callsBegin: '/call/begin',
  callsInWorkList: '/call/inworklist',
  callsFinishOrder: '/call/end',

  login: '/auth/login',
  logout: '/auth/logout'
}

// if(process.env.NODE_ENV == 'development'){
//   Object.keys(urls).forEach((key) => {
//     urls[key] = '/api' + urls[key]
//   })
// }

export default instance;