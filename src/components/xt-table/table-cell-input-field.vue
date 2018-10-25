<template>
  <section ref="tableCellInputField">
    <div v-if="isEdit&&(!column.onlyShow)" >
      <slot :scope="row"></slot>
      <!--文本输入框-->
      <el-input
        v-if="column.propType==='default'||column.propType==='input'"
        v-model="row[column.prop]"
        @change="handleChange"
        size="mini"
        :maxlength="column.maxlength"
        :minlength="column.minlength"
        :clearable="column.clearable"
        :placeholder="column.placeholder"
        :disabled="column.disabled"
      style="width: 100%"></el-input>
      <!--时间选择框-->
      <el-date-picker
        v-else-if="column.propType==='date'"
        v-model="row[column.prop]"
        @change="handleChange"
        type="date"
        :placeholder="column.placeholder"
        :clearable="column.clearable"
        :editable="column.editable"
        :format="column.format"
        :value-format="column.valueFormat"
        size="mini"
        :disabled="column.disabled"
        style="width: 100%"></el-date-picker>
      <!--数字输入框-->
      <xt-input-number
        v-else-if="column.propType==='number'"
        v-model.number="row[column.prop]"
        @input="handleChange"
        :maxlength="column.maxlength"
        :minlength="column.minlength"
        :max="column.max"
        :min="column.min"
        size="mini"
        :placeholder="column.placeholder"
        :disabled="column.disabled"
        style="width: 100%"
        :rightAppearance="column.rightAppearance"/>
      <!--下拉框-->
      <el-select
        v-else-if="column.propType==='select'"
        v-model="row[column.prop]"
        size="mini"
        @change="handleChange"
        :filterable="column.filterable"
        :clearable="column.clearable"
        :placeholder="column.placeholder"
        :remote="column.remote"
        :remoteMethod="column.remoteMethod"
        @input.native="e => handleQueryChange(e.target.value)"
        @focus="e => handleQueryChange('')"
        style="width:100%"
        :disabled="column.disabled">
        <el-option
          v-for="item in column.options"
          :key="item.value"
          :label="item[column.props.label]"
          :value="item[column.props.value]"
          :disabled="optionDisabled(item)">
        </el-option>
      </el-select>
      <!--单个checkbox-->
      <el-checkbox v-else-if="column.propType==='checkbox'" v-model="row[column.prop]" @change="handleChange"></el-checkbox>
    </div>
  </section>
</template>

<script>
  import XtInputNumber from "../xt-input-number";
  import Bus from "./bus";
  import {parseWidth, parseMinWidth} from "./utils/helpers";

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
    name: "TableCellInputField",
    methods: {
      // 失去焦点事件
      onFieldBlur() {
        this.validate();
      },
      onFieldChange() {
        this.validate();
      },
      // change事件
      handleChange(value) {
        const item = this.column.options.find((op) => op[this.column.props.value] === value);
        Bus.$emit(this.column.prop + "table-cell-change", {value: value, row: this.row, item});
      },
      // 远程搜索事件
      handleQueryChange(value) {
        if (this.column.remote && typeof this.column.remoteMethod === "function") {
          this.column.remoteMethod(value, this.row);
        }
      },
      // 选择框下拉框禁用事件
      optionDisabled(item) {
        let disabled = false;
        if (this.column.props.disabled) {
          const disabledItem = this.data.find((dataItem) => dataItem[this.column.prop] === item[this.column.props.value] && (this.row[this.column.prop] !== item[this.column.props.value]));
          if (disabledItem) {
            disabled = true;
          }
        }
        return disabled;
      }
    },
    mounted() {
      // console.log(this.$parent.$el.clientWidth, this.$parent.$parent.$el.clientWidth);
    },
    computed: {},
    components: {
      XtInputNumber
    },
    props: {
      column: Object,
      columns: Array,
      data: Array,
      row: Object,
      rule: [Object, Array],
      edit: Boolean,
      value: [String, Number, Date, Boolean],
      prop: [String],
      isEdit: Boolean,
      tableStore: Object
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
          this.validate();
        },
        deep: true
      }
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
</style>

