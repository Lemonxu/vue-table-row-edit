import Vue from "vue";
import Demo from "./demo.vue";
// import ElementUI from "element-ui";
import components from "../src";
import "element-ui/lib/theme-chalk/index.css";
// import components from "../src/components/xt-table";
import "font-awesome/css/font-awesome.min.css";
// import VueTable from "../src/components/vue-table";

Vue.config.productionTip = false;

// Vue.use(ElementUI);
Vue.use(components);
// Vue.use(VueTable);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  template: "<Demo/>",
  components: { Demo },
  data: {
    Bus: new Vue()
  }
});
