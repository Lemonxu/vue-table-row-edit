<template>
    <div v-if="false">
        <slot></slot>
    </div>
</template>

<script>
  import settings from "./utils/settings";
  import Bus from "./bus";

  export default {
    name: "XtTableColumn",
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
      editable: Boolean,
      sortable: { default: true, type: Boolean },
      sortBy: { default: null },
      filterOn: { default: null },
      formatter: { default: (v) => v, type: Function },
      hidden: { default: false, type: Boolean },
      cellClass: { default: settings.cellClass },
      headerClass: { default: settings.headerClass },
      align: {
        type: String,
        default: () => "left"
      },
      rightAppearance: Boolean,
      if: {
        type: Boolean,
        default: () => true
      }
    },
    created() {
      Bus.$on(this.prop + "table-cell-change", ({value, row, item}) => {
        this.$emit("change", value, row, item);
        // console.log(value);
      });
    }
  };
</script>
