import XtTable from "./table.vue";
import XtTableColumn from "./table-column";
import { mergeSettings } from "./utils/settings";

/* istanbul ignore next */
export default {
  install(Vue, options = {}) {
    mergeSettings(options);

    Vue.component("xt-table", XtTable);
    Vue.component("xt-table-column", XtTableColumn);
  },

  settings(settings) {
    mergeSettings(settings);
  }
};

export { XtTable, XtTableColumn };
