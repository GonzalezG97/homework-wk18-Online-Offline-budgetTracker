const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

let db;
const request = indexedDB.open("Budget", 1);

request.onupgradeneeded = (e) => {
  db = e.target.result;

  db.createObjectStore("BudgetStore", { autoIncrement: true });
};
