import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";

import {
  BootstrapVue,
  IconsPlugin
} from "bootstrap-vue";
import '@mdi/font/css/materialdesignicons.css'

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

// Use Axios
Vue.use(VueAxios, axios);

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://127.0.0.1:8000/api' //menyingkat axios

new Vue({
  render: (h) => h(App),
}).$mount("#app");