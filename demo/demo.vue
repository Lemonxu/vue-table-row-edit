<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <xt-table :data="data" border>
      <xt-table-column prop="name" label="姓名" :edit="true">
      </xt-table-column>
      <xt-table-column prop="sex" label="性别"
                            :edit="true"
                            propType="select"
                            :options="selectOptions">
      </xt-table-column>
      <xt-table-column
        prop="birth"
        label="出生年月"
        :edit="true"
        propType="dateTimePicker">
      </xt-table-column>
      <xt-table-column prop="age" label="年龄" :edit="true" propType="inputNumber">
      </xt-table-column>
      <xt-table-column prop="hobby" label="爱好" >
      </xt-table-column>
    </xt-table>
    <!-- <vue-flag-list height="30" width="120" @getCode="getCode"></vue-flag-list> -->

  </div>
</template>

<script>
  export default {
    name: "app",
    components: {},
    data () {
      return {
        msg: "表格展示",
        data: [
          {id: 1, name: "苏三", sex: "男", birth: "2003-01-05", hobby: "女", age: 21},
          {id: 2, name: "李四", sex: "男", birth: "2010-06-05", hobby: "唱歌", age: 11},
          {id: 2, name: "李四", sex: "男", birth: "2010-06-05", hobby: "唱歌", age: 11}],
        selectOptions: [{name: "男", value: "男"}, {name: "女", value: "女"}]
      };
    },
    methods: {
      getCode (code) {
        console.log(code);
      },
      handleAdd (code = 9) {
        this.data.push({name: "", sex: "", birth: "", hobby: "", age: 0, isEdit: true});
      },
      handleClick (row) {
        console.log(row);
      },
      handleSuccess (row, callback) {
        callback(true);
      },
      handleDelete (row, callback) {
        callback(true);
      }
    }
  };
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
