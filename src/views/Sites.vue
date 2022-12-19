<template>
    <div class="module grid grid-nogutter">
        <div
            class="col-12 mb-3 flex justify-content-between align-items-center"
        >
            <h1 class="module-title">Sites</h1>
            <Button
                class="h-2rem"
                label="Add site"
                @click="$router.replace(`create-site/`)"
            />
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
            :autoLayout="true"
            @row-click="onRowClick"
        >
            <Column
                field="active"
                header="Active"
                :show-filter-menu="false"
                :sortable="true"
            >
                <template #body="slotProps">
                    <div
                        class="dot"
                        :class="[
                            slotProps.data.active ? 'dot-true' : 'dot-false',
                        ]"
                    ></div>
                </template>
            </Column>
            <Column
                field="code"
                header="Code"
                :show-filter-menu="false"
                :sortable="true"
            >
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        type="text"
                        v-model="filterModel.value"
                        @keydown.enter="filterCallback()"
                        class="p-column-filter"
                        placeholder="Search by code"
                    />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data.code }}
                </template>
            </Column>
            <Column
                field="name"
                header="Name"
                :show-filter-menu="false"
                :sortable="true"
            >
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
            <Column
                field="languages"
                header="Languages"
                :show-filter-menu="false"
                :sortable="true"
            >
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        type="text"
                        v-model="filterModel.value"
                        @keydown.enter="filterCallback()"
                        class="p-column-filter"
                        placeholder="Search by language"
                    />
                </template>
                <template #body="slotProps">
                    {{ displayValuesAsString(slotProps.data.languages) }}
                </template>
            </Column>
            <Column
                field="currency"
                header="Currency"
                :show-filter-menu="false"
                :sortable="true"
            >
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        type="text"
                        v-model="filterModel.value"
                        @keydown.enter="filterCallback()"
                        class="p-column-filter"
                        placeholder="Search by currency"
                    />
                </template>
            </Column>
            <Column
                field="homeBase.address"
                filterField="homeBase.address"
                header="Home Base Address"
                :show-filter-menu="false"
            >
                <!--                <template #filter="{ filterModel, filterCallback }">-->
                <!--                    <InputText-->
                <!--                        type="text"-->
                <!--                        v-model="filterModel.value"-->
                <!--                        @keydown.enter="filterCallback()"-->
                <!--                        class="p-column-filter"-->
                <!--                        placeholder="Search by city"-->
                <!--                    />-->
                <!--                  -->
                <!--                </template>-->
                <template #body="slotProps">{{
                    transformAddressObj(slotProps.data.homeBase.address)
                }}</template>
            </Column>
            <Column
                field="shipToCountries"
                header="Ship to countries"
                :show-filter-menu="false"
                :sortable="true"
            >
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        type="text"
                        v-model="filterModel.value"
                        @keydown.enter="filterCallback()"
                        class="p-column-filter"
                        placeholder="Search by country"
                    />
                </template>
                <template #body="slotProps">
                    {{ displayValuesAsString(slotProps.data.shipToCountries) }}
                </template>
            </Column>

            <Column>
                <template #body="slotProps">
                    <div class="flex align-items-center justify-content-around">
                        <BIconTrashFill
                            @click="
                                (event) =>
                                    removeSite(event, slotProps.data.code)
                            "
                            class="trash-icon"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { deleteSite, getSites } from '../api'

import { onMounted, ref, watch } from 'vue'
import useStore from '../composition/useStore'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { BIconTrashFill } from 'bootstrap-icons-vue'

export default {
    components: { DataTable, Column, InputText, BIconTrashFill },
    setup() {
        const toast = useToast()
        const selectedSites = ref()
        const sites = ref([])
        const { tenant } = useStore()
        const confirm = useConfirm()
        const filters = ref({
            code: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            languages: { value: null, matchMode: FilterMatchMode.CONTAINS },
            currency: { value: null, matchMode: FilterMatchMode.CONTAINS },
            shipToCountries: {
                value: null,
                matchMode: FilterMatchMode.CONTAINS,
            },
            homeBase: { value: null, matchMode: FilterMatchMode.CONTAINS },
        })

        onMounted(async () => {
            sites.value = await getSites()
        })

        watch(tenant, async () => {
            sites.value = await getSites()
        })

        const removeSite = async (event, code) => {
            event.stopPropagation()
            confirm.require({
                header: `Removing site ${code}`,
                message: 'Are you sure you want to proceed?',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    try {
                        await deleteSite(code)
                        toast.add({
                            severity: 'success',
                            summary: 'Site deleted',
                            detail: `Site ${code} deleted`,
                            life: 3000,
                        })
                        sites.value = await getSites()
                    } catch (error) {
                        toast.add({
                            severity: 'error',
                            summary: error.response.data.message,
                            detail: error.response.data.details[0].message,
                            life: 3000,
                        })
                    }
                },
            })
        }

        return {
            selectedSites,
            sites,
            tenant,
            removeSite,
            filters,
        }
    },
    methods: {
        displayValuesAsString(value) {
            return value.join(', ')
        },
        transformAddressObj(obj) {
            return Object.keys(obj)
                .map(function (key) {
                    return obj[key]
                })
                .join(' ')
        },
        onRowClick(event) {
            this.$router.replace(`site/${event.data.code}`)
        },
    },
}
</script>
<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
    }
}
.dot {
    margin: 0 auto;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
.dot-true {
    background-color: #10c929ff;
}
.dot-false {
    background-color: #7b8b99ff;
}
.trash-icon {
    height: 20px;
    width: 20px;
    fill: #596168;
}
</style>
