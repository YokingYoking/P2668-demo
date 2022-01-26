import { createApp } from "vue";
import App from "./App.vue";
import "normalize.css";

import installElementPlus from "./plugins/element";

const app = createApp(App);
installElementPlus(app);
app.mount("#app");
