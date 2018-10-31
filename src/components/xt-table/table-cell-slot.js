
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
    type: String,
    $el: HTMLDivElement
  },
  render(createElement, {props, slots}) {
    const data = {attrs: {}};
    if (props.tableStore.tableCellSlot) {
      data.class = `${props.edit ? "" : props.tableStore.tableCellSlot.class || "cell el-tooltip"} ${props.column.showOverflowTooltip ? "xt-text-hidden" : ""}`;
      if (props.type !== "operation") {
        data.style = props.tableCellStyle || props.tableStore.tableCellSlot.style || "";
      }
      if (props.$el) {
        data.attrs.title = props.$el.innerText || "";
      }
    }
    if (props.column.template) {
      return createElement("label", data, props.column.template({row: props.row, edit: props.edit, $index: props.rowIndex, data: props.data}));
    }
    return createElement("div", data);
  }
};
