
const TableStore=function(table,initialState={}){

    this.table=table;

    this.states={
        columns:[],
        data:[],
    }

    for (let prop in initialState) {
        if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
            this.states[prop] = initialState[prop];
        }
    }
}

TableStore.prototype.setStates=function(initialState={}){
    for (let prop in initialState) {
        if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
            this.states[prop] = initialState[prop];
        }
    }
}

export default TableStore;