import axios from 'axios'
import type { Card, BoardColumn, Board, CreateCardRequest, CreateColumnRequest, CreateBoardRequest } from '../types'

const client = axios.create({ baseURL: '/api' })

export function createCard(columnId: string, data: CreateCardRequest): Promise<Card> {
  return client.post<Card>(`/columns/${columnId}/cards`, data).then((res) => res.data)
}

export function updateCard(
  id: string,
  payload: Partial<Pick<Card, 'title' | 'description' | 'dueDate' | 'priority' | 'position' | 'color'>>
): Promise<Card> {
  return client.patch<Card>(`/cards/${id}`, payload).then((res) => res.data)
}

export function updateColumn(
  id: string,
  payload: Partial<Pick<BoardColumn, 'name' | 'position'>>
): Promise<BoardColumn> {
  return client.patch<BoardColumn>(`/columns/${id}`, payload).then((res) => res.data)
}

export function moveCard(cardId: string, newColumnId: string): Promise<Card> {
  return client.patch<Card>(`/cards/${cardId}/move`, null, { params: { columnId: newColumnId } }).then((res) => res.data)
}

export function deleteCard(id: string): Promise<void> {
  return client.delete(`/cards/${id}`).then(() => undefined)
}

export function createColumn(boardId: string, data: CreateColumnRequest): Promise<BoardColumn> {
  return client.post<BoardColumn>(`/boards/${boardId}/columns`, data).then((res) => res.data)
}

export function createBoard(data: CreateBoardRequest): Promise<Board> {
  return client.post<Board>('/boards', data).then((res) => res.data)
}

export function deleteColumn(id: string): Promise<void> {
  return client.delete(`/columns/${id}`).then(() => undefined)
}

export default client
