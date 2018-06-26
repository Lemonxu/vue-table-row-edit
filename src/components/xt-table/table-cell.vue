<template>
   <div>
     <div v-if="!column.template" :class="['el-form-item','is-required', {'is-error': validateState === 'error'}]">
       <table-cell-input-field :row="row" :column="column" :isEdit="edit" :rowIndex="rowIndex"></table-cell-input-field>
     </div>
     <div v-else :class="['el-form-item','is-required', {'is-error': validateState === 'error'}]">
       <table-cell-slot :row="row" :column="column"  :class="[{
                  'is-error': validateState === 'error',
                },
                  validateState==='error'?'error':'success',
                ]"
                :edit="edit"
                :rowIndex="rowIndex"></table-cell-slot>
     </div>
     <label style="color:red;font-size:smaller">{{validateMessage}}</label>
   </div>
</template>

<script>
  import AsyncValidator from "async-validator";
  import TableCellSlot from "./table-cell-slot.js";
  import TableCellInputField from "./table-cell-input-field";
  import Bus from "./bus";

	export default {
		name: "XtTableCell",
    methods: {
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
      }
    },
    mounted() {
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
    components: {
      TableCellSlot,
      TableCellInputField
    },
    data() {
      return {
        validateMessage: "",
        validateState: ""
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
      row: Object,
      rule: [Object, Array],
      edit: Boolean,
      value: [String, Number, Date, Boolean],
      rowIndex: Number
    }
	};
</script>
<style scoped>
.el-form-item{
  margin-bottom: 0px;
}
</style>
