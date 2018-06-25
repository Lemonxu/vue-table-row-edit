import XtInputNumber from "./components/xt-input-number/index.js";
import {XtTable, XtTableColumn} from "./components/xt-table/index.js";

const components = [
  XtInputNumber,
	XtTable,
  XtTableColumn
];

const install = function (Vue, options = {}) {
	/* istanbul ignore if */
  if (install.installed) {return;}
	components.map((component) => {
    Vue.component(component.name, component);
  });
};

/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
	version: "2.0.1",
  install,
  XtInputNumber,
	XtTable,
  XtTableColumn
};
