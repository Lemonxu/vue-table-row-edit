function classList(...classes) {
  return classes
    .map((c) => (Array.isArray(c) ? c : [c]))
    .reduce((classes, c) => classes.concat(c), []);
}

function get(object, path) {
  if (!path) {
    return object;
  }

  if (object === null || typeof object !== "object") {
    return object;
  }

  const [pathHead, pathTail] = path.split(/\.(.+)/);

  return get(object[pathHead], pathTail);
}

function pick(object, properties) {
  return properties.reduce((pickedObject, property) => {
    pickedObject[property] = object[property];
    return pickedObject;
  }, {});
}

function range(from, to) {
  return [...Array(to - from)].map((_, i) => i + from);
}

//最宽度计算
const parseWidth = (width) => {
  if (width !== undefined) {
    width = parseInt(width, 10);
    if (isNaN(width)) {
      width = null;
    }
  }
  return width;
};

//最小宽度计算
const parseMinWidth = (minWidth) => {
  if (minWidth !== undefined) {
    minWidth = parseInt(minWidth, 10);
    if (isNaN(minWidth)) {
      minWidth = null;
    }
  }
  return minWidth;
};

//表头列宽度计算
const columnStyle = (column, headerAlign = "center") => {
  let minWidth = parseMinWidth(column.minWidth),
    width = parseWidth(column.width || column.newWidth),
    maxWidth = parseWidth(column.maxWidth);
  if (!minWidth) {
    minWidth = 0;
  }
  if (minWidth && (minWidth >= width || !width)) {
    minWidth = Math.abs(minWidth);
    width = minWidth;
  }
  if (!maxWidth && maxWidth <= width) {
    width = Math.abs(width);
    maxWidth = width;
  }
  if (maxWidth && maxWidth <= width) {
    maxWidth = Math.abs(maxWidth);
    width = maxWidth;
  }
  column.headStyle = {textAlign: headerAlign, width: width, minWidth: minWidth, maxWidth: maxWidth};
  return `text-align:${headerAlign};width:${width}px;min-width:${minWidth};max-width:${maxWidth}px;`;
};

//表格头部显示是否必填*
const requiredStyle = (head, rules) => {
  let required = false;
  if (!head) {
    return false;
  }
  const items = rules ? rules[head.prop] : "";
  const headType = items ? (Array.isArray(items) ? "array" : "object") : "";
  switch (headType) {
    case "array":
      if (items) {
        const itemRequired = items.find((item) => item.required);
        if (itemRequired) {required = true;}
      }
      break;
    case "object":
      if (items.required) {
        required = true;
      }
      break;
    default:
      break;
  }
  return required;
};

export {
  classList,
  get,
  pick,
  range,
  parseWidth,
  parseMinWidth,
  columnStyle,
  requiredStyle
};
