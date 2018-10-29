<template>
  <div class="xt-table">
    <el-button icon="fa fa-plus" size="mini" style="float: left" type="primary" v-if="add" @click="handleAdd">&nbsp;{{addLabel}}</el-button>
    <table class="table-border table__header" ref="table">
      <thead>
      <tr>
        <th v-for="(head,index) in headColumns" :key="index" class="lemon-cell" :style="columnStyle(head)">
          <label style="color:red" v-if="isRequired(head)">*</label>
          {{head.label}}
        </th>
        <th ref="operator" class="lemon-cell" v-if="operator" :style="getOperateStyle()">操作</th>
      </tr>
      </thead>
      <tbody>
      <table-row
        ref="tableRow"
        v-for="(tableRow,index) in tableData"
        :getKey="getTableKey(tableRow, index)"
        :key="tableRow._id"
        :row="tableRow.row"
        :rowIndex="index"
        :columns="columns"
        :class="[
        {'table-row-highlight': highlightCurrentRow && currentRow.currentRowIndex === index}
        ]"
        :tableStore="tableStore"
        :data="data"
        :rules="rules"
        :operator="operator"
        :deleteFlag="deleteFlag"
        :cancelFlag="cancelFlag"
        :editFlag="editFlag"
        :successFlag="successFlag"
        :operatorWidth="operatorWidth"
        :operatorAlign="operatorAlign"
        :tableRowEdit="isRowEdit(tableRow,index,tableRow._id)"
        :tableRow="tableRow"
        :rowEditMethod="rowEditMethod"
        :rowDeleteMethod="rowDeleteMethod"
        @submit="handleSubmit"
        @delete="handleDelete"
        @cancel="handleCancel(tableRow.row,index,tableRow._id)"
        @edit="handleEdit"
        @click.native="handleRowClick(tableRow.row, tableRow, index, tableRow._id)"
      ></table-row>
      <tr v-if="tableData.length===0">
        <td :colspan="headColumns.length+1" style="text-align: center">
          {{ emptyText || "暂无数据" }}
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
  import {parseWidth, parseMinWidth, columnStyle, requiredStyle} from "./utils/helpers";
  import {addResizeListener, removeResizeListener} from "./utils/resize-event";
  import ResizeObserver from "resize-observer-polyfill";
  import Bus from "./bus";

  Vue.use(ElementUI);

  export default {
    name: "XtTable",
    methods: {
      getTableKey(tableRow, index) {
        const exitKey = this.tableKeys.find((item) => item.index === index);
        if (!exitKey) {
          this.tableKeys.push({index: index, _id: tableRow._id});
        }
        return true;
      },
      //列基础宽度样式___表头列宽度
      columnStyle(column) {
        return columnStyle(column, this.headerAlign);
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
        return requiredStyle(head, this.rules);
      },
      //判断该行是否为编辑中
      isRowEdit(tableRow, rowIndex) {
        return tableRow.rowConfig.edit;
      },
      //设置该行是否可编辑
      setRowIndex(rowIndex, rowId, subtractFlag = true) {
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
          const exitNewAddsItem = newAdds.find((key) => key === addIndex);
          if (!exitNewAddsItem) {
            newAdds.push(addIndex);
          }
        });
        this.adds = newAdds;
        const newEdits = [];
        this.edits.map((editIndex) => {
          if (editIndex >= rowIndex && subtractFlag) {
            editIndex = editIndex - 1;
          }
          const exitNewEditItem = newEdits.find((key) => key === editIndex);
          if (!exitNewEditItem) {
            newEdits.push(editIndex);
          }
        });
        this.edits = newEdits;
        //删除已取消的id
        const exitKey = this.tableKeys.find((keyItem) => keyItem.index === rowIndex || rowId === keyItem._id);
        if (exitKey) {
          this.tableKeys.remove(exitKey);
          this.tableKeys.map((keyItem) => {
            if (keyItem.index >= exitKey.index && keyItem.index !== 0) {
              keyItem.index = keyItem.index - 1;
            }
          });
        }
      },
      async reverseKeys() {
        const edits = [], adds = [];
         await this.edits.map((editKey) => {
          editKey = parseInt(editKey, 10) + 1;
          edits.push(editKey);
        });
        await this.adds.map((addKey) => {
          addKey = parseInt(addKey, 10) + 1;
          adds.push(addKey);
        });
        this.edits = edits;
        this.adds = adds;
        return true;
      },
      //新增事件
      handleAdd() {
        if (this.reverse) {
          this.reverseKeys().then(() => {
            this.adds.push(0);
          });
        } else {
          this.adds.push(this.data.length);
        }
        this.$emit("add", () => {
          //  新增回调事件
        }, this.data);
      },
      //取消事件
      handleCancel(row, rowIndex, rowId) {
        const isAddFlag = this.adds.includes(rowIndex);
        if (isAddFlag || this.type === "add") {
          this.data.remove(row);
          this.setRowIndex(rowIndex, rowId);
        } else {
          this.setRowIndex(rowIndex, rowId, false);
        }
        // 赋值取消前的数据
        const copyOldItem = this.copyOldList.find((val) => val.id === rowIndex);
        if (copyOldItem) {
          Object.assign(row, copyOldItem.row);
          this.copyOldList.remove(copyOldItem);
        }
      },
      // 删除事件
      handleDelete(row, rowIndex, rowId, callback) {
        this.$emit("delete", row, (status) => {
          if (status) {
            this.data.remove(row);
            this.setRowIndex(rowIndex, rowId);
            this.resetFields();
          }
          callback(status);
        });
      },
      //编辑事件
      handleEdit(row, rowIndex, rowId, editFlag) {
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
        }, editFlag);
      },
      //提交事件
      handleSubmit(row, rowIndex, rowId, callback) {
        this.$emit("success", row, (status) => {
          if (status) {
            this.setRowIndex(rowIndex, false);
            const copyOldItem = this.copyOldList.find((val) => val.id === rowIndex);
            if (copyOldItem) {this.copyOldList.remove(copyOldItem);}
          }
          callback(status);
        });
      },
      //点击行事件
      handleRowClick(row, tableRow, rowIndex, rowId) {
        this.currentRow = {currentRowIndex: rowIndex, row: row, edit: this.isRowEdit(tableRow, rowIndex), rowId: rowId};
        this.$emit("row-click", row, rowIndex, tableRow);
      },
      //获取操作列宽度
      getOperateStyle() {
        const defaultButtons = [this.editFlag, this.successFlag, this.deleteFlag, this.cancelFlag];
        const buttonLength = defaultButtons.filter((item) => item).length;
        let operateStyle = `text-align:${this.operatorAlign};min-width:${buttonLength * 45}px;width:${buttonLength * 45}px`;
        if (parseWidth(this.operatorWidth)) {
          operateStyle = `text-align:${this.operatorAlign};width:${parseWidth(this.operatorWidth)}px;min-width:${parseWidth(this.operatorWidth)}px;max-width:${parseWidth(this.operatorWidth)}px`;
        } else {
          const operateItem = this.columns.find((column) => !column.hidden && column.type === "operate");
          if (operateItem) {
            operateStyle = `text-align:${this.operatorAlign};min-width:${parseMinWidth(operateItem.minWidth || buttonLength * 45)}px;width:${parseWidth(operateItem.width || buttonLength * 45)}px;max-width:${operateItem.maxWidth || "auto"}`;
          }
        }
        return operateStyle;
      },
      bindEvents() {
        addResizeListener(this.$el, this.resizeListener);
      },
      //根据浏览器大小变化进行变化
      resizeListener() {
        this.tableStore.table = this;
        this.calColumns();
      },
      //计算列宽度
      calColumns() {
        // 计算已经用户设置的宽度
        const el = this.$el, widths = [];
        let calWidth = 0;
        this.columns.map((column) => {
          if (parseFloat(column.width) || parseFloat(column.maxWidth)) {
            widths.push(column.width || column.maxWidth);
          }
        });
        const totalWidth = widths.reduce((prev, curr, idx, arr) => parseFloat(prev) + parseFloat(curr), 0), operatorOffsetWidth = this.$refs.operator ? this.$refs.operator.offsetWidth : 0;
        if (this.columns.length - widths.length > 0) {
          calWidth = (el.offsetWidth - totalWidth - operatorOffsetWidth) / (this.columns.length - widths.length);
          this.columns.map((column) => {
            if (!column.width) {
              this.$set(column, "newWidth", calWidth);
            }
          });
        }
      }
    },
    created () {
      //  创建完成
    },
    async mounted() {
      // this.resizeListener();
      this.bindEvents();
      //列属性搜集
      const columnComponents = this.$slots.default
        .filter((column) => column.componentInstance)
        .map((column) => column.componentInstance);

      this.columns = columnComponents.map((column) => new Column(column));

      columnComponents.forEach((columnCom) => {
        Object.keys(columnCom.$options.props).forEach((prop) =>
          columnCom.$watch(prop, () => {
            this.columns = columnComponents.map((column) => new Column(column));
            this.calColumns();
          })
        );
      });
    },
    //销毁监听组件
    destroyed() {
      if (this.resizeListener) {removeResizeListener(this.$el, this.resizeListener);}
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
            const keyItem = {index: index, _id: Math.random()};
            const keys = this.tableKeys.find((key) => key.index === index);
            if (keys) {
              keyItem._id = keys._id;
            }
            const isAddFlag = this.adds.includes(index);
            const isEditFlag = this.edits.includes(index);
            return {row: item, rowConfig: {edit: this.type === "add" || isAddFlag || isEditFlag}, _id: keyItem._id};
          });
        },
        set(val) {
          //  设置
        }
      }
    },
    data() {
      const tableStore = {table: this, tableCellSlot: {}};
      return {
        tableStore,
        columns: [],
        adds: [],
        edits: [],
        filter: "",
        sort: {
          fieldName: "",
          order: ""
        },
        pagination: null,
        localSettings: {},
        copyOldList: [],
        currentRow: {currentRowIndex: null, row: {}, edit: false},
        tableKeys: []
      };
    },
    components: {
      TableRow
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
      addLabel: {
        type: String,
        default: () => "新增"
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
      },
      headerAlign: {
        type: String,
        default: () => "center"
      },
      operatorWidth: {
        type: [Number, String],
        default: () => 80
      },
      operatorAlign: {
        type: String,
        default: () => "center"
      },
      //高亮当前行
      highlightCurrentRow: Boolean,
      //数据为空时的提示
      emptyText: String,
      rowEditMethod: Function,
      rowDeleteMethod: Function,
      reverse: Boolean //新增的数据在上面
    }
  };
</script>
<style scoped>
  @import "css/xt-table.css";
</style>
