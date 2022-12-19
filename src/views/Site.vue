<script>
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    createSite,
    getActiveCountries,
    getActiveCurrencies,
    getSite,
    updateSite,
} from '../api'
import useStore from '../composition/useStore'

export default {
    setup() {
        const { params } = useRoute()
        const { code } = params
        const { tenant, contentLanguage, languages } = useStore()
        const router = useRouter()
        const currentTenant = ref('')
        const site = ref({})
        const toast = useToast()
        const currencies = ref([])
        const countries = ref([])

        const countriesOptions = computed(() => {
            return countries.value.map((c) => {
                return {
                    value: c.code,
                    label: c.name[contentLanguage] || c.name.en,
                }
            })
        })

        onMounted(async () => {
            if (code) {
                const currentSite = await getSite(code)
                site.value = currentSite
            } else {
                const mainSiteData = await getSite('main')
                site.value = {
                    ...mainSiteData,
                    name: '',
                    code: '',
                    shipToCountries: [],
                }
            }
            currencies.value = await getActiveCurrencies()
            countries.value = await getActiveCountries()
            currentTenant.value = tenant
            if (!site.value.homeBase.location) {
                site.value.homeBase.location = {
                    longitude: null,
                    latitude: null,
                }
            }
        })
        const saveSite = async (site) => {
            if (code) {
                try {
                    await updateSite(code, site)
                    await router.push('/')
                } catch (error) {
                    toast.add({
                        severity: 'error',
                        summary: error.response.data.message,
                        detail: error.response.data.details[0].message,
                        life: 3000,
                    })
                }
            } else {
                try {
                    await createSite(site)
                    await router.push('/')
                } catch (error) {
                    toast.add({
                        severity: 'error',
                        summary: error.response.data.message,
                        detail: error.response.data.details[0].message,
                        life: 3000,
                    })
                }
            }
        }
        return {
            code,
            currencies,
            countriesOptions,
            languages,
            site,
            saveSite,
            router,
            countries: computed(() => countries.value),
        }
    },
}
</script>

<template>
    <div class="module grid grid-nogutter">
        <div class="col-11 mb-3">
            <RouterLink class="flex align-items-center" to="/">
                <i class="pi pi-chevron-left"></i> Back to sites
            </RouterLink>
            <h1 class="ml-1 module-title">{{ site.name }}</h1>
        </div>
        <div class="col-1 mb-3 justify-content-end">
            <Button label="Save" @click="saveSite(site)"></Button>
        </div>
        <div class="section-box-wrapper grid">
            <div class="flex field align-items-center col-12">
                <label class="mb-0" for="name">Active</label>
                <Checkbox
                    class="ml-2"
                    binary
                    v-model="site.active"
                    id="code"
                    type="text"
                />
                <label class="mb-0 ml-6" for="name">Default</label>
                <Checkbox
                    class="ml-2"
                    binary
                    v-model="site.default"
                    id="code"
                    type="text"
                />
            </div>
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
                    :disabled="code !== undefined"
                    v-model="site.code"
                    id="code"
                    type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                />
            </div>
            <div class="flex flex-column field col-5">
                <label for="name">Ship to countries</label>
                <MultiSelect
                    :options="countriesOptions"
                    v-model="site.shipToCountries"
                    optionLabel="label"
                    optionValue="value"
                />
            </div>
            <div class="flex flex-column field col-5">
                <label for="name">Currency</label>
                <Dropdown
                    filter
                    :options="currencies"
                    v-model="site.currency"
                    optionLabel="code"
                    optionValue="code"
                />
            </div>
            <div class="flex flex-column field col-5">
                <label for="name">Languages</label>
                <MultiSelect
                    :options="languages"
                    v-model="site.languages"
                    optionLabel="label"
                    optionValue="id"
                />
            </div>
            <div class="col-12 mt-4 font-bold">Home Base Address</div>
            <div v-if="site.homeBase?.address" class="grid p-2">
                <div class="col-5 field">
                    <label for="name">City</label>
                    <InputText
                        v-model="site.homeBase.address.city"
                        id="city"
                        type="text"
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                </div>
                <div class="field col-5">
                    <label for="name">Country</label>
                    <InputText
                        v-model="site.homeBase.address.country"
                        id="country"
                        type="text"
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                </div>
                <div class="field col-5">
                    <label for="name">State</label>
                    <InputText
                        v-model="site.homeBase.address.state"
                        id="state"
                        type="text"
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                </div>
                <div class="field col-5">
                    <label for="name">Street</label>
                    <InputText
                        v-model="site.homeBase.address.street"
                        id="street"
                        type="text"
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                </div>
                <div class="field col-5">
                    <label for="name">Street Number</label>
                    <InputText
                        v-model="site.homeBase.address.streetNumber"
                        id="streetNumber"
                        type="text"
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                </div>
                <div class="field col-5">
                    <label for="name">ZIP Code</label>
                    <InputText
                        v-model="site.homeBase.address.zipCode"
                        id="zipCode"
                        type="text"
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                </div>
                <div
                    v-if="site.homeBase.location"
                    class="col-12 mt-2 font-bold"
                >
                    Location Coordinates
                </div>
                <div v-if="site.homeBase.location" class="field col-5">
                    <label for="name">Longitude</label>
                    <InputText
                        v-model="site.homeBase.location.longitude"
                        id="lon"
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                </div>
                <div v-if="site.homeBase.location" class="field col-5">
                    <label for="name">Latitude</label>
                    <InputText
                        v-model="site.homeBase.location.latitude"
                        id="lat"
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                </div>
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
