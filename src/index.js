import axios from 'axios';

const xhrDefault = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  baseURL: '/',
};
const eventsDefault = {
  beforeRequest: 'before-request',
  requestError: 'request-error',
  afterResponse: 'after-response',
  responseError: 'response-error',
  poolCreate: 'pool-create',
  poolRemove: 'pool-remove',
  poolPush: 'pool-push',
  poolPop: 'pool-pop',
};
const defaultOptions = {
  events: eventsDefault,
  xhr: xhrDefault,
};
let count = 0;

export default {
  install(Vue, options) {
    const { events, xhr } = { ...defaultOptions, ...options };
    const apiEventBus = new Vue();
    const apiService = axios.create(xhr);
    apiService.interceptors.request.use((conf) => {
      apiEventBus.$emit(events.beforeRequest);
      if (!count) {
        apiEventBus.$emit(events.poolCreate);
      }
      count++;
      apiEventBus.$emit(events.poolPush);
      return conf;
    }, (error) => {
      count--;
      apiEventBus.$emit(events.poolPop);
      if (!count) {
        apiEventBus.$emit(events.poolRemove);
      }
      apiEventBus.$emit(events.requestError);
      return Promise.reject(error);
    });
    apiService.interceptors.response.use((response) => {
      count--;
      apiEventBus.$emit(events.poolPop);
      if (!count) {
        apiEventBus.$emit(events.poolRemove);
      }
      apiEventBus.$emit(events.afterResponse);
      return response;
    }, (error) => {
      count--;
      apiEventBus.$emit(events.poolPop);
      if (!count) {
        apiEventBus.$emit(events.poolRemove);
      }
      apiEventBus.$emit(events.responseError);
      return Promise.reject(error);
    });
    Object.defineProperties(Vue.prototype, {
      $api: {
        value: apiService,
      },
      $eventBus: {
        value: apiEventBus,
      },
    });
  },
};
