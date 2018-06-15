import XtTableColumn from "../xt-table/table-column.js";

/* istanbul ignore next */
XtTableColumn.install = function(Vue) {
  Vue.component(XtTableColumn.name, XtTableColumn);
};

export default XtTableColumn;
