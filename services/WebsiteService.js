import Axios from "./CallerService"

export const getWebsite = (email) => {
    return Axios.post(`public/websiteUser`, email)
}

export const getViews = (id) => {
    return Axios.get(`public/dashboard/views`, { params: { websiteId: id } })
}

export const getMessages = (id) => {
    return Axios.get(`public/dashboard/messages`, { params: { websiteId: id } })
}

export const getProspects = (id) => {
    return Axios.get(`public/dashboard/prospects`, { params: { websiteId: id } })
}

export const getPropertiesStats = (propertiesIds) => {
    return Axios.get(`admin/website-event/properties-stat`, { params: { properties: propertiesIds } })
}


