import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";
import { handleKeyPress } from "./keybinds";

createApp(App).mount("#app");

window.onkeypress = handleKeyPress;
