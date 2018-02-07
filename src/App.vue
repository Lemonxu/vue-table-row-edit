<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <el-button type="primary" @click="handleAdd">新增行</el-button>
    <el-table :data="data" border>
        <el-table-column-edit prop="name" label="姓名" :edit="true">
        </el-table-column-edit>
        <el-table-column-edit prop="sex" label="性别"
        :edit="true"
        propType="select"
        :options="selectOptions">
        </el-table-column-edit>
        <el-table-column-edit 
        prop="birth" 
        label="出生年月" 
        :edit="true" 
        propType="dateTimePicker">
        </el-table-column-edit>
        <el-table-column-edit prop="age" label="年龄" :edit="true" propType="inputNumber">
        </el-table-column-edit>
        <el-table-column-edit prop="hobby" label="爱好" >
        </el-table-column-edit>
        <el-table-column-edit label="操作"
        type="edit"
        @success="handleSuccess"
        @delete="handleDelete">
        </el-table-column-edit>
    </el-table>
    <!-- <vue-flag-list height="30" width="120" @getCode="getCode"></vue-flag-list> -->

  </div>
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
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
