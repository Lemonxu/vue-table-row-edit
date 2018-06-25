const settings = {
    tableClass: "",
    theadClass: "",
    tbodyClass: "",
    headerClass: "",
    cellClass: "",
    filterInputClass: "",
    filterPlaceholder: "Filter table…",
    filterNoResults: "There are no matching rows"
};

export function mergeSettings(newSettings) {
    for (const setting in newSettings) {
      if (Object.prototype.hasOwnProperty.call(newSettings, setting)) {
        settings[setting] = newSettings[setting];
      }
    }
}

export default settings;
