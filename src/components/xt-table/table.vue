<template>
  <div>
    <table class="table-border table__header">
      <thead>
      <tr>
        <th v-for="(head,index) in store.states.columns" :key="index" class="lemon-cell" :width="head.width||180">
          <label style="color:red">*</label>
          {{head.label}}
        </th>
        <th class="lemon-cell" v-if="operator">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,rowIndex) in data" :key="rowIndex">
        <slot :data="data" :rowIndex="rowIndex" :row="row" :rules="rules"></slot>
        <!--<td v-for="(column,columnIndex) in store.states.columns"  :key="columnIndex" class="lemon-cell" >-->
          <!--<table-row :data="data" :rowIndex="rowIndex" :row="row" :prop="column.prop" v-model="row[column.prop]" :rules="rules" :rule="rules[column.prop]" :column="column">-->
          <!--</table-row>-->
        <!--</td>-->
      </tr>
      <tr v-if="store.states.data.length===0">
        <td :colspan="store.states.columns.length+1">
          暂无数据
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import TableStore from "./table-store";
  import TableColumn from "./table-column.js";
  import TableRow from "./table-row";
  import Bus from "./bus";

  const columnStore = {}; // 在table和table-column进行交互传递
  export default {
    name: "XtTable",
    provide: {
      XtTable: columnStore
    },
    methods: {
    //  table函数
    //  像tableColumn传数据
    },
    created () {
      Object.assign(columnStore, this.store);
      console.log(this.store);
    },
    mounted () {
      // Bus.$emit("data", this.data);
      const columns = [];
      this.$children.map((child) => {
        columns.push(child.column);
      });
      this.store.states.columns = columns;
    },
    watch: {
      data: {
        immediate: true,
        handler (val, oldVal) {
          this.store.states.data = val;
        }
      }
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return [];
        }
      },

      type: {
        type: String,
        default: () =>
          "default" // edit:含有删除、完成等操作；add:含有取消操作；

      },

      rules: {
        type: Object,
        default: function () {
          return {};
        }
      },

      editOperater: Boolean, /* 是否为编辑状态 */

      add: {
        type: Boolean,
        default: () => true
      },

      operator: {
        type: Boolean,
        default: () => true
      }, // 操作列显示与否

      edit: Boolean, // 编辑不含删除、取消的编辑

      /* 删除按钮显示设置：默认显示 */
      deleteFlag: {
        type: Boolean,
        default: () => true
      },

      /* 完成按钮显示设置：默认显示 */
      successFlag: {
        type: Boolean,
        default: () => true
      },

      /* 取消按钮显示设置：默认显示 */
      cancelFlag: {
        type: Boolean,
        default: () => true
      },

      /* 编辑按钮显示设置：默认显示 */
      editFlag: {
        type: Boolean,
        default: () => true
      }
    },
    data() {
      const store = new TableStore(this, {
        data: this.data
      });
      return {
        store,
        editList: [],
        addList: [],
        validateMessage: "",
        copyOldList: []
      };
    },
    components: {
      TableColumn,
      TableRow
    }
  };
</script>
<style scoped>
  @import "css/xt-table.css";
</style>
