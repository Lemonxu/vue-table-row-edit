<template>
  <section>
    <label v-if="add" size="mini" type="primary" icon="el-icon-plus" @click="handleAdd" class="button--primary" style="padding: 5px 5px 5px 5px;border-radius: 5px;" ><i class="fa fa-plus" aria-hidden="true" style="margin-right: 4px;"></i>新增</label>
    <table class="table-border table__header">
      <thead>
      <tr>
        <th v-for="(head,index) in store.states.columns" :key="index" class="lemon-cell" :style="columnStyle(head)" :width="head.width||180">
          <label style="color:red" v-if="isRequired(head)">*</label>
          {{head.label}}
        </th>
        <th class="lemon-cell" :style="`width:${editOperater?80:50}px;min-width:${editOperater?80:50}px`" v-if="operator">操作</th>
      </tr>
      </thead>
      <tbody>
      <slot :data="store" ></slot>
      <tr v-for="(row,rowIndex) in data" :key="rowIndex" @click="handleCell(store.states,$event)" >
        <td v-for="(column,columnIndex) in store.states.columns"  :key="columnIndex" class="lemon-cell" >
          <xt-table-row :data="data" :rowIndex="rowIndex" :row="row" :prop="column.prop" v-model="row[column.prop]" :isEdit="getIsEdit(rowIndex)" :rules="rules" :rule="rules[column.prop]" :column="column">
          </xt-table-row>
        </td>
        <td class="lemon-cell" v-if="operator">
          <div v-if="editOperater">
            <label style="padding: 5px 10px 5px 10px;border-radius: 5px;" @click="handleEdit(rowIndex,row,$event)" v-if="!getIsEdit(rowIndex)&&editFlag" class="button--warning" title="修改"><i class="fa fa-pencil" aria-hidden="true"></i></label>
            <label style="padding: 5px 10px 5px 10px;border-radius: 5px;" @click="handleDelete(rowIndex,row,$event)" v-if="!getIsEdit(rowIndex)&&deleteFlag" class="button--danger" title="删除"><i class="fa fa-trash-o" aria-hidden="true"></i></label>
            <label style="padding: 5px 10px 5px 10px;border-radius: 5px;" @click="handleSuccess(rowIndex,row,$event)" v-if="getIsEdit(rowIndex)&&successFlag" class="button--success" title="完成"><i class="fa fa-check" aria-hidden="true"></i></label>
            <label style="padding: 5px 10px 5px 10px;border-radius: 5px;" @click="handleCancel(rowIndex,row,$event)" v-if="getIsEdit(rowIndex)&&cancelFlag" class="button--danger" title="取消"><i class="fa fa-close" aria-hidden="true"></i></label>
          </div>
          <div v-else>
            <label style="padding: 5px 10px 5px 10px;border-radius: 5px;" @click="handleAddCancel(rowIndex,row,$event)" v-if="getIsEdit(rowIndex)" class="button--danger" title="取消"><i class="fa fa-close" aria-hidden="true"></i></label>
          </div>
        </td>
      </tr>
      <tr v-if="store.states.data.length===0">
        <td :colspan="store.states.columns.length+1">
          暂无数据
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
  import TableStore from "./table-store";
  import TableRow from "./table-row.vue";

  Array.prototype.remove = function(value) {
    const index = this.indexOf(value);
    if (index > -1) {this.splice(index, 1);}
  };

  const columnStore = {}; //在table和table-column进行交互传递

  export default {
    name: "XtTable",
    provide: {
      XtTable: columnStore
    },
    components: {
      "xt-table-row": TableRow
    },
    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },

      type: {
        type: String,
        default: () =>
           "default" //edit:含有删除、完成等操作；add:含有取消操作；

      },

      rules: {
        type: Object,
        default: function() {
          return {};
        }
      },

      editOperater: Boolean, /*是否为编辑状态*/

      add: {
        type: Boolean,
        default: () => true
      },

      operator: {
        type: Boolean,
        default: () => true
      }, //操作列显示与否

      edit: Boolean, //编辑不含删除、取消的编辑
      /*删除按钮显示设置：默认显示*/
      deleteFlag: {
        type: Boolean,
        default: () => true
      },

      /*完成按钮显示设置：默认显示*/
      successFlag: {
        type: Boolean,
        default: () => true
      },

      /*取消按钮显示设置：默认显示*/
      cancelFlag: {
        type: Boolean,
        default: () => true
      },

      /*编辑按钮显示设置：默认显示*/
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
    watch: {
      data: {
        immediate: true,
        handler(val, oldVal) {
          this.store.states.data = val;
          if (this.edit) {
            const editList = [];
            this.data.map((dataItem, index) => {
              editList.push(index);
            });
            this.editList = editList;
          } else {
            this.editList = [];
          }
        }
      }
    },
    computed: {
    },
    methods: {
      columnStyle(column) {
        return `width:${column.width || 80}px;min-width:${column.minWidth || 80};max-width:${column.maxWidth || 80}px`;
      },
      getTypeList() {
        if (this.type === "add") {
          return this.addList;
        } else if (this.type === "edit") {
          return this.editList;
        } else {
          return [...this.addList, ...this.editList];
        }
      },
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
      getIsEdit(rowIndex) {
        const item = this.getTypeList().find((val) => val === rowIndex);
        if (typeof item === "undefined") {
          return false;
        }
        return true;
      },
      //单行提交事件
      handleSuccess(rowIndex, row, event) {
        console.log(row, "table");
        const itemStates = [];
        this.$emit("validator-" + rowIndex, (validateState) => {
          itemStates.push(validateState);
        });
        const validateState = itemStates.find((item) => !item);
        if (validateState === false) {
        //  留空
        } else {
          this.$emit("success", row, (state) => {
            if (state) {
              const editItem = this.editList.find((val) => val === rowIndex);
              if (editItem !== "undefined") {this.editList.remove(editItem);}
              const addItem = this.addList.find((val) => val === rowIndex);
              if (addItem !== "undefined") {this.addList.remove(addItem);}
              const copyOldItem = this.copyOldList.find((val) => val.id === rowIndex);
              if (copyOldItem) {this.copyOldList.remove(copyOldItem);}
            }
          });
        }
        event.cancelBubble = true;
      },
      //行内取消事件
      handleCancel(rowIndex, row, event) {
        this.$emit("resetValidate-" + rowIndex);
        const editItem = this.editList.find((val) => val === rowIndex);
        if (editItem || editItem === 0) {
          const copyOldItem = this.copyOldList.find((val) => val.id === rowIndex);
          if (copyOldItem) {
            Object.assign(row, copyOldItem.row);
            this.copyOldList.remove(copyOldItem);
            this.editList.remove(editItem);
          }
        } else {
          const addItem = this.addList.find((val) => val === rowIndex);
          if (addItem || addItem === 0) {
            this.data.remove(row);
            this.addList.remove(this.addList[this.addList.length - 1]);
          }
        }
      },
      //新增行内取消事件
      handleAddCancel(rowIndex, row, event) {
        const addItem = this.addList.find((val) => val === rowIndex);
        if (addItem !== "undefined") {
          this.data.remove(row);
          this.addList.remove(this.addList[this.addList.length - 1]);
        }
      },
      //行内删除事件
      handleDelete(rowIndex, row, event) {
        this.$emit("delete", row, (state) => {
          if (state) {
            this.data.remove(row);
          }
        });
        event.cancelBubble = true;
      },
      //行内编辑事件
      handleEdit(rowIndex, row, event) {
        const editItem = this.editList.find((val) => val === rowIndex);
        if (!editItem) {this.editList.push(rowIndex);}
        const copyOldItem = this.copyOldList.find((val) => val.id === rowIndex);
        if (!copyOldItem) {this.copyOldList.push({id: rowIndex, row: JSON.parse(JSON.stringify(row))});}
      },
      //为列绑定当前行
      handleCell(column, row, event) {
        this.$set(column, "value", row[column.prop]);
      },
      //表添加事件
      handleAdd() {
        this.$emit("add", (item) => {
          const rowIndex = this.editOperater ? this.store.states.data.length - 1 : this.store.states.data.length;
          const addItem = this.addList.find((val) => val === rowIndex);
          if (!addItem) {this.addList.push(rowIndex);}
        });
      },

      /*用户新增按钮不在table里面的方法*/
      handleAddOut() {
        const rowIndex = this.editOperater ? this.store.states.data.length - 1 : this.store.states.data.length;
        const addItem = this.addList.find((val) => val === rowIndex);
        if (!addItem) {this.addList.push(rowIndex);}
      },
      //全部行验证事件
      validate(callback) {
        const validatorStates = [];
        this.getTypeList().map((editItem) => {
          const itemStates = [];
          this.$emit("validator-" + editItem, (validateState) => {
            itemStates.push(validateState);
          });
          const items = itemStates.find((item) => !item);
          if (items === false) {validatorStates.push(false);} else {validatorStates.push(true);}
        });
        const returnValidate = validatorStates.find((item) => !item);
        if (returnValidate === false) {callback(false);} else {callback(true);}
      },
      //全部行验证重置事件
      resetFields(callback) {
        const itemList = [];
        this.getTypeList().map((editItem) => {
          this.$emit("resetValidate-" + editItem);
        });
      }
    },
    created() {
      Object.assign(columnStore, this.store);
    },
    mounted() {
      const columns = [];
      this.$children.map((child) => {
        columns.push(child.column);
      });
      this.store.states.columns = columns;
    }
  };
</script>

<style scoped>
@import "./css/xt-table.css";
</style>

