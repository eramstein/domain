import { makeNewMap } from "../map";
import type { State } from "../model";

export function setNewState(state: State) {
  state.gs = {
    map: makeNewMap(),
  };
}
