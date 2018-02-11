# vue-table-row-edit
---------------------------------------------------

## 当前版本：v1.0.0
[更新日志](https://github.com/Lemonxu/vue-table-row-edit/releases)

------------------------------------------------------------------------------
###Install
```$xslt
npm install vue-table-row-edit --save
```
-------------------------------------------------------------------------------------------
### How to use
```$xslt
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueTableRowEdit from 'vue-table-row-edit'
import 'vue-table-row-edit/dist/vue-table-row-edit.min.css'

Vue.use(ElementUI)
Vue.use(VueTableRowEdit)
```
#### Table Attribute

<table><thead><tr>
<th>参数</th><th>说明</th><th>类型</th><th>可选值</th><th>默认值</th></tr></thead>
<tbody>
<tr><td>data</td><td>显示的数据</td><td>array</td><td>---</td><td>---</td></tr>
<tr><td>type</td><td>表格类型</td><td>string</td><td>---</td><td>default</td></tr>
<tr><td>rules</td><td>表单验证规则</td><td>object</td><td>---</td><td>---</td></tr>
</tbody></table>

####Table Events
<table><thead><tr>
<th>事件名</th><th>说明</th><th>参数</th></tr>
</thead><tbody>
<tr><td>success</td><td>行内验证提交事件 ,回调（callback(true(提交成功)/false（提交失败）)）</td><td>row,callback</td></tr>
<tr><td>delete</td><td>行内删除事件 ,回调（callback(true(删除成功)/false（删除失败）)）</td><td>row,callback</td></tr>
<tr><td>validator</td><td>对整个表格的数据进行校验的方法</td><td>this.$emit('validator',(validateState) => {
        console.log(validateState,'提交验证')
      })</td></tr>
<tr><td>resetValidate</td><td>对整个表格的数据进行校验重置</td><td>this.$emit('resetValidate')</td></tr>
</tbody></table>

#### TableColumn Attribute
<table><thead><tr>
<th>参数</th><th>说明</th><th>类型</th><th>可选值</th><th>默认值</th></tr></thead>
<tbody>
<tr><td>prop</td><td>对应列内容的字段名</td><td>string</td><td>---</td><td>---</td></tr>
<tr><td>propType</td><td>对应列内容的字段类型</td><td>string</td><td>---</td><td>---</td></tr>
<tr><td>label</td><td>显示的标题</td><td>string</td><td>---</td><td>---</td></tr>
<tr><td>options</td><td>当对应列为选择框时，需要传的下拉框数据</td><td>array</td><td>---</td><td>---</td></tr>
</tbody></table>

-----------------------------------------------------------------
####  Example
```
<template>
	<l-table
        :data="data"
        type="edit"
        :rules="rules"
        @success="handleSuccess"
        @delete="handleDelete"
        ref="data">
          <l-table-column
          prop="name"
          label="姓名"
          propType="input">
          </l-table-column>
          <l-table-column
          prop="sex"
          propType="select"
          label="性别"
          :options="[{label:'女',value:'女'},{label:'男',value:'男'}]"
          ></l-table-column>
          <l-table-column
          prop="age"
          propType="number"
          label="年龄">
      </l-table>
</template>

<script>
export default {
  name: 'app',
  components: {
    
  },
  data () {
    return {
      msg: '表格展示',
      data:[{id:1,name:'苏三',sex:'男',birth:'2003-01-05',hobby:'女',age:21},{id:2,name:'李四',sex:'男',birth:'2010-06-05',hobby:'唱歌',age:11}],
      selectOptions:[{name:'男',value:'男'},{name:'女',value:'女'}]
    }
  },
  methods:{
    getCode(code) {
        console.log(code)
    },
    handleAdd(){
      this.data.push({name:'',sex:'',birth:'',hobby:'',age:0,isEdit:true})
    },
    handleClick(row){
      console.log(row)
    },
    handleSuccess(row,callback){
        callback(true)
    },
    handleDelete(row,callback){
      callback(true)
    }
  }
</script>
```
