import XtInputNumber from "./components/xt-input-number/index.js";
import XtTable from "./components/xt-table/index.js";
import XtTableColumn from "./components/xt-table-column/index.js";

const components = [
  XtInputNumber,
	XtTable,
  XtTableColumn
];

const install = function (Vue) {
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
	version: "1.0.3",
  install,
  XtInputNumber,
	XtTable,
  XtTableColumn
};
