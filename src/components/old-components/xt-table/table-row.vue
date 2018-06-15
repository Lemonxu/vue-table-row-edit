<template>
  <section>
    <div  v-if="(!isEdit)||(column.onlyShow)">
      <!--选择框值显示-->
      <label
        :class="[
                    'cell','el-tooltip',
                   {'xt-text-hidden':column.showOverflowTooltip}
                   ]"
        :style="`width:${column.width}px;min-width:${column.minWidth}px;max-width:${column.maxWidth}px`"
        :title="row[column.props.labelProp]"
        v-if="column.propType==='select'&&column.props.labelProp">
        {{row[column.props.labelProp]}}
      </label>
      <!--布尔值显示-->
      <label
        :class="[
                    'cell','el-tooltip',
                   {'xt-text-hidden':column.showOverflowTooltip}
                   ]"
        :style="`width:${column.width}px;min-width:${column.minWidth}px;max-width:${column.maxWidth}px`"
        :title="row[column.props.labelProp]"
        v-else-if="column.propType==='boolean'">
        {{getBooleanLabel()}}
      </label>
      <!--checkbox选择框显示-->
      <label
        :class="[
                    'cell','el-tooltip',
                   {'xt-text-hidden':column.showOverflowTooltip}
                   ]"
        :title="row[column.props.labelProp]"
        v-else-if="column.propType==='checkbox'">
        <el-checkbox v-model="row[prop]" :disabled="true"></el-checkbox>
      </label>
      <!--默认显示值-->
      <label v-else
             :class="[
                    'cell','el-tooltip',
                   { 'xt-text-hidden': column.showOverflowTooltip }
                   ]"
             :style="`width:${column.width}px;min-width:${column.minWidth}px;max-width:${column.maxWidth}px`"
             :title="row[prop]">
        {{value}}
      </label>
    </div>
    <div v-if="isEdit&&(!column.onlyShow)" >
      <slot :scope="row"></slot>
      <!--文本输入框-->
      <el-input
        v-if="column.propType==='default'||column.propType==='input'"
        v-model="row[prop]"
        @change="handleChange"
        size="mini"
        :class="[{
                    'is-error': validateState === 'error',
                },
                validateState==='error'?'error':'success',
                ]"
        :maxlength="column.maxlength"
        :minlength="column.minlength"
        :clearable="column.clearable"
        :placeholder="column.placeholder"
        :disabled="column.disabled"></el-input>
      <!--时间选择框-->
      <el-date-picker
        v-else-if="column.propType==='date'"
        v-model="row[prop]"
        @change="handleChange"
        type="date"
        :placeholder="column.placeholder"
        :class="[{
                    'is-error': validateState === 'error',
                },
                validateState==='error'?'error':'success',
                ]"
        :clearable="column.clearable"
        :editable="column.editable"
        :format="column.format"
        :value-format="column.valueFormat"
        size="mini"
        :disabled="column.disabled"></el-date-picker>
      <!--数字输入框-->
      <xt-input-number
        v-else-if="column.propType==='number'"
        v-model.number="row[prop]"
        @input="handleChange"
        :maxlength="column.maxlength"
        :minlength="column.minlength"
        :max="column.max"
        :min="column.min"
        size="mini"
        :class="[{
                    'is-error': validateState === 'error',
                },
                validateState==='error'?'error':'success',
                ]"
        :placeholder="column.placeholder"
        :disabled="column.disabled"/>
      <!--下拉框-->
      <el-select
        v-else-if="column.propType==='select'"
        v-model.lazy="row[prop]"
        size="mini"
        @change="handleChange"
        :filterable="column.filterable"
        :class="[{
                    'is-error': validateState === 'error',
                },
                validateState==='error'?'error':'success',
                ]" :clearable="column.clearable"
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
      <el-checkbox v-else-if="column.propType==='checkbox'" v-model="row[prop]" @change="handleChange"></el-checkbox>
      <label style="color:red;font-size:smaller">{{validateMessage}}</label>
    </div>
  </section>
</template>

<script>
  import AsyncValidator from "async-validator";
  import XtInputNumber from "../xt-input-number";

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
    name: "XtTableRow",
    components: {
      XtInputNumber
    },
    props: {
      data: [Array],
      value: [String, Number, Date, Boolean],
      row: [Object],
      prop: [String],
      isEdit: {
        type: Boolean,
        default: () => false
      },
      column: {
        type: Object,
        default: () => ({})
      },
      rowIndex: [Number],
      rules: {
        type: Object,
        default: () => ({})
      }, //所有的验证规则
      rule: [Array, Object]//当前值得验证规则
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
          this.validator();
        },
        deep: true
      }
    },
    computed: {
      width: {
        get: function () {
          return this.column.width || 170;
        },
        set: function (v) {
        //  留空
        }
      }
    },
    methods: {

      /*验证*/
      validator() {
        return new Promise((resolve, reject) => {
          const validate = new AsyncValidator({[this.prop]: this.rule || {required: false}});
          validate.validate({[this.prop]: this.row[this.prop]}, { firstFields: true }, (errors, fields) => {
            this.validateState = !errors ? "success" : "error";
            this.validateMessage = errors ? errors[0].message : "";
            this.$emit("message", this.validateMessage);
            this.$set(this.column, "message", this.validateMessage);
            resolve(errors);
          });
        });
      },

      /*失去焦点事件*/
      onFieldBlur() {
        this.validator();
      },
      onFieldChange() {
        this.validator();
      },

      /*change事件*/
      handleChange(value) {
        const item = this.column.options.find((op) => op[this.column.props.value] === value);
        this.$root.Bus.$emit(this.column.prop + "table-cell-change", {value: value, row: this.row, item});
      },

      /*远程搜索事件*/
      handleQueryChange(value) {
        if (this.column.remote && typeof this.column.remoteMethod === "function") {
          this.column.remoteMethod(value, this.row);
        }
      },

      /*选择框下拉框禁用事件*/
      optionDisabled(item) {
        let disabled = false;
        if (this.column.props.disabled) {
          const disabledItem = this.data.find((dataItem) => dataItem[this.prop] === item[this.column.props.value] && (this.row[this.prop] !== item[this.column.props.value]));
          if (disabledItem) {
            disabled = true;
          }
        }
        return disabled;
      },

      /*获取是boolean类型的显示值*/
      getBooleanLabel() {
        if (!isBoolean(this.column.propType)) {return "";}
        const booleanLength = this.column.options.length;
        if (booleanLength > 0) {

          /*key:显示的label名称，value：boolean的值*/
          const booleanItem = this.column.options.find((bo) => bo[this.column.props.value] === this.row[this.prop]);
          return booleanItem[[this.column.props.label]] || "";
        } else {
          return "";
        }
      }
    },
    mounted() {
      this.$parent.$on("validator-" + this.rowIndex, (callback) => {
        this.validator();
        if (this.validateState === "success") {
          callback(true);
        } else {
          callback(false);
        }
      });
      this.$parent.$on("resetValidate-" + this.rowIndex, (arr) => {
        this.validateState = "";
        this.validateMessage = "";
      });
      if (this.rule) {
        this.$on("el.form.blur", this.onFieldBlur);
        this.$on("el.form.change", this.onFieldChange);
      }
    }
  };
</script>

<style scoped>
  .error{
    border-radius: 4px;
    border: 1px solid red;
  }
  .success{
    border-radius: 4px;
    /* border: 1px solid #adb0b5; */
  }
  .input_inline{
    padding: 3px 10px;
    display: inline-block;
  }
  .xt-text-hidden{
    /*max-width:170px;*/
    display:block;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
</style>

