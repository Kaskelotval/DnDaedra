import { ADD_CHARACTER, ADD_RACE } from "../Constants/action-types";

const initialState = {
  characters: [],
  races: []
};
function rootReducer(state = initialState, action) {
  if (action.type === ADD_CHARACTER) {
    return Object.assign({}, state, {
      characters: state.characters.concat(action.payload)
    });
  }
  if (action.type === ADD_RACE) {
    return Object.assign({}, state, {
      races: state.races.concat(action.payload)
    });
  }
  return state;
}
export default rootReducer;
