import { setNewState } from "@/logic/main/main";
import type { State } from "@/logic/model";
import { reactive, toRaw } from "vue";

const state: State = reactive({} as State);

const DEFAULT_STATE: State = {
  gs: { map: [] },
};

function setState(gs: State) {
  Object.assign(state, gs);
}

function resetState() {
  Object.assign(state, DEFAULT_STATE);
  setNewState(state);
}

function printState() {
  console.log(toRaw(state));
}

function getStateValue() {
  return toRaw(state);
}

function runTest() {
  console.log("testouille la fripouille");
}

export {
  state,
  setState,
  resetState,
  printState,
  runTest,
  getStateValue,
  DEFAULT_STATE,
};
