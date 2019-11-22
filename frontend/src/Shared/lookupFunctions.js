import store from "./Store";

function getRaceNameByID(id) {
  return store.getState().races.find(obj => obj.race_id === id).name;
}

function getClassNameById(id) {
  return store.getState().classes.find(obj => obj.class_id === id).name;
}

export { getRaceNameByID, getClassNameById };
