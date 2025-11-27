import axios from 'axios'

type EnvVariables = Array<{
  name: string
  value: string
}>

type EndpointId = number

type StackData = {
  Id: number
  Name: string
  EndpointId: EndpointId
  Env: EnvVariables
}

type CreateStackParams = { endpointId: EndpointId}
type CreateStackBody = { name: string; stackFileContent: string; swarmID?: string }
type UpdateStackParams = { endpointId: EndpointId }
type UpdateStackBody = { env: EnvVariables; stackFileContent: string }

export class PortainerApi {
  private axiosInstance

  constructor(host: string, accessToken: string, registryAuth?: string) {
    this.axiosInstance = axios.create({
      baseURL: `${host}/api`
    })
    this.axiosInstance.defaults.headers.common['x-api-key'] = accessToken
    if (registryAuth) {
      this.axiosInstance.defaults.headers.common['X-Registry-Auth'] = registryAuth
    }
  }

  async getStacks(): Promise<StackData[]> {
    const { data } = await this.axiosInstance.get<StackData[]>('/stacks')
    return data
  }

  async createStack(params: CreateStackParams, body: CreateStackBody): Promise<void> {
    const path = body.swarmID ? '/stacks/create/swarm/string' : '/stacks/create/standalone/string'
    await this.axiosInstance.post(path, body, { params })
  }

  async updateStack(id: number, params: UpdateStackParams, body: UpdateStackBody): Promise<void> {
    await this.axiosInstance.put(`/stacks/${id}`, body, { params })
  }
}
