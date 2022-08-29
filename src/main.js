import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "./assets/main.scss";
import DataTable from "primevue/datatable";
import ConfirmationService from "primevue/confirmationservice";
import Column from "primevue/column";
import "primeflex/primeflex.css";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";

const app = createApp(App);

app.use(PrimeVue);

app.use(router);
app.use(ConfirmationService);
app.use(ToastService);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("InputText", InputText);
app.component("Checkbox", Checkbox);
app.component("Button", Button);
app.component("Dropdown", Dropdown);
app.component("MultiSelect", MultiSelect);
app.component("Toast", Toast);
app.component("ConfirmDialog", ConfirmDialog);

app.mount("#app");
