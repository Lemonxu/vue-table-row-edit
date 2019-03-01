import XtInputNumber from "./components/xt-input-number/index.js";
import XtTable from "./components/xt-table";
import XtTableColumn from "./components/xt-table-column";

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
	version: "2.0.13",
  install,
  XtInputNumber,
	XtTable,
  XtTableColumn
};
