<template>
  <tr @click="$emit('rowClick', row)">
    <td v-for="column in visibleColumns" :key="column.id" :style="{'text-align': column.align}">
      <table-cell
        :row="row"
        :rowIndex="rowIndex"
        :column="column"
        :tableStore="tableStore"
        :data="data"
        :rule="rules[column.prop]"
        :edit="rowEditFlag"
        :value="row[column.prop]">
      </table-cell>
    </td>
    <td v-if="operator" class="operate-td" :style="{'text-align':operatorAlign, 'width': '120px'}">
      <table-cell-slot
        :column="operateColumn"
        :row="row"
        :data="data"
        :edit="rowEditFlag"
        :tableStore="tableStore"
        type="operation"
      ></table-cell-slot>
      <el-button icon="fa fa-pencil" size="mini" title="修改" type="warning" v-if="!rowEditFlag&&editFlag&&editFlagMethod()" @click="handleEdit"></el-button>
      <el-button icon="fa fa-trash-o" size="mini" title="删除" type="danger" v-if="!rowEditFlag&&deleteFlag&&deleteFlagMethod()" @click="handleDelete"></el-button>
      <el-button icon="fa fa-check" size="mini" title="完成" type="success" v-if="rowEditFlag&&successFlag" @click="handleSubmit"></el-button>
      <el-button icon="fa fa-close" size="mini" title="取消" type="danger" v-if="rowEditFlag&&cancelFlag" @click="handleCancel"></el-button>
    </td>
  </tr>
</template>

<script>
  import TableCell from "./table-cell.vue";
  import TableCellSlot from "./table-cell-slot";

  export default {
    methods: {
      editFlagMethod() {
        if (this.rowEditMethod) {
          return this.rowEditMethod(this.row, this.edit);
        } else {
          return true;
        }
      },
      deleteFlagMethod() {
        if (this.rowDeleteMethod) {
          return this.rowDeleteMethod(this.row, this.edit);
        } else {
          return true;
        }
      },
      // 点击编辑事件
      handleEdit() {
        this.$emit("edit", this.row, this.rowIndex, this.tableRow._id, this.tableRow.editFlag);
      },
      // 取消编辑
      handleCancel() {
        this.$emit("resetFields");
        this.$emit("cancel");
      },
      // 提交事件
      handleSubmit() {
        const itemStates = [];
        this.$emit("validate", (validateState) => {
          // 验证
          itemStates.push(validateState);
        });
        const validateState = itemStates.find((item) => !item);
        if (validateState === false) {
          //  验证未通过
          // console.error("验证未通过");
        } else {
          this.$emit("submit", this.row, this.rowIndex, this.tableRow._id, (status) => {
            //  提交成功或者提交失败
            if (status) {
              //  提交成功
            }
          });
        }
      },
      //删除事件
      handleDelete() {
        this.$emit("delete", this.row, this.rowIndex, this.tableRow._id, (status) => {
          //  删除成功或者删除失败
          // console.log(status);
        });
      },
      validate(callback) {
        this.$emit("validate", (validateState) => {
          callback(validateState);
          // console.log(validateState, "行验证");
        });
      },
      resetFields() {
        this.$emit("resetFields");
      }
    },
    mounted() {
      //  mounted
    },
    components: {
      TableCell,
      TableCellSlot
    },
    computed: {
      visibleColumns() {
        return this.columns.filter((column) => !column.hidden && column.type !== "operate");
      },
      operateColumn() {
        const operateColumn = this.columns.find((column) => !column.hidden && column.type === "operate");
        if (operateColumn) {
          return operateColumn;
        } else {
          return {};
        }
      },
      rowEditFlag: {
        get() {
          return this.tableRowEdit;
        },
        set() {
          //  edit状态修改
        }
      }
    },
    data() {
      return {
        edit: false
      };
    },
    watch: {
      // 检测
    },
    props: {
      columns: {
        type: Array,
        default() {
          return [];
        }
      },
      data: Array,
      row: {
        type: Object
      },
      rules: {
        type: Object,
        default() {
          return {};
        }
      },
      tableRowEdit: {
        type: Boolean,
        default() {
          return false;
        }
      },
      rowIndex: Number,
      //操作列显示与否
      operator: Boolean,
      // 删除按钮显示设置：默认显示
      deleteFlag: Boolean,
      // 完成按钮显示设置：默认显示
      successFlag: Boolean,
      // 取消按钮显示设置：默认显示
      cancelFlag: Boolean,
      // 编辑按钮显示设置：默认显示
      editFlag: Boolean,
      tableStore: Object,
      operatorWidth: {
        type: [Number, String],
        default: () => 80
      },
      operatorAlign: {
        type: String,
        default: () => "center"
      },
      tableRow: {
        type: Object,
        default: () => ({})
      },
      rowEditMethod: Function,
      rowDeleteMethod: Function
    }
  };
</script>

<style scoped>
  @import "css/xt-table.css";
  .operate-td{
    padding: 8px;
  }
</style>
