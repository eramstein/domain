import { saveState } from "./state/db";
import { resetState, printState, runTest } from "./state/use-state";

export function handleKeyPress(event: any) {
  switch (event.charCode) {
    case 115: // s -> save
      saveState();
      break;

    case 108: // l -> log state
      printState();
      break;

    case 114: // r -> reset
      resetState();
      break;

    case 116: // t -> test script
      runTest();
      break;

    default:
      return;
  }

  event.preventDefault();
}
