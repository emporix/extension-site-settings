<script setup>
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import { registerCallback, registerClient } from 'md-ext/lib'
import useStore from './composition/useStore'

const { setState } = useStore()

registerClient()
registerCallback('siteSettingsExtension', (ctx) => {
    Object.keys(ctx.value).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(ctx.value[key]))
    })
    setState({
        tenant: ctx.value.tenant,
        site: ctx.value.currentSite,
        contentLanguage: ctx.value.contentLanguage,
        languages: ctx.value.configuration.languages,
    })
})
</script>

<template>
    <div class="app">
        <main>
            <RouterView />
        </main>
        <Toast />
        <ConfirmDialog />
    </div>
</template>

<style scoped>
.app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

header {
    line-height: 1.5;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
    display: flex;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
