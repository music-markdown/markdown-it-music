function createMemoizeCache() {
  const store = {};
  return {
    has(key) {
      return (key in store) || localStorage.hasOwnProperty(key);
    },
    get(key) {
      if (store[key]) {
        return store[key];
      }
      if (!(key in localStorage)) {
        return;
      }
      store[key] = localStorage.getItem(key);
      return localStorage.getItem(key);
    },
    set(key, value) {
      store[key] = value;
      localStorage.setItem(key, value);
    }
  };
}

module.exports = createMemoizeCache;
