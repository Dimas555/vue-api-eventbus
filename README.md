# vue-api-eventbus

### Add global axios instance `$api` and event bus `$eventBus` 

#### Installation
````
npm install vue-api-eventbus
````

##### main.js
````
import VueApiEventbus from 'vue-api-eventbus';

Vue.use(VueApiEventbus[, options]);
````

##### options (default)
`xhr` axios configuration  
`events` event list for axios interceptors

````
options = {
  xhr: {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    baseURL: '/',
  },
  events: {
    beforeRequest: 'before-request',
    requestError: 'request-error',
    afterResponse: 'after-response',
    responseError: 'response-error',
    poolCreate: 'pool-create',
    poolRemove: 'pool-remove',
    poolPush: 'pool-push',
    poolPop: 'pool-pop',
  }
}
````
Eventa are triggered:

`beforeRequest`: before request create  
`requestError`: on request error  
`afterResponse`: after response  
`responseError`: on response error  
`poolCreate`: generated request pool  
`poolRemove`: request pool is empty  
`poolPush`: add new request to the pool  
`poolPop`: complete request and remove from the pool  

Used as
`this.$eventBus.$on('event-name', handler);`

#### Usage

##### Create request
````
this.$api.get('URL').then((resp) => {})
````

##### Listen request lifecycle
````
this.$eventBus.$on('before-request', handler);
this.$eventBus.$off('before-request', handler);
````

##### Custom events
````
this.$eventBus.$emit('event-name'[, payload]);
this.$eventBus.$on('event-name', handler);
this.$eventBus.$off('event-name', handler);
````
