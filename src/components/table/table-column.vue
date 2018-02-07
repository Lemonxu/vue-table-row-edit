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
        }
    },
    data(){
        const column={
            label:this.label,
            prop:this.prop,
            type:this.type,
            propType:this.propType,
            options:this.options
        };
        return{
            column
        }
    },
    methods:{
    },
    created(){
        this.LTable.states.columns.push(this.column)
    }
}
</script>

