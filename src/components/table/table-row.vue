<template>
    <section>
        <div  v-if="!isEdit">
            <label >{{row[prop]}}</label>
        </div>
        <div v-if="isEdit" >
            <slot :scope="row"></slot>
            <input 
            v-if="column.propType=='default'||column.propType=='input'" 
            v-model="row[prop]" 
            @change="validator"
            class="input_inline"
            :class="validateState==='error'?'error':'success'"/>
            <input 
            v-else-if="column.propType=='date'" 
            type="date" 
            v-model="row[prop]"
            class="input_inline"
            :class="validateState==='error'?'error':'success'"/>
            <el-input-number 
            v-else-if="column.propType=='number'"  
            v-model="row[prop]"
            :controls="false"
            size="mini"
            :class="validateState==='error'?'error':'success'"></el-input-number>
            <!-- <el-input 
            v-else-if="column.propType=='number'"  
            type="number"  
            v-model="row[prop]" 
            class="input_inline"
            :class="validateState==='error'?'error':'success'"></el-input> -->
            <el-select
            v-else-if="column.propType=='select'"
            v-model="row[prop]" 
            size="mini">
                <el-option
                v-for="item in column.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <br/>
            <label style="color:red;font-size:smaller">{{validateMessage}}</label>
        </div>
    </section>
</template>

<script>
import AsyncValidator from 'async-validator';


export default {
    name:'LTableRow',
    props:{
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
        },
        rule:[Array,Object],
    },
    data(){
        return{
            validateMessage:"",
            validateState:''
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

    },
    mounted(){
        this.$parent.$on('validator-'+this.rowIndex,(callback)=>{
            this.validator();
            if(this.validateState=="success"){
                callback(true);
            }else{
                callback(false);
            }
        })
        this.$parent.$on('resetValidate-'+this.rowIndex,(arr)=>{
            this.validateState="";
            this.validateMessage="";
        })
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
    border: 1px solid #adb0b5;
}
.input_inline{
    padding: 3px 10px;
    display: inline-block;
}
</style>

