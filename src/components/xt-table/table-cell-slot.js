
export default {
  functional: true,
  props: {
    column: Object,
    row: Object,
    edit: Boolean,
    rowIndex: Number
  },
  render(createElement, { props }) {
    const data = {};
    if (props.column.cellClass) {
      data.class = props.column.cellClass;
    }
    if (props.column.template) {
      return createElement("span", data, props.column.template({row: props.row, edit: props.edit, $index: props.rowIndex}));
    }
    return createElement("div", data);
  }
};
