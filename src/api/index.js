import axios from "axios";

const instance = axios.create({
  baseURL: 'https://taxicrmback-preprod.herokuapp.com',
  timeout: 30000,
});

export const urls = {
  cities: '/city/findall',

  users: '/user/findall',
  saveUser: '/user/save',
  changeUser: '/user',

  getShedule: '',
  getContractor: '/shedule/getschedulecontractor',
  getYl: '/contractor/findall',
  saveShedule: '/shedule/save',
  changeShedule: '/shedule',
  importExcel: '/shedule/import',

  changeDay: '/day/',
  saveDay: '/days/save'
}

export default instance;