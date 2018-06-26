import XtTable from "./table.vue";
import { mergeSettings } from "./utils/settings";

/* istanbul ignore next */
XtTable.install = function (Vue, options = {}) {
  mergeSettings(options);
  Vue.component(XtTable.name, XtTable);
};

export default XtTable;
