export const sortBy = (arr, key) =>
  arr.sort((a, b) => a[key] - b[key] || a[key].localeCompare(b[key]));
