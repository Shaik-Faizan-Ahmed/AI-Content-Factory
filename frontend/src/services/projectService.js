import api from "./api"

export const getProject = async (projectId) => {
    const response = await api.get(`/projects/${projectId}`)
    return response.data
}

export const getProjectState = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/state`)
    return response.data
}

export const getProjects = async () => {
    const response = await api.get("/projects")
    return response.data
}

export const createProject = async (payload) => {
    const response = await api.post("/projects", payload)
    return response.data
}

export const continueProject = async (projectId, stage) => {
    const response = await api.post(`/projects/${projectId}/continue`, { stage })
    return response.data
}

export const regenerateStage = async (projectId, stage) => {
    const response = await api.post(`/projects/${projectId}/regenerate`, { stage })
    return response.data
}
