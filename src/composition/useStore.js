import { computed, reactive } from 'vue'

const state = reactive({
    tenant: '',
    site: {},
    contentLanguage: '',
    languages: [],
})

export const setState = (newState) => {
    state.tenant = newState.tenant
    state.site = newState.site
    state.contentLanguage = newState.contentLanguage
    state.languages = newState.languages
}

export default () => ({
    tenant: computed(() => state.tenant),
    site: computed(() => state.site),
    contentLanguage: computed(() => state.contentLanguage),
    languages: computed(() => state.languages),
    setState,
})
