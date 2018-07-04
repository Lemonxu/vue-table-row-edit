
export default {
  functional: true,
  props: {
    column: Object,
    columns: Array,
    data: Array,
    row: Object,
    edit: Boolean,
    rowIndex: Number,
    tableStore: Object,
    tableCellStyle: String,
    type: String
  },
  render(createElement, { props }) {
    const data = {attrs: {}};
    if (props.tableStore.tableCellSlot) {
      // console.log(props.type, props.row[props.column.prop]);
      data.class = props.edit ? "" : props.tableStore.tableCellSlot.class || "";
      if (props.type !== "operation") {
        data.style = props.tableCellStyle || props.tableStore.tableCellSlot.style || "";
      }
      data.attrs.title = props.row[props.column.prop] || "";
    }
    if (props.column.template) {
      return createElement("label", data, props.column.template({row: props.row, edit: props.edit, $index: props.rowIndex, data: props.data}));
    }
    return createElement("div", data);
  }
};
