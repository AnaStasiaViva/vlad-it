export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function flatten(a) {
  return Array.isArray(a) ? [].concat(...a.map(flatten)) : a;
}

export function uppercaseObjKeys(arr) {
  if (arr.length === 0) return;
  return arr?.map((obj) => {
    return Object.entries(obj).reduce((a, [key, value]) => {
      a[key.toUpperCase()] = value;
      return a;
    }, {});
  });
}

export function deeplyNested(obj) {
  return Object.entries(obj).reduce((newObj, [key, value]) => {
    let nested;
    if (typeof value === "object") {
      nested = deeplyNested(value);
    }
    newObj[key.toUpperCase()] = typeof value !== "object" ? value : nested;
    return newObj;
  }, {});
}
