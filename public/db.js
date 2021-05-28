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

request.onsuccess = (e) => {
  db = e.target.result;
  if (navigator.onLine) {
    checkDB();
  }
};

request.onerror = (e) => {
  console.log("Error Fix it" + e.target.errorCode);
};

const checkDB = () => {
  console.log("DB invoked");
  let transaction = db.transaction(["BudgetStore"], "readwrite");

  const store = transaction.objectStore("BudgetStore");

  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.results),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            transaction = db.transaction(["BudgetStore"], "readwrite");

            const currentStore = transaction.objectStore("BudgetStore");

            currentStore.clear();
            console.log("Clear store 🧹");
          }
        });
    }
  };
};
