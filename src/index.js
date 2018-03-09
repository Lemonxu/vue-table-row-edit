import LTable from './components/table/index.js'
import LTableColumn from './components/table-column/index.js'
import LInput from './components/input/index.js'

const components = [
	LTable,
	LTableColumn,
	LInput
]

const install =function (Vue){
	/* istanbul ignore if */
	if (install.installed) return;

	components.map(component => {
    Vue.component(component.name, component);
  });
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};

export default {
	version: '1.0.3',
	install,
	LTable,
	LTableColumn,
	LInput
};