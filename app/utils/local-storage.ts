/**
 * Slightly modified function from MDN that checks exhaustively whether `localStorage` is both supported and available in a target browser.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#testing_for_availability
 */
const isLocalStorageAvailable = () => {
  let storage;
  try {
    storage = window.localStorage;
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);

    return true;
  } catch (e) {
    return (
      (e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0) ||
      false
    );
  }
};

const inMemoryStorage: Record<string, string> = {};

const tryLocalStorageGetItem: typeof window.localStorage.getItem = (key) => {
  if (isLocalStorageAvailable()) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return inMemoryStorage[key];
    }
  }

  return inMemoryStorage[key];
};

const tryLocalStorageSetItem: typeof window.localStorage.setItem = (
  key,
  value
) => {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      inMemoryStorage[key] = value;
    }
  }
  inMemoryStorage[key] = value;
};

const tryLocalStorageRemoveItem: typeof window.localStorage.removeItem = (
  key
) => {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      delete inMemoryStorage[key];
    }
  }
  delete inMemoryStorage[key];
};

const localStorageGetItem: typeof tryLocalStorageGetItem = (key) => {
  return tryLocalStorageGetItem(key) || null;
};

const localStorageSetItem: typeof tryLocalStorageSetItem = (key, value) => {
  tryLocalStorageSetItem(key, value);
};

const localStorageRemoveItem: typeof tryLocalStorageRemoveItem = (key) => {
  tryLocalStorageRemoveItem(key);
};

export { localStorageGetItem, localStorageRemoveItem, localStorageSetItem };
