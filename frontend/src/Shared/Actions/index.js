import { ADD_CHARACTER, ADD_RACE } from "../Constants/action-types";

export function addCharacter(payload) {
  return { type: ADD_CHARACTER, payload };
}

export function addRace(payload) {
  return { type: ADD_RACE, payload };
}
