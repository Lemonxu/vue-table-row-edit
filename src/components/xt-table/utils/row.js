import moment from "moment";
import { get } from "./helpers";

export default class Row {
    constructor(data, columns) {
        this.data = data;
        this.columns = columns;
    }
    getValue(columnName) {
        return get(this.data, columnName);
    }
    getColumn(columnName) {
        return this.columns.find((column) => column.prop === columnName);
    }
    getFilterableValue(columnName) {
        const value = this.getValue(columnName);
        if (!value) {
            return "";
        }
        return value.toString().toLowerCase();
    }
    getSortableValue(columnName) {
        const propType = this.getColumn(columnName).propType;
        let value = this.getValue(columnName);
        if (value === undefined || value === null) {
            return "";
        }
        if (value instanceof String) {
            value = value.toLowerCase();
        }
        if (propType.startsWith("date")) {
            const format = propType.replace("date:", "");
            return moment(value, format).format("YYYYMMDDHHmmss");
        }
        if (propType === "numeric") {
            return value;
        }
        return value.toString();
    }

    passesFilter(filter) {
        return this.columns
            .filter((column) => column.isFilterable())
            .map((column) => this.getFilterableValue(column.getFilterFieldName()))
            .filter((filterableValue) => filterableValue.indexOf(filter.toLowerCase()) >= 0)
            .length;
    }
}
