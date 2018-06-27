<template>
  <div>
    <el-button icon="fa fa-plus" size="mini" style="float: left" type="primary" v-if="add" @click="handleAdd">&nbsp;新增</el-button>
    <table class="table-border table__header">
      <thead>
      <tr>
        <th v-for="(head,index) in headColumns" :key="index" class="lemon-cell" :width="head.width||180" :style="columnStyle(head)">
          <label style="color:red" v-if="isRequired(head)">*</label>
          {{head.label}}
        </th>
        <th class="lemon-cell" v-if="operator" :style="`width:${operator?80:auto}px;min-width:${operator?80:auto}px`">操作</th>
      </tr>
      </thead>
      <tbody>
      <table-row
        ref="tableRow"
        v-for="(tableRow,index) in tableData"
        :key="index"
        :row="tableRow.row"
        :rowIndex="index"
        :columns="columns"
        :data="data"
        :rules="rules"
        :operator="operator"
        :deleteFlag="deleteFlag"
        :cancelFlag="cancelFlag"
        :editFlag="editFlag"
        :successFlag="successFlag"
        :tableRowEdit="isRowEdit(tableRow,index)"
        @submit="handleSubmit"
        @delete="handleDelete"
        @cancel="handleCancel(tableRow.row,index)"
        @edit="handleEdit(tableRow.row,index)"
      ></table-row>
      <tr v-if="tableData.length===0">
        <td :colspan="headColumns.length+1">
          暂无数据
        </td>
      </tr>
      </tbody>
    </table>

    <div style="display:none;">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import Column from "./utils/column";
  import TableRow from "./table-row";
  import ElementUI from "element-ui";
  import Vue from "vue";

  Vue.use(ElementUI);

  const columnStore = {}; // 在table和table-column进行交互传递
  export default {
    name: "XtTable",
    provide: {
      XtTable: columnStore
    },
    methods: {
      columnStyle(column) {
        return `width:${column.width || 80}px;min-width:${column.minWidth || 80};max-width:${column.maxWidth || 80}px`;
      },
      //整个table验证重置
      resetFields() {
        this.$refs.tableRow && this.$refs.tableRow.map((tableRowItem) => {
          tableRowItem.resetFields && tableRowItem.resetFields();
        });
      },
      //整个table验证
      validate(callback) {
        const validatorStates = [];
        this.$refs.tableRow && this.$refs.tableRow.map((tableRowItem) => {
          tableRowItem.validate && tableRowItem.validate((validatorState) => {
            validatorStates.push(validatorState);
          });
        });
        const returnValidate = validatorStates.includes(false);
        if (returnValidate) {callback(false);} else {callback(true);}
      },
      // 是否需要验证头部标记
      isRequired(head) {
        let required = false;
        if (!head) {return false;}
        const items = this.rules ? this.rules[head.prop] : "";
        const headType = items ? (Array.isArray(items) ? "array" : "object") : "";
        switch (headType) {
          case "array":
            if (items) {
              items.map((item) => {
                if (item.required) {
                  required = true;
                  return false;
                }
              });
            }
            break;
          case "object":
            if (items.required) {required = true;}
            break;
          default:break;
        }
        return required;
      },
      //判断该行是否为编辑中
      isRowEdit(tableRow, rowIndex) {
        return tableRow.rowConfig.edit;
      },
      //设置该行是否可编辑
      setRowIndex(rowIndex, subtractFlag = true) {
        const isAddFlag = this.adds.includes(rowIndex), isEditFlag = this.edits.includes(rowIndex);
        if (isAddFlag) {
          this.adds.remove(rowIndex);
        }
        if (isEditFlag) {
          this.edits.remove(rowIndex);
        }
        const newAdds = [];
        this.adds.map((addIndex) => {
          if (addIndex > rowIndex && subtractFlag) {
            addIndex = addIndex - 1;
          }
          newAdds.push(addIndex);
        });
        this.adds = newAdds;
        const newEdits = [];
        this.edits.map((editIndex) => {
          if (editIndex >= rowIndex && subtractFlag) {
            editIndex = editIndex - 1;
          }
          newEdits.push(editIndex);
        });
        this.edits = newEdits;
      },

      //新增事件
      handleAdd() {
        this.adds.push(this.data.length);
        this.$emit("add", () => {
        //  新增回调事件
        });
      },
      handleCancel(row, rowIndex) {
        const isAddFlag = this.adds.includes(rowIndex);
        if (isAddFlag) {
          this.data.remove(row);
          this.setRowIndex(rowIndex);
        } else {
          this.setRowIndex(rowIndex, false);
        }
        // 赋值取消前的数据
        const copyOldItem = this.copyOldList.find((val) => val.id === rowIndex);
        if (copyOldItem) {
          Object.assign(row, copyOldItem.row);
          this.copyOldList.remove(copyOldItem);
        }
      },
      // 删除事件
      handleDelete(row, rowIndex, callback) {
        this.$emit("delete", row, (status) => {
          if (status) {
            this.data.remove(row);
            this.setRowIndex(rowIndex);
            this.resetFields();
          }
          callback(status);
        });
      },
      handleEdit(row, rowIndex) {
        const edit = () => {
          const editFlag = this.edits.includes(rowIndex);
          if (!editFlag) {
            this.edits.push(rowIndex);
          }
          // 备份编辑前的数据
          const copyOldItem = this.copyOldList.find((val) => val.id === rowIndex);
          if (copyOldItem) {
            this.copyOldList.remove(copyOldItem);
            this.copyOldList.push({id: rowIndex, row: JSON.parse(JSON.stringify(row))});
          } else {
            this.copyOldList.push({id: rowIndex, row: JSON.parse(JSON.stringify(row))});
          }
        };
        edit();
        this.$emit("edit", row, () => {
          edit();
        });
      },
      //提交事件
      handleSubmit(row, rowIndex, callback) {
        this.$emit("success", row, (status) => {
          if (status) {
            this.setRowIndex(rowIndex, false);
            const copyOldItem = this.copyOldList.find((val) => val.id === rowIndex);
            if (copyOldItem) {this.copyOldList.remove(copyOldItem);}
          }
          callback(status);
        });
      }
    },
    created () {
    //  创建完成
    },
    async mounted() {
      //列属性搜集
      const columnComponents = this.$slots.default
        .filter((column) => column.componentInstance)
        .map((column) => column.componentInstance);

      this.columns = columnComponents.map((column) => new Column(column));

      columnComponents.forEach((columnCom) => {
        Object.keys(columnCom.$options.props).forEach((prop) =>
          columnCom.$watch(prop, () => {
            this.columns = columnComponents.map((column) => new Column(column));
          })
        );
      });
    },
    watch: {
    //  检测事件
    },
    computed: {
      //显示需要显示的表头
      headColumns() {
        return this.columns.filter((column) => !column.hidden && column.type !== "operate");
      },
      tableData: {
        get() {
          return this.data.map((item, index) => {
            const isAddFlag = this.adds.includes(index);
            const isEditFlag = this.edits.includes(index);
            return {row: item, rowConfig: {edit: this.type === "add" || isAddFlag || isEditFlag}};
          });
        },
        set() {
        //  设置
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
      rules: {
        type: Object,
        default: function () {
          return {};
        }
      },
      type: {
        type: String,
        default: () =>
          "default" //edit:含有删除、完成等操作；add:含有取消操作；
      },
      add: {
        type: Boolean,
        default: () => true
      },
      //操作列显示与否
      operator: {
        type: Boolean,
        default: () => true
      },
      // 删除按钮显示设置：默认显示
      deleteFlag: {
        type: Boolean,
        default: () => true
      },
      // 完成按钮显示设置：默认显示
      successFlag: {
        type: Boolean,
        default: () => true
      },
      // 取消按钮显示设置：默认显示
      cancelFlag: {
        type: Boolean,
        default: () => true
      },
      // 编辑按钮显示设置：默认显示
      editFlag: {
        type: Boolean,
        default: () => true
      }
    },
    data() {
      return {
        columns: [],
        rows: [],
        adds: [],
        edits: [],
        filter: "",
        sort: {
          fieldName: "",
          order: ""
        },
        pagination: null,
        localSettings: {},
        copyOldList: []
      };
    },
    components: {
      TableRow
    }
  };
</script>
<style scoped>
  @import "css/xt-table.css";
</style>
