import Vue from "vue";
import App from "./App.vue";
import "./assets/style.scss";

window.axios = require("axios");

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
