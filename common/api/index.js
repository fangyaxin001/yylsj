import Request from './request';
import { API_BASE_URL, SERIAL, IS_DEV } from '../config.js';

const http = new Request();

http.setConfig((config) => {
  config.baseUrl = API_BASE_URL;
  return config
})

http.interceptor.request((config, cancel) => {
  config.header = {
    ...config.header,
    'user-token': global.token || '',
    'Accept-Language': global.locale,
    'Accept-Serial': SERIAL,
  }
  if(IS_DEV == 2){
    config.data = {
      ...config.data,
      ismock: 0,
    }
  }
  return config;
})

http.interceptor.response((response) => {
  return response;
})

export {
  http
};
