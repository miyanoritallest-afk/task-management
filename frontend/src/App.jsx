import { BoardProvider } from './context/BoardContext'
import KanbanBoard from './components/KanbanBoard'

export default function App() {
  return (
    <BoardProvider>
      <KanbanBoard />
    </BoardProvider>
  )
}
