import Axios from "./CallerService"

export const getMember = (agentId) => {
    return Axios.get(`public/agents/${agentId}`)
}
export const getProperties = (agentId) => {
    return Axios.get(`public/properties/agent/${agentId}`)
}

export const updateUser = (id, data) => {
    return Axios.put(`admin/user/${id}`, data)
}
