function classList(...classes) {
    return classes
        .map((c) => Array.isArray(c) ? c : [c])
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

export {
  classList,
  get,
  pick,
  range
};
