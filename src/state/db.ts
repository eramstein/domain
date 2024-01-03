import { DEFAULT_STATE, setState, state } from "./use-state";

const LOCAL_STORAGE_NAME = "domainGameState";

export function loadState() {
  const savedValue = localStorage.getItem(LOCAL_STORAGE_NAME);
  if (savedValue) {
    const state = JSON.parse(savedValue);
    setState(state);
  } else {
    const defaultState = DEFAULT_STATE;
    setState(defaultState);
  }
}

export function saveState() {
  localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(state));
}
