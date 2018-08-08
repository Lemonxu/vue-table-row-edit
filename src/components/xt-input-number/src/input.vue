<template>
  <section>
    <div class="el-input" :class="[
            type === 'textarea' ? 'el-textarea' : 'el-input',
            inputSize ? 'el-input--' + inputSize : '',
            {
            'is-disabled': disabled
            }
        ]">
      <input
        :class="[{'right-appearance': rightAppearance}]"
        :type="type"
        v-bind="$props"
        :value="currentValue"
        auto-complete="off"
        :max="max"
        :maxlength="maxlength"
        :min="min"
        :minlength="minlength"
        :placeholder="placeholder"
        :controls="false"
        :disabled="disabled"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change.native="handleChange"
        class="el-input__inner"/>
    </div>
  </section>
</template>

<script>

/* html原生的maxlength\minlength會失效，所以需要采用max\min屬性 */
import Focus from "../../../mixins/focus";
import emitter from "../../../mixins/emitter";

export default {
  name: "XtInputNumber",
  mixins: [emitter, Focus("input")],
  props: {
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: () => false
    },
    placeholder: String,
    type: {
      type: String,
      default: () => "number"
    },
    size: {
      type: String,
      default: () => ""
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    maxlength: Number,
    minlength: Number,
    max: Number,
    min: {
      type: Number,
      default: () => 0
    },
    rightAppearance: Boolean
  },
  data () {
    return {
      currentValue: this.value
    };
  },
  watch: {
    "value" (value, oldValue) {
      this.setCurrentValue(value);
    }
  },
  computed: {
    inputSize () {
      return this.size;
    }
  },
  methods: {
    handleBlur (event) {
      this.$emit("blur", event);
      if (this.validateEvent) {
        this.dispatch("ElFormItem", "el.form.blur", [this.currentValue]);
      }
    },
    handleInput (event) {
      this.currentValue = this.limitValue(event.target.value);
      this.$emit("input", event.target.value, event);
    },
    handleFocus (event) {
      this.$emit("focus", event);
    },
    handleChange (event) {
      this.$emit("change", event.target.value);
    },
    setCurrentValue (value) {
      value = this.limitCurrentValue(value);
      if (value === this.currentValue) {return;}
      this.currentValue = value;
      if (this.validateEvent) {
        this.dispatch("ElFormItem", "el.form.change", [value]);
      }
    },
    limitValue (value) {
      if (parseFloat(value) !== parseFloat(this.currentValue)) {
        this.currentValue = value;
      }
      if (parseFloat(this.value) !== parseFloat(this.currentValue)) {
        value = this.value;
      }
      return value;
    },
    limitCurrentValue (value) {
      if (value === null || value === undefined) {return;}
      if (value.toString().length >= this.maxlength) {
        value = value.toString().slice(0, this.maxlength);
      }
      if (value >= this.max) {
        value = this.max;
      }
      if (value <= this.min) {
        value = this.min;
      }
      return value;
    }
  }
};
</script>

<style scoped>
  .right-appearance::-webkit-outer-spin-button, .right-appearance::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }

</style>
