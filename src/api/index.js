import axios from 'axios'

const getBaseUrl = () => {
    try {
        return JSON.parse(localStorage.getItem('emporixApiUrl'))
    } catch (error) {
        console.error(error)
        return 'https://api-dev.emporix.io'
    }
}

const api = axios.create()

api.interceptors.request.use((request) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))
    const { headers } = request
    if (headers) {
        headers.Authorization = `Bearer ${accessToken}`
        headers['Accept-Language'] = '*'
        headers['Content-Language'] = '*'
    }
    return request
})

export const getSites = async () => {
    const tenant = JSON.parse(localStorage.getItem('tenant'))
    const resp = await api.get(`${getBaseUrl()}/site/${tenant}/sites`)
    return resp.data
}

export const getSite = async (code) => {
    const tenant = JSON.parse(localStorage.getItem('tenant'))
    const resp = await api.get(`${getBaseUrl()}/site/${tenant}/sites/${code}`)
    return resp.data
}

export const deleteSite = async (code) => {
    const tenant = JSON.parse(localStorage.getItem('tenant'))
    const resp = await api.delete(
        `${getBaseUrl()}/site/${tenant}/sites/${code}`
    )
    return resp.data
}

export const updateSite = async (code, site) => {
    const tenant = JSON.parse(localStorage.getItem('tenant'))
    const resp = await api.patch(
        `${getBaseUrl()}/site/${tenant}/sites/${code}`,
        { ...site }
    )
    return resp.data
}

export const createSite = async (site) => {
    const tenant = JSON.parse(localStorage.getItem('tenant'))
    const resp = await api.post(`${getBaseUrl()}/site/${tenant}/sites/`, {
        ...site,
    })
    return resp.data
}

export const getActiveCurrencies = async () => {
    const tenant = JSON.parse(localStorage.getItem('tenant'))
    const resp = await api.get(
        `${getBaseUrl()}/currency/${tenant}/currencies`,
        {
            params: { pageSize: 10000 },
        }
    )
    return resp.data
}

export const getActiveCountries = async () => {
    const tenant = JSON.parse(localStorage.getItem('tenant'))
    const params = {
        active: true,
        pageSize: '1000',
        sort: 'code:asc',
    }
    const headers = {
        'X-Version': 'v2',
    }
    const { data } = await api.get(
        `${getBaseUrl()}/country/${tenant}/countries`,
        {
            params,
            headers,
        }
    )
    return data
}
