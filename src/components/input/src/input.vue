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
            :type="type" 
            v-bind="$props"
            :value="currentValue" 
            auto-complete="off" 
            :maxlength="0" 
            :placeholder="placeholder" 
            :controls="false"
            :disabled="disabled"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
            class="el-input__inner"/>
        </div>
  </section>
</template>

<script>
import Focus from '../../../mixins/focus'
import emitter from '../../../mixins/emitter'

export default {
  name:"LInput",
    mixins: [emitter,Focus('input')],
  props:{
      value:[String,Number],
      disabled:{
          type:Boolean,
          default:() => {
              return false
          }
      },
      placeholder:String,
      type:{
          type:String,
          default:() => {
              return 'number'
          }
      },
      size:{
          type:String,
          default:() => {
              return ''
          }
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
  },
  data(){
      return{
          currentValue: this.value,
      }
  },
    watch: {
        'value'(val, oldValue) {
            this.setCurrentValue(val);
        }
    },
  computed:{
      inputSize() {
        return this.size;
      },
  },
  methods:{
    handleBlur(event) {
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('ElFormItem','el.form.blur', [this.currentValue]);
        }
    },
    handleInput(event) {
        const value = event.target.value;
        this.$emit('input', value,event);
        this.setCurrentValue(value);
    },
    handleFocus(event) {
        this.$emit('focus', event);
    },
    handleChange(event) {
        this.$emit('change', event.target.value);
    },
    setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.currentValue = value;
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', [value]);
        }
      },
  },
  created(){
  }
}
</script>

<style scoped>

</style>

