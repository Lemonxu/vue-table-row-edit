<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <!--<el-button size="mini" type="primary" @click="handleAdd" style="float: left">新增</el-button>-->
    <xt-table ref="xtTable" :data="data" border :rules="rules" @success="submitData" @delete="deleteData" @add="handleAdd" @edit="handleEdit">
      <xt-table-column prop="index" label="序号">
        <template slot-scope="scope" type="expand">
          {{scope.$index}}
        </template>
      </xt-table-column>
      <xt-table-column prop="name" label="姓名" :edit="true">
      </xt-table-column>
      <xt-table-column prop="sex" label="性别"
                            :edit="true"
                            propType="input"
                            :options="selectOptions">
        <template slot-scope="scope" type="expand">
          <el-input v-model="scope.row.sex" size="mini"></el-input>
          <!--<el-input ></el-input>-->
        </template>
      </xt-table-column>
      <xt-table-column
        prop="birth"
        label="出生年月"
        :edit="true"
        propType="dateTimePicker">
      </xt-table-column>
      <xt-table-column prop="age" label="年龄" propType="inputNumber">
      </xt-table-column>
      <xt-table-column prop="hobby" label="爱好" @change="hobbyChange">
      </xt-table-column>
      <xt-table-column label="操作" type="operate">
        <template slot-scope="scope">
          <!--<el-button size="mini" type="primary" @click="handlePrint(scope.row)">打印</el-button>-->
        </template>
      </xt-table-column>
    </xt-table>

    <el-button size="mini" type="primary" @click="handleSuccess">总提交</el-button>
    <el-button size="mini" type="danger" @click="handleCancel">总取消</el-button>


    <!--<el-table-->
      <!--:data="tableData"-->
      <!--ref="elTable"-->
      <!--style="width: 100%">-->
      <!--<el-table-column-->
        <!--prop="date"-->
        <!--label="日期"-->
        <!--width="180">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="name"-->
        <!--label="姓名"-->
        <!--width="180">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="address"-->
        <!--label="地址">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="index" label="序号">-->
        <!--<template slot-scope="scope" type="expand">-->
          <!--{{scope.$index}}-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
    <!--<table-component-->
      <!--:data="[-->
          <!--{ firstName: 'John', lastName: 'Lennon', instrument: 'Guitar', birthday: '04/10/1940', songs: 72 },-->
          <!--{ firstName: 'Paul', lastName: 'McCartney', instrument: 'Bass', birthday: '18/06/1942', songs: 70 },-->
          <!--{ firstName: 'George', lastName: 'Harrison', instrument: 'Guitar', birthday: '25/02/1943', songs: 22 },-->
          <!--{ firstName: 'Ringo', lastName: 'Starr', instrument: 'Drums', birthday: '07/07/1940', songs: 2 },-->
     <!--]">-->
      <!--<table-column show="firstName" label="名字"></table-column>-->
      <!--<table-column show="lastName" label="Last name"></table-column>-->
      <!--<table-column show="instrument" label="Instrument"></table-column>-->
      <!--<table-column show="songs" label="Songs" data-type="numeric"></table-column>-->
      <!--<table-column show="birthday" label="Birthday" data-type="date:DD/MM/YYYY">-->
        <!--<template slot-scope="row">-->
         <!--ceshi-->
          <!--<el-input v-model="row.firstName"></el-input>-->
        <!--</template>-->
      <!--</table-column>-->
      <!--<table-column label="" :sortable="false" :filterable="false">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag>标签一</el-tag>-->
          <!--<a :href="`#${scope.firstName}`">Edit</a>-->
        <!--</template>-->
      <!--</table-column>-->
    <!--</table-component>-->

  </div>
</template>

<script>

  Array.prototype.remove = function(value) {
    const index = this.indexOf(value);
    if (index > -1) {this.splice(index, 1);}
  };
  export default {
    name: "app",
    methods: {
      handleEdit(row, callback) {
        console.log(111);
        setTimeout(() => {
          row.name = "测试员";
          // callback();
        }, 300);
      },
      hobbyChange(value, row, item) {
        console.log(value, row, item, "爱好change事件");
      },
      handlePrint(row) {
        console.log(row, "打印");
      },
      submitData(row, callback) {
        console.log(row, "提交成功");
        callback(true);
      },
      deleteData(row, callback) {
        // this.data.remove(row);
        console.log("删除成功");
        callback(false);
      },
      handleAdd (callback) {
        this.data.push({name: "", sex: "", birth: "", hobby: "", age: 0});
        callback();
      },
      handleClick (row) {
        console.log(row);
      },
      handleSuccess () {
        this.$refs.xtTable && this.$refs.xtTable.validator((validate) => {
          console.log(validate, "总验证");
        });
      },
      handleCancel() {
        this.$refs.xtTable && this.$refs.xtTable.resetFields();
      },
      handleDelete (row, callback) {
        callback(false);
      }
    },
    created() {
      console.log(this.$refs.elTable);
    },
    mounted() {
      console.log(this.$refs.elTable);
    },
    data () {
      return {
        msg: "表格展示",
        data: [
          {id: 1, name: "苏三", sex: "男", birth: "2003-01-05", hobby: "女", age: 21},
          {id: 2, name: "李四1", sex: "男1", birth: "2010-06-05", hobby: "唱歌", age: 11},
          {id: 2, name: "", sex: "", birth: "2010-06-05", hobby: "唱歌", age: 11},
          {id: 2, name: "李四2", sex: "男2", birth: "2010-06-05", hobby: "唱歌", age: 11},
          {id: 2, name: "李四3", sex: "男3", birth: "2010-06-05", hobby: "唱歌", age: 11}],
        selectOptions: [{name: "男", value: "男"}, {name: "女", value: "女"}],
        rules: {
          name: [{required: true, message: "请输入姓名", trigger: "change"}],
          sex: [{required: true, message: "请输入性别", trigger: "change"}]
        },
        tableData: [{
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }, {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        }, {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        }, {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }]
      };
    },
    watch: {
      data: {
        deep: true,
        handler(val) {
          // console.log(val, 963);
        }
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
