<template>
  <section>
    <slot></slot>
  </section>
</template>

<script>
  import TableStore from "./table-store";

  const parseWidth = (width) => {
    if (width !== undefined) {
      width = parseInt(width, 10);
      if (isNaN(width)) {
        width = null;
      }
    }
    return width;
  };

  const parseMinWidth = (minWidth) => {
    if (minWidth !== undefined) {
      minWidth = parseInt(minWidth, 10);
      if (isNaN(minWidth)) {
        minWidth = 80;
      }
    }
    return minWidth;
  };

  export default {
    name: "XtTableColumn",
    inject: ["XtTable"],
    props: {
      label: {
        type: String,
        default: () => ""
      },
      prop: [String],
      type: {
        type: String,
        default: () => "default"
      },
      propType: {
        type: String,
        default: () => "default"
      },
      options: {
        type: Array,
        default: () => []
      },
      props: {
        default() {
          return {
            label: "label",
            value: "id",
            labelProp: false,
            disabled: false
          };
        }
      },
      filterable: Boolean,
      onlyShow: Boolean,
      clearable: Boolean,
      maxlength: {
        type: Number,
        default: () => 50
      },
      minlength: {
        type: Number,
        default: () => 0
      },
      max: Number,
      min: Number,
      placeholder: String,
      remote: Boolean, //选择框的远程搜索
      remoteMethod: Function, //选择框远程搜索方法
      showOverflowTooltip: Boolean, //当内容过长时被隐藏时是否显示tooltip
      format: {
        type: String,
        default: () => "yyyy-MM-dd"
      },
      valueFormat: {
        type: String,
        default: () => "yyyy-MM-dd hh:mm:ss"
      },
      width: [Number, String],
      minWidth: [Number, String],
      maxWidth: [Number, String],
      disabled: [Boolean],
      editable: Boolean
    },
    data() {
      const column = {
        label: this.label, /*表格表头标题*/
        prop: this.prop, /*绑定值对象*/
        type: this.type, /*table是什么状态下的，编辑模式、添加模式*/
        propType: this.propType, /*绑定的值类型，以及编辑框类型*/
        options: this.options, /*选择框的数据源、布尔值类型的数据字典*/
        props: this.props, /*下拉框绑定格式：值是哪个字段的，显示是哪个字段的、布尔值类型的绑定格式*/
        filterable: this.filterable, /*本地数据搜索，用于select*/
        onlyShow: this.onlyShow, /*仅显示，无操作*/
        clearable: this.clearable, /*是否可清除按钮*/
        maxlength: this.maxlength, /*字符串最大长度*/
        minlength: this.minlength, /*字符串最小长度*/
        max: this.max, /*最大值*/
        min: this.min, /*最小值*/
        placeholder: this.placeholder, /*placeholder属性*/
        remote: this.remote, /*是否启用远程搜索*/
        remoteMethod: this.remoteMethod, /*远程搜索方法*/
        showOverflowTooltip: this.showOverflowTooltip, /*超过设置的长度变成...省略号显示*/
        format: this.format, /*时间格式*/
        valueFormat: this.valueFormat, /*时间值类型格式*/
        width: parseWidth(this.width), /*宽度设置*/
        minWidth: parseMinWidth(this.minWidth), /*最小宽度*/
        maxWidth: parseMinWidth(this.maxWidth), /*最大宽度*/
        disabled: this.disabled, /*是否禁用*/
        editable: this.editable/*时间控件是否可以手动编辑时间*/
      };
      return {
        column
      };
    },
    watch: {
      options: {
        immediate: true,
        handler(val, oldVal) {
          this.column.options = val;
        }
      },
      XtTable: {
        immediate: true,
        handler(val, oldVal) {
          // 留空
        }
      }
    },
    methods: {},
    created() {
      // this.XtTable.states.columns.push(this.column); //更改为在table里面获取本页面的信息并且存入states.columns
      //监控table-row中选择框value值改变事件
      this.$root.Bus.$on(this.column.prop + "table-cell-change", ({value, row, item}) => {
        this.$emit("change", value, row, item);
      });
    }
  };
</script>

