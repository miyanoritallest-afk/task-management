import axios from 'axios'
import type { Card, CreateCardRequest } from '../types'

const client = axios.create({ baseURL: '/api' })

export function createCard(columnId: string, data: CreateCardRequest): Promise<Card> {
  return client.post<Card>(`/columns/${columnId}/cards`, data).then((res) => res.data)
}

export default client
