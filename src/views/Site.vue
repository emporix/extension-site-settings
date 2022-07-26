<script>
import { useToast } from "primevue/usetoast";
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getSite, updateSite} from "../api";
import useStore from "../composition/useStore";

export default {
  setup() {
    const {params} = useRoute();
    const {code} = params;
    const {tenant} = useStore();
    const router = useRouter();
    const currentTenant = ref("");
    const site = ref({});
    const toast = useToast();
    const countries = ref([
      {
        label: "Deutschland",
        value: "DE",
      },
      {
        label: "Österreich",
        value: "AT",
      },
    ]);
    (async () => {
      site.value = await getSite(code);
      currentTenant.value = tenant.value;
    })();

    const saveSite = async (site) => {
      try {
        await updateSite(code, site);
        await router.push("/");
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
      site,
      saveSite,
      router,
      countries: computed(() => countries.value),
    };
  },
};
</script>

<template>
  <div class="module grid grid-nogutter">
    <div class="col-11 mb-3">
      <RouterLink class="flex align-items-center" to="/">
        <i class="pi pi-chevron-left"></i> Back to sites
      </RouterLink>
      <h1 class="ml-1 module-title">Site</h1>
    </div>
    <div class="col-1 mb-3 justify-content-end">
      <Button label="Save" @click="saveSite(site)"></Button>
    </div>
    <div class="section-box-wrapper grid">
      <div class="field col-5">
        <label for="name">Name</label>
        <InputText
            v-model="site.name"
            id="name"
            type="text"
            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        />
      </div>
      <div class="field col-5">
        <label for="name">Code</label>
        <InputText
            disabled
            v-model="site.code"
            id="code"
            type="text"
            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        />
      </div>
      <div class="flex field align-items-center col-5">
        <label class="mb-0" for="name">Active</label>
        <Checkbox
            class="ml-2"
            binary
            v-model="site.active"
            id="code"
            type="text"
        />
      </div>
      <div class="flex flex-column field col-5">
        <label for="name">Ship to countries</label>
        <MultiSelect
            :options="countries"
            v-model="site.shipToCountries"
            optionLabel="label"
            optionValue="value"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-box-wrapper {
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c0d0df;
  padding: 2rem;
  width: 100%;
}
</style>
