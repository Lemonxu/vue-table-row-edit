import Vue from "vue";
import { Button, Select, Input } from "element-ui";

export default {
  functional: true,
  props: ["column", "row"],
  render(createElement, { props }) {
    const data = {};
    if (props.column.cellClass) {
        data.class = props.column.cellClass;
    }
    if (props.column.template) {
        return createElement("div", data, props.column.template(props.row));
    }
    data.domProps = {};
    data.attrs = {
      value: props.row[props.column.prop]
    };
    // data.domProps.innerHTML = props.column.formatter(props.row.getValue(props.column.prop), props.row.data);
    // return createElement(Input, data, "文本内容");value
    console.log(props.row, props.column, `"row.${props.column.prop}"`);
    return createElement("el-input", {
        template: `<el-input v-model="value"></el-input>`,
      props: [props.column.prop],
      model: {
          prop: props.column.prop
      }
      }
    );
  }
};
