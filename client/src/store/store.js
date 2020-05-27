import { createStore } from "redux";
import rootReducer from "./reducer";

//load state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      //eslint-disable-next-line no-undefined
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    //eslint-disable-next-line no-undefined
    return undefined;
  }
};

//save state to local storage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch {
    //ignore write errors
  }
};

//create a new store from the state saved in local storage
const persistedState = loadState();
const store = createStore(rootReducer, persistedState);

//when exiting, save the state to local storage
store.subscribe(() => {
  saveState({
    settings: store.getState().settings,
  });
});

export default store;
