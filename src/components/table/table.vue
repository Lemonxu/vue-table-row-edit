<template>
    <section>
        <table class="table-border table__header">
            <thead>
                <tr>
                    <th v-for="(head,index) in store.states.columns" :key="index" class="lemon-cell">
                        <label style="color:red" v-if="isRequired(head)">*</label>
                        {{head.label}}
                    </th>
                    <th class="lemon-cell" v-if="type==='edit'">操作</th>
                </tr>
            </thead>
            <tbody>
                <slot :data="store"></slot>
                <tr v-for="(row,rowIndex) in store.states.data" :key="rowIndex" @click="handleCell(store.states,$event)">
                    <td v-for="(column,columnIndex) in store.states.columns"  :key="columnIndex" class="lemon-cell" >
                        <l-table-row :rowIndex="rowIndex" :row="row" :prop="column.prop" :isEdit="getIsEdit(rowIndex)" :rules="rules" :rule="rules[column.prop]" :column="column" >
                        </l-table-row>
                    </td>
                    <td class="lemon-cell" v-if="type==='edit'">
                        <div>
                            <button 
                            @click="handleEdit(rowIndex,row,$event)" 
                            v-if="!getIsEdit(rowIndex)" 
                            class="button--primary">编辑</button>
                            <button 
                            @click="handleDelete(rowIndex,row,$event)" 
                            v-if="!getIsEdit(rowIndex)"
                            class="button--danger">删除</button>
                            <button 
                            @click="handleSuccess(rowIndex,row,$event)" 
                            v-if="getIsEdit(rowIndex)"
                            class="button--success">完成</button>
                            <button 
                            @click="handleCancel(rowIndex,row,$event)" 
                            v-if="getIsEdit(rowIndex)"
                            class="button--danger">取消</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script>
import TableStore from './table-store'
import TableRow from './table-row.vue'

Array.prototype.remove=function(value){
    let index = this.indexOf(value);
    if(index > -1)
    this.splice(index,1)
}

const columnStore={}  //在table和table-column进行交互传递

export default {
    name:'LTable',
    provide: {
        LTable:columnStore
    },
    components:{
        'l-table-row':TableRow
    },
    props:{
        data:{
            type:Array,
            default:function(){
                return []
            }
        },
        type:{
            type:String,
            default:() => {
                return 'default'
            }
        },
        rules:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    data(){
        const store = new TableStore(this,{
            data:this.data,
        })
        return{
            store,
            editList:[],
            validateMessage:'',
        }
    },
    computed:{},
    methods:{
        isRequired(head){
            let required=false;
            let items=this.rules?this.rules[head.prop]:'';
            let headType=items?(Array.isArray(items)?'array':'object'):'';
            switch(headType){
                case 'array':
                if(items)
                    items.map((item) => {
                        if(item.required){
                            required=true;
                            return false;
                        }
                    })
                break;
                case 'object':
                if(items.required) required=true;
                break;
                default:break;
            }
            return required
        },
        getIsEdit(rowIndex){
            let editItem=this.editList.find((val) => { return val===rowIndex });
            if(typeof editItem === 'undefined'){
                return false
            }
            return true
        },
        handleSuccess(rowIndex,row,event){
            let itemStates=[];
            this.$emit('validator-'+rowIndex,(validateState) => {
                itemStates.push(validateState);
            });
            let validateState=itemStates.find((item) => { return !item });
            if(validateState==false){
            }else{
                this.$emit('success',row,(state) => {
                    if(state){
                        let editItem=this.editList.find((val) => { return val===rowIndex });
                        if(editItem!=='undefined') this.editList.remove(editItem);
                    }
                    console.log(row,'完成')
                });
            }
            event.cancelBubble=true;
        },
        handleCancel(rowIndex,row,event){
            this.$emit('resetValidate-'+rowIndex)
            let editItem=this.editList.find((val) => { return val===rowIndex });
            if(editItem!=='undefined') this.editList.remove(editItem);
        },
        handleDelete(rowIndex,row,event){
            this.$emit('delete',row,(state) => {
                if(state){
                    this.data.remove(row);
                }
                console.log(row,'删除成功')
            });
            event.cancelBubble=true;
        },
        handleEdit(rowIndex,row,event){
            let editItem=this.editList.find((val) => { return val===rowIndex });
            if(!editItem) this.editList.push(rowIndex)
        },
        //为列绑定当前行
        handleCell(column,row,event){
            this.$set(column,'value',row[column.prop]);
        }
    },
    created(){
        Object.assign(columnStore,this.store);
    },
    mounted(){
        this.$parent.$on('validator',(callback) => {
            let validatorStates=[];
            this.editList.map((editItem) => {
                let itemStates=[];
                this.$emit('validator-'+editItem,(validateState) => {
                    itemStates.push(validateState)
                })
                 let items=itemStates.find((item) => { return !item });
                 if(items==false) validatorStates.push(false);
                 else validatorStates.push(true);
            });
            let returnValidate=validatorStates.find((item) => { return !item });
            if(returnValidate==false) callback(false)
            else callback(true);
        })
        this.$parent.$on('resetValidate',(callback) => {
            this.editList.map((editItem) => {
                this.$emit('resetValidate-'+editItem)
            })
        })
    }
}
</script>

<style scoped>
.lemon-cell{
    height: 1rem;
}
table {
    border: 1px solid #ccc;
    width: 100%;
    margin:0;
    padding:0;
    border-collapse: collapse;
    border-spacing: 0;
    margin: 0 auto;
  }
   table tr {
    border: 1px solid #ddd;
    padding: 5px;
  }

  table th, table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
  }

  table th {
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 1px;
    background-color: #eef1f6;
  }
button{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-color: #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 4px;
}
.button--primary {
    color: #fff;
    background-color: #1885dd;
    border-color: #1885dd;
}
.button--warning {
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
}
.button--danger {
    color: #fff;
    background-color: #f56c6c;
    border-color: #f56c6c;
}
.button--success {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}
</style>

