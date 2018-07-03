<template>
   <div>
     <template  v-if="(!edit)||(column.onlyShow)">
       <!--checkbox选择框显示-->
       <label
         :class="['cell','el-tooltip',
                 {'xt-text-hidden':column.showOverflowTooltip}
                 ]"
         :title="row[column.props.labelProp]"
         v-if="column.propType==='checkbox'">
         <el-checkbox v-model="row[column.prop]" :disabled="true"></el-checkbox>
       </label>
       <!--默认显示值-->
       <label v-else
              :class="['cell','el-tooltip',
                 { 'xt-text-hidden': column.showOverflowTooltip }
                 ]"
              :style="style"
              :title="getLabel()">
         {{getLabel()}}
       </label>
     </template>
     <template>
       <div v-if="!column.template" :class="['el-form-item','is-required', {'is-error': validateState === 'error'}]">
         <table-cell-input-field :row="row" :column="column" :tableStore="tableStore" :isEdit="edit" :rowIndex="rowIndex" :data="data"></table-cell-input-field>
       </div>
       <div v-else :class="['el-form-item','is-required', {'is-error': validateState === 'error'}]">
         <table-cell-slot
           :row="row"
            :column="column"
            :tableStore="tableStore"
            :data="data"
            :edit="edit"
            :rowIndex="rowIndex"
            :tableCellStyle="style"></table-cell-slot>
       </div>
     </template>
     <label style="color:red;font-size:smaller">{{validateMessage}}</label>
   </div>
</template>

<script>
  import AsyncValidator from "async-validator";
  import TableCellSlot from "./table-cell-slot.js";
  import TableCellInputField from "./table-cell-input-field";
  import Bus from "./bus";
  import {parseWidth, parseMinWidth} from "./utils/helpers";

  Array.prototype.max = function() {
    return Math.max.apply({}, this);
  };
  Array.prototype.min = function() {
    return Math.min.apply({}, this);
  };

  /*判断是否是布尔值*/
  const isBoolean = (propType) => {
    const booleanLabels = ["boolean", "checkbox"];
    let booleanFlag = false;
    booleanLabels.map((item) => {
      if (propType === item) {
        booleanFlag = true;
        return false;
      }
    });
    return booleanFlag;
  };

	export default {
		name: "XtTableCell",
    methods: {
      load(event) {
        console.log(event);
      },
      // 验证
      validate() {
        return new Promise((resolve) => {
          const validate = new AsyncValidator({[this.column.prop]: this.rule || {required: false}});
          validate.validate({[this.column.prop]: this.row[this.column.prop]}, { firstFields: true }, (errors, fields) => {
            this.validateState = !errors ? "success" : "error";
            this.validateMessage = errors ? errors[0].message : "";
            this.$emit("message", this.validateMessage);
            resolve(errors);
          });
        });
      },
      resetFields() {
        this.validateState = "";
        this.validateMessage = "";
      },
      getLabel() {
        if (this.column.propType === "select" && this.column.props.labelProp) {
          return this.row[this.column.props.labelProp];
        }
        // 获取是boolean类型的显示值
        if (this.column.propType === "boolean") {
          if (!isBoolean(this.column.propType)) {return "";}
          const booleanLength = this.column.options.length;
          if (booleanLength > 0) {
            // key:显示的label名称，value：boolean的值
            const booleanItem = this.column.options.find((bo) => bo[this.column.props.value] === this.row[this.column.prop]);
            return booleanItem[[this.column.props.label]] || "";
          } else {
            return "";
          }
        }
        return this.row[this.column.prop];
      },
      getTableCellFieldStyle(realWidth) {
        const minWidth = parseMinWidth(this.column.minWidth) ? parseMinWidth(this.column.minWidth) + "px" : "auto",
          width = parseWidth(this.column.width || 80) + "px";
        const sumWidth = [realWidth].reduce(function(prev, curr, idx, arr) {return prev + curr;});
        realWidth = (this.column.width || this.column.minWidth || (sumWidth * 0.7).toFixed(0)) + "px";
        let maxWidth = this.column.maxWidth || "auto";
        if (parseInt(this.column.maxWidth, 10) && parseInt(this.column.maxWidth, 10) > 0) {
          if (parseInt(this.column.maxWidth, 10) < 100) {
            maxWidth = this.column.maxWidth + "%";
          } else {
            maxWidth = this.column.maxWidth + "px";
          }
        }
        console.log(this.column, `text-align:${this.column.align};min-width:${minWidth};width:${width};max-width:${maxWidth}`);
        return `text-align:${this.column.align};min-width:${minWidth};width:${width};max-width:${maxWidth}`;
      }
    },
    mounted() {
      if (this.$el) {
        let width = parseInt(this.tableStore.table.$el.clientWidth / this.tableStore.table.columns.length, 10) + 20;
        if (this.$el.clientWidth < width) {
          width = this.$el.clientWidth + 20;
        }
        this.styleData = this.getTableCellFieldStyle(width);
        this.tableStore.tableCellSlot = {class: ["cell", "el-tooltip", {"xt-text-hidden": this.column.showOverflowTooltip}], style: this.styleData};
      }
      this.$parent.$on("resetFields", () => {
        this.resetFields();
      });
      this.$parent.$on("validate", (callback) => {
        this.validate();
        if (this.validateState === "success") {
          callback(true);
        } else {
          callback(false);
        }
      });
    },
    activated() {
      console.log(5656);
    },
    computed: {
      style: {
        get() {
          return this.styleData;
        }
      }
    },
    components: {
      TableCellSlot,
      TableCellInputField
    },
    data() {
      return {
        validateMessage: "",
        validateState: "",
        styleData: ""
      };
    },
    watch: {
      value: {
        handler: function (val, oldVal) {
          if (this.edit) {
            this.validate();
          }
        },
        deep: true
      }
    },
    props: {
      column: Object,
      columns: Array,
      data: Array,
      row: Object,
      rule: [Object, Array],
      edit: Boolean,
      value: [String, Number, Date, Boolean],
      rowIndex: Number,
      tableStore: Object
    }
	};
</script>
<style scoped>
  .xt-text-hidden{
    /*max-width:170px;*/
    display:block;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
.el-form-item{
  margin-bottom: 0px;
}
</style>
