import Vue from "vue";
import Demo from "./demo.vue";
import ElementUI from "element-ui";
import components from "../src";
import "font-awesome/css/font-awesome.min.css";

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(components);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  template: "<Demo/>",
  components: { Demo },
  data: {
    Bus: new Vue()
  }
});
