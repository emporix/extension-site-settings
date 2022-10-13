import { computed, reactive } from 'vue'

const state = reactive({
    tenant: '',
    site: {},
    contentLanguage: '',
})

export const setState = (newState) => {
    state.tenant = newState.tenant
    state.site = newState.site
    state.contentLanguage = newState.contentLanguage
}

export default () => ({
    tenant: computed(() => state.tenant),
    site: computed(() => state.site),
    contentLanguage: computed(() => state.contentLanguage),
    setState,
})
