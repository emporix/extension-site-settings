<template>
  <div class="module">
    <div class="col-6 mb-3">
      <h1 class="module-title">Sites</h1>
    </div>
    <DataTable :value="sites" style="width: 100%">
      <Column field="code" header="Code">
        <template #body="slotProps">
          <RouterLink :to="`site/${slotProps.data.code}`">
            {{ slotProps.data.code }}
          </RouterLink>
        </template>
      </Column>
      <Column field="name" header="Name"></Column>
    </DataTable>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import {getSites} from "../api";
import {watch, ref} from "vue";
import useStore from "../composition/useStore";

export default {
  components: [DataTable, Column, InputText],
  setup() {
    const sites = ref([]);
    (async () => {
      const data = await getSites();
      sites.value = data;
    })();

    const {tenant} = useStore();
    watch(tenant, async () => {
      const data = await getSites();
      sites.value = data;
    });

    return {
      sites,
      tenant,
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
