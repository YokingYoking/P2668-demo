import { createApp } from "vue";
import App from "./App.vue";
import "normalize.css";

import installElementPlus from "./plugins/element";
import "element-plus/lib/theme-chalk/el-message.css"; // Elmessage bug
import axios from 'axios';

const app = createApp(App);
installElementPlus(app);
app.mount("#app");
