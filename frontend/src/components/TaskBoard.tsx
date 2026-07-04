interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assignedTo?: string
  dueDate?: string
}

interface TaskBoardProps {
  todoTasks: Task[]
  inProgressTasks: Task[]
  doneTasks: Task[]
  onStatusChange: (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => void
  onDelete: (taskId: string) => void
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return '高'
    case 'MEDIUM':
      return '中'
    case 'LOW':
      return '低'
    default:
      return priority
  }
}

const TaskCard = ({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task
  onStatusChange: (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => void
  onDelete: (taskId: string) => void
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-sm font-semibold text-gray-900 flex-1">{task.title}</h4>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-600 hover:text-red-700 text-xs font-medium ml-2"
      >
        删除
      </button>
    </div>

    {task.description && (
      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
    )}

    <div className="flex justify-between items-center mb-2">
      <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
        {getPriorityLabel(task.priority)}优先级
      </span>
      {task.dueDate && (
        <span className="text-xs text-gray-500">{task.dueDate}</span>
      )}
    </div>

    {task.assignedTo && (
      <p className="text-xs text-gray-600 mb-2">指派给: {task.assignedTo}</p>
    )}

    <div className="flex gap-1 pt-2">
      {task.status !== 'TODO' && (
        <button
          onClick={() => onStatusChange(task.id, 'TODO')}
          className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded"
        >
          待办
        </button>
      )}
      {task.status !== 'IN_PROGRESS' && (
        <button
          onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
          className="flex-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 rounded"
        >
          进行中
        </button>
      )}
      {task.status !== 'DONE' && (
        <button
          onClick={() => onStatusChange(task.id, 'DONE')}
          className="flex-1 text-xs bg-green-100 hover:bg-green-200 text-green-800 py-1 rounded"
        >
          完成
        </button>
      )}
    </div>
  </div>
)

const TaskBoard = ({
  todoTasks,
  inProgressTasks,
  doneTasks,
  onStatusChange,
  onDelete,
}: TaskBoardProps) => {
  const columns = [
    { title: '待办', tasks: todoTasks, color: 'bg-gray-50' },
    { title: '进行中', tasks: inProgressTasks, color: 'bg-blue-50' },
    { title: '已完成', tasks: doneTasks, color: 'bg-green-50' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(column => (
        <div key={column.title} className={`${column.color} rounded-lg border border-gray-200 p-4`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-900">{column.title}</h3>
            <span className="text-xs font-semibold bg-gray-300 text-gray-700 px-2 py-1 rounded">
              {column.tasks.length}
            </span>
          </div>

          <div className="space-y-2 min-h-96">
            {column.tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                暂无任务
              </div>
            ) : (
              column.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskBoard
