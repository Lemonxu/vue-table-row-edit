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
        :key="index"
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
        :tableRowEdit="isRowEdit(tableRow,index)"
        :tableRow="tableRow"
        :rowEditMethod="rowEditMethod"
        :rowDeleteMethod="rowDeleteMethod"
        @submit="handleSubmit"
        @delete="handleDelete"
        @cancel="handleCancel(tableRow.row,index)"
        @edit="handleEdit"
        @click.native="handleRowClick(tableRow.row,tableRow,index)"
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
  import {parseWidth, parseMinWidth} from "./utils/helpers";
  import {addResizeListener, removeResizeListener} from "./utils/resize-event";
  import ResizeObserver from "resize-observer-polyfill";
  import Bus from "./bus";

  Vue.use(ElementUI);

  export default {
    name: "XtTable",
    methods: {
      //列基础宽度样式
      columnStyle(column) {
        let minWidth = parseMinWidth(column.minWidth), width = parseWidth(column.width || column.newWidth), maxWidth = parseWidth(column.maxWidth);
        if (!minWidth) {
          minWidth = 0;
        }
        if (minWidth && (minWidth >= width || !width)) {
          if (minWidth < 0) {
            minWidth = -minWidth;
          }
          width = minWidth;
        }
        if (!maxWidth && maxWidth <= width) {
          if (width < 0) {
            width = -width;
          }
          maxWidth = width;
        }
        if (maxWidth && maxWidth <= width) {
          if (maxWidth < 0) {
            maxWidth = -maxWidth;
          }
          width = maxWidth;
        }
        return `text-align:${this.headerAlign};width:${width}px;min-width:${minWidth};max-width:${maxWidth}px;`;
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
        }, this.data);
      },
      //取消事件
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
      //编辑事件
      handleEdit(row, rowIndex, editFlag) {
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
      handleSubmit(row, rowIndex, callback) {
        this.$emit("success", row, (status) => {
          if (status) {
            this.setRowIndex(rowIndex, false);
            const copyOldItem = this.copyOldList.find((val) => val.id === rowIndex);
            if (copyOldItem) {this.copyOldList.remove(copyOldItem);}
          }
          callback(status);
        });
      },
      handleRowClick(row, tableRow, rowIndex) {
        this.currentRow = {currentRowIndex: rowIndex, row: row, edit: this.isRowEdit(tableRow, rowIndex)};
        this.$emit("row-click", row, rowIndex, tableRow);
      },
      //获取操作列宽度
      getOperateStyle() {
        const defaultButtons = [];
        if (this.editFlag) {defaultButtons.push(true);} else {defaultButtons.push(false);}
        if (this.successFlag) {defaultButtons.push(true);} else {defaultButtons.push(false);}
        if (this.deleteFlag) {defaultButtons.push(true);} else {defaultButtons.push(false);}
        if (this.cancelFlag) {defaultButtons.push(true);} else {defaultButtons.push(false);}
        const buttonLength = defaultButtons.filter((item) => item).length;
        let operateStyle = `text-align:${this.operatorAlign};min-width:${buttonLength * 40}px;width:${buttonLength * 40}px`;
        if (parseWidth(this.operatorWidth)) {
          operateStyle = `text-align:${this.operatorAlign};width:${parseWidth(this.operatorWidth)}px;min-width:${parseWidth(this.operatorWidth)}px;max-width:${parseWidth(this.operatorWidth)}px`;
        } else {
          const operateItem = this.columns.find((column) => !column.hidden && column.type === "operate");
          if (operateItem) {
            operateStyle = `text-align:${this.operatorAlign};min-width:${parseMinWidth(operateItem.minWidth || buttonLength * 40)}px;width:${parseWidth(operateItem.width || buttonLength * 40)}px;max-width:${operateItem.maxWidth || "auto"}`;
          }
        }

        return operateStyle;
      },
      bindEvents() {
        addResizeListener(this.$el, this.resizeListener);
      },
      resizeListener() {
        this.tableStore.table = this;
        this.calColumns();
      },
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
      rowDeleteMethod: Function
    },
    data() {
      const tableStore = {table: this, tableCellSlot: {}};
      return {
        tableStore,
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
        copyOldList: [],
        currentRow: {currentRowIndex: null, row: {}, edit: false}
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
