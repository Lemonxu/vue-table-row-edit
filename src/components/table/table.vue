<template>
    <section>
        <button v-if="add" size="mini" type="primary" icon="el-icon-plus" @click="handleAdd" class="button--primary">新增</button>
        <table class="table-border table__header">
            <thead>
                <tr>
                    <th v-for="(head,index) in store.states.columns" :key="index" class="lemon-cell" style="width:180px">
                        <label style="color:red" v-if="isRequired(head)">*</label>
                        {{head.label}}
                    </th>
                    <th class="lemon-cell" style="width:150px;min-width:150px">操作</th>
                </tr>
            </thead>
            <tbody>
                <slot :data="store" ></slot>
                <tr v-for="(row,rowIndex) in data" :key="rowIndex" @click="handleCell(store.states,$event)" >
                    <td v-for="(column,columnIndex) in store.states.columns"  :key="columnIndex" class="lemon-cell" >
                        <l-table-row :rowIndex="rowIndex" :row="row" :prop="column.prop" v-model="row[column.prop]" :isEdit="getIsEdit(rowIndex)" :rules="rules" :rule="rules[column.prop]" :column="column">
                        </l-table-row>
                    </td>
                    <td class="lemon-cell" >
                        <div v-if="editOperater">
                            <button 
                            @click="handleEdit(rowIndex,row,$event)" 
                            v-if="!getIsEdit(rowIndex)" 
                            class="button--primary">修改</button>
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
                        <div v-else>
                            <button 
                            @click="handleAddCancel(rowIndex,row,$event)" 
                            v-if="getIsEdit(rowIndex)"
                            class="button--danger">取消</button>
                        </div>
                    </td>
                </tr>
                <tr v-if="store.states.data.length==0">
                    <td :colspan="store.states.columns.length+1">
                        暂无数据
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
        },
        editOperater:Boolean,
        add:{
            type:Boolean,
            default:() => {
                return true
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
            addList:[],
            validateMessage:'',
            copyOldList:[]
        }
    },
    watch:{
        data: {
            immediate: true,
            handler(val,oldVal) {
                this.store.states.data=val;
                this.editList=[];
            }
        },
    },
    computed:{
    },
    methods:{
        getTypeList(){
            if(this.type=="add"){
                return this.addList;
            }else if(this.type=="edit"){
                return this.editList;
            }else{
                return [...this.addList,...this.editList];
            }
        },
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
            let item=this.getTypeList().find((val) => { return val===rowIndex });
            if(typeof item === 'undefined'){
                return false
            }
            return true
        },
        //单行提交事件
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
                        let addItem=this.addList.find((val) => { return val===rowIndex });
                        if(addItem!=='undefined') this.addList.remove(addItem);
                        let copyOldItem=this.copyOldList.find((val) => { return val.id===rowIndex });
                        if(copyOldItem){ this.copyOldList.remove(copyOldItem); }
                    }
                });
            }
            event.cancelBubble=true;
        },
        //行内取消事件
        handleCancel(rowIndex,row,event){
            this.$emit('resetValidate-'+rowIndex)
            let editItem=this.editList.find((val) => { return val===rowIndex });
            if(editItem||editItem==0){
                let copyOldItem=this.copyOldList.find((val) => { return val.id===rowIndex });
                if(copyOldItem){
                    Object.assign(row,copyOldItem.row);
                    this.copyOldList.remove(copyOldItem);
                    this.editList.remove(editItem);
                }
            }else{
                let addItem=this.addList.find((val) => { return val===rowIndex });
                if(addItem||addItem==0){
                    this.data.remove(row);
                    this.addList.remove(this.addList[this.addList.length-1]);
                } 
            }
        },
        //新增行内取消事件
        handleAddCancel(rowIndex,row,event){
            let addItem=this.addList.find((val) => { return val===rowIndex });
            if(addItem!=='undefined'){
                this.data.remove(row);
                this.addList.remove(this.addList[this.addList.length-1]);
            } 
        },
        //行内删除事件
        handleDelete(rowIndex,row,event){
            this.$emit('delete',row,(state) => {
                if(state){
                    this.data.remove(row);
                }
            });
            event.cancelBubble=true;
        },
        //行内编辑事件
        handleEdit(rowIndex,row,event){
            let editItem=this.editList.find((val) => { return val===rowIndex });
            if(!editItem) this.editList.push(rowIndex);
            let copyOldItem=this.copyOldList.find((val) => { return val.id===rowIndex });
            if(!copyOldItem) this.copyOldList.push({id:rowIndex,row:JSON.parse(JSON.stringify(row))});
        },
        //为列绑定当前行
        handleCell(column,row,event){
            this.$set(column,'value',row[column.prop]);
        },
        //表添加事件
        handleAdd(){
            this.$emit('add',(item) => {
                let rowIndex=this.editOperater?this.store.states.data.length-1:this.store.states.data.length;
                let addItem=this.addList.find((val) => { return val===rowIndex });
                if(!addItem) this.addList.push(rowIndex)
            })
        },
        //全部行验证事件
        validate(callback){
            let validatorStates=[];
            this.getTypeList().map((editItem) => {
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
        },
        //全部行验证重置事件
        resetFields(callback){
            let itemList=[];
            this.getTypeList().map((editItem) => {
                this.$emit('resetValidate-'+editItem)
            })
        }
    },
    created(){
        Object.assign(columnStore,this.store);
    },
    mounted(){
        let columns=[];
        this.$children.map((child) => {
            columns.push(child.column);
        })
        this.store.states.columns=columns;
        // this.$parent.$on('validator',(callback) => {
        //     let validatorStates=[];
        //     this.editList.map((editItem) => {
        //         let itemStates=[];
        //         this.$emit('validator-'+editItem,(validateState) => {
        //             itemStates.push(validateState)
        //         })
        //          let items=itemStates.find((item) => { return !item });
        //          if(items==false) validatorStates.push(false);
        //          else validatorStates.push(true);
        //     });
        //     let returnValidate=validatorStates.find((item) => { return !item });
        //     if(returnValidate==false) callback(false)
        //     else callback(true);
        // })
        // this.$parent.$on('resetValidate',(callback) => {
        //     this.editList.map((editItem) => {
        //         this.$emit('resetValidate-'+editItem)
        //     })
        // })
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

