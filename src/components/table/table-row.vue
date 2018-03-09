<template>
    <section>
        <div  v-if="(!isEdit)||(column.onlyShow)">
            <label v-if="column.propType=='select'&&column.props.labelProp">{{row[column.props.labelProp]}}</label>
            <label v-else>{{row[prop]}}</label>
        </div>
        <div v-if="isEdit&&(!column.onlyShow)" >
            <slot :scope="row"></slot>
            <el-input 
                v-if="column.propType=='default'||column.propType=='input'" 
                v-model="row[prop]" 
                @change="handleChange"
                size="mini"
                :class="[{
                    'is-error': validateState === 'error',
                },
                validateState==='error'?'error':'success',
                ]"
                :clearable="column.clearable"></el-input>
            <el-date-picker
                v-else-if="column.propType=='date'" 
                v-model="row[prop]"
                @change="handleChange"
                type="date"
                placeholder="选择日期"
                :class="[{
                    'is-error': validateState === 'error',
                },
                validateState==='error'?'error':'success',
                ]"
                :clearable="column.clearable"></el-date-picker>
            <l-input
                type="number"
                v-else-if="column.propType=='number'"  
                v-model.number="row[prop]"
                @change="handleChange"
                :controls="false"
                size="mini"
                :class="[{
                    'is-error': validateState === 'error',
                },
                validateState==='error'?'error':'success',
                ]"/>
            <el-select
                v-else-if="column.propType=='select'"
                v-model="row[prop]" 
                size="mini"
                @change="handleChange"
                :filterable="column.filterable"
                :class="[{
                    'is-error': validateState === 'error',
                },
                validateState==='error'?'error':'success',
                ]" :clearable="column.clearable">
                    <el-option
                    v-for="item in column.options"
                    :key="item.value"
                    :label="item[column.props.label]"
                    :value="item[column.props.value]">
                    </el-option>
            </el-select>
            <label style="color:red;font-size:smaller">{{validateMessage}}</label>
        </div>
    </section>
</template>

<script>
import AsyncValidator from 'async-validator';
import LInput from '../input'


export default {
    name:'LTableRow',
    components:{
        LInput
    },
    props:{
        value:[String,Number],
        row:[Object],
        prop:[String],
        isEdit:{
            type:Boolean,
            default:() => {
                return false
            }
        },
        column:{
            type:Object,
            default:() => {
                return {};
            }
        },
        rowIndex:[Number],
        rules:{
            type:Object,
            default:() => {
                return {}
            }
        },//所有的验证规则
        rule:[Array,Object],//当前值得验证规则
    },
    data(){
        return{
            validateMessage:"",
            validateState:''
        }
    },
    watch:{
        value:{
            handler: function (val, oldVal) {
                this.validator();
            },
            deep: true
        }
    },
    methods:{
        validator(){
            return new Promise((resolve, reject) => {
                let validate = new AsyncValidator({[this.prop]:this.rule?this.rule:{}});
                validate.validate({[this.prop]:this.row[this.prop]}, { firstFields: true }, (errors, fields) => {
                    this.validateState = !errors ? 'success' : 'error';
                    this.validateMessage = errors ? errors[0].message : '';
                    this.$emit('message',this.validateMessage);
                    this.$set(this.column,'message',this.validateMessage);
                    resolve(errors)  
                })  
            })
        },
        onFieldBlur(){
            this.validator();
        },
        onFieldChange(){
            this.validator();
        },
        handleChange(value){
            let item=this.column.options.find((op) => { return op[this.column.props.value] === value})
            this.$root.Bus.$emit('table-cell-change', {value:value,row:this.row,item})
        }
    },
    mounted(){
        this.$parent.$on('validator-'+this.rowIndex,(callback)=>{
            this.validator();
            if(this.validateState=="success"){
                callback(true);
            }else{
                callback(false);
            }
        });
        this.$parent.$on('resetValidate-'+this.rowIndex,(arr)=>{
            this.validateState="";
            this.validateMessage="";
        });
        if (this.rule) {
          this.$on('el.form.blur', this.onFieldBlur);
          this.$on('el.form.change', this.onFieldChange);
        }
    },
    created(){
    }
}
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
</style>

