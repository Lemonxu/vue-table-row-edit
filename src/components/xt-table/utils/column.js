import {pick} from "./helpers";

export default class Column {
  constructor(columnComponent) {
    const properties = pick(columnComponent, [
      "label", "prop", "type", "propType", "options", "props", "filterable", "onlyShow", "clearable", "maxlength", "minlength", "max", "min",
      "placeholder", "remote", "remoteMethod", "showOverflowTooltip", "format", "valueFormat", "width", "minWidth", "maxWidth", "disabled",
      "editable", "sortable", "sortBy", "filterOn", "formatter", "hidden", "cellClass", "headerClass", "align", "rightAppearance"]);
    for (const property in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, property)) {
        this[property] = columnComponent[property];
      }
    }
    this.template = columnComponent.$scopedSlots.default;
  }


  isFilterable() {
    return this.filterable;
  }

  getFilterFieldName() {
    return this.filterOn || this.prop;
  }

  isSortable() {
    return this.sortable;
  }

  getSortPredicate(sortOrder, allColumns) {
    const sortFieldName = this.getSortFieldName();

    const sortColumn = allColumns.find((column) => column.prop === sortFieldName);

    const propType = sortColumn.propType;

    if (propType.startsWith("date") || propType === "numeric") {

      return (row1, row2) => {
        const value1 = row1.getSortableValue(sortFieldName);
        const value2 = row2.getSortableValue(sortFieldName);

        if (sortOrder === "desc") {
          return value2 < value1 ? -1 : 1;
        }

        return value1 < value2 ? -1 : 1;
      };
    }

    return (row1, row2) => {
      const value1 = row1.getSortableValue(sortFieldName);
      const value2 = row2.getSortableValue(sortFieldName);

      if (sortOrder === "desc") {
        return value2.localeCompare(value1);
      }

      return value1.localeCompare(value2);
    };
  }

  getSortFieldName() {
    return this.sortBy || this.prop;
  }
}
