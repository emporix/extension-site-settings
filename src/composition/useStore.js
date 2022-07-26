import { reactive, computed } from "vue";

const state = reactive({
  tenant: "",
  site: {},
});

export const setState = (newState) => {
  state.tenant = newState.tenant;
  state.site = newState.site;
};

export default () => ({
  tenant: computed(() => state.tenant),
  site: computed(() => state.site),
  setState,
});
