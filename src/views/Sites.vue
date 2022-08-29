<template>
  <div class="module grid grid-nogutter">
    <div class="col-11 mb-3">
      <h1 class="module-title">Sites</h1>
    </div>
    <div class="col-1 mb-3">
      <Button label="Add site" @click="$router.replace(`create-site/`)"/>
    </div>
    <DataTable
        :value="sites"
        style="width: 100%"
        selection-mode="multiple"
        v-model:selection="selectedSites"
        dataKey="code"
        filter-display="row"
        v-model:filters="filters"
        responsiveLayout="scroll"
    >
      <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
      <Column field="code" header="Code" :show-filter-menu="false" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              type="text"
              v-model="filterModel.value"
              @keydown.enter="filterCallback()"
              class="p-column-filter"
              :placeholder="`Search by name - `"
          />
        </template>
        <template #body="slotProps">
          {{ slotProps.data.code }}
        </template>
      </Column>
      <Column field="name" header="Name" :show-filter-menu="false" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by name"
              @keydown.enter="filterCallback()"
          />
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-around">
            <i
                class="pi pi-pencil"
                @click="$router.replace(`site/${slotProps.data.code}`)"
            ></i>
            <i class="pi pi-trash" @click="removeSite(slotProps.data.code)"></i>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import {deleteSite, getSites} from "../api";


import {ref, watch} from "vue";
import useStore from "../composition/useStore";
import {FilterMatchMode} from "primevue/api";
import {useToast} from "primevue/usetoast";

export default {
  components: [DataTable, Column, InputText],
  setup() {
    const toast = useToast();
    const selectedSites = ref();
    const sites = ref([]);
    const filters = ref({
      code: {value: null, matchMode: FilterMatchMode.CONTAINS},
      name: {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    (async () => {
      sites.value = await getSites();
    })();

    const {tenant} = useStore();
    watch(tenant, async () => {
      const data = await getSites();
      sites.value = data;
    });

    const removeSite = async (code) => {
      try {
        await deleteSite(code);
        toast.add({
          severity: "success",
          summary: "Site deleted",
          detail: `Site ${code} deleted`,
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: error.response.data.message,
          detail: error.response.data.details[0].message,
          life: 3000,
        });
      }
    };

    return {
      selectedSites,
      sites,
      tenant,
      removeSite,
      filters,
    };
  },

  async mounted() {
  },
};
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
  }
}
</style>
