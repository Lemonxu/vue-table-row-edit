<template>
    <section>
        <slot></slot>
    </section>
</template>

<script>
import TableStore from './table-store'

export default {
    name:'LTableColumn',
    inject: ['LTable'],
    props:{
        label:{
            type:String,
            default:() => {
                return ""
            },
        },
        prop:[String],
        type:{
            type:String,
            default:() => {
                return 'default'
            }
        },
        propType:{
            type:String,
            default:() => {
                return 'default'
            }
        },
        options:{
            type:Array,
            default:() => {
                return []
            }
        },
        props: {
            default() {
                return {
                    label: 'label',
                    value:'id',
                    labelProp:false
                };
            }
        },
        filterable:Boolean,
        onlyShow:Boolean,
        clearable:Boolean
    },
    data(){
        const column={
            label:this.label,
            prop:this.prop,
            type:this.type,
            propType:this.propType,
            options:this.options,
            props:this.props,
            filterable:this.filterable,
            onlyShow:this.onlyShow,
            clearable:this.clearable
        };
        return{
            column
        }
    },
    watch:{
        options:{
            immediate: true,
            handler(val,oldVal) {
                this.column.options=val;
            }
        },
        LTable:{
            immediate: true,
            handler(val,oldVal) {
            }
        }
    },
    methods:{
    },
    created(){
        // this.LTable.states.columns.push(this.column); //更改为在table里面获取本页面的信息并且存入states.columns
        //监控table-row中选择框value值改变事件
        this.$root.Bus.$on('table-cell-change', ({value,row,item}) => {
            this.$emit('change',value,row,item);
        })
    },
    mounted(){
    }
}
</script>

