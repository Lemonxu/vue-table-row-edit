import XtTableColumn from "../xt-table/table-column.vue";
import { mergeSettings } from "../xt-table/utils/settings";

/* istanbul ignore next */
XtTableColumn.install = function(Vue, options = {}) {
  mergeSettings(options);

  Vue.component(XtTableColumn.name, XtTableColumn);
};

const settings = function(settings) {
  mergeSettings(settings);
};

export default XtTableColumn;
