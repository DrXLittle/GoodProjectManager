import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CreateTaskModal from '../components/CreateTaskModal'
import TaskBoard from '../components/TaskBoard'

interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assignedTo?: string
  dueDate?: string
}

interface Project {
  id: string
  name: string
  description?: string
}

const ProjectDetail = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project] = useState<Project>({
    id: projectId || '1',
    name: '示例项目',
    description: '这是一个示例项目',
  })

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: '设计UI', status: 'TODO', priority: 'HIGH', dueDate: '2026-07-10' },
    { id: '2', title: '后端API开发', status: 'IN_PROGRESS', priority: 'HIGH', assignedTo: 'user1' },
    { id: '3', title: '前端开发', status: 'IN_PROGRESS', priority: 'MEDIUM' },
    { id: '4', title: '测试', status: 'DONE', priority: 'MEDIUM' },
  ])

  const [showCreateTask, setShowCreateTask] = useState(false)

  const handleCreateTask = (title: string, description: string, priority: string, dueDate: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: 'TODO',
      priority: priority as 'LOW' | 'MEDIUM' | 'HIGH',
      dueDate,
    }
    setTasks([...tasks, newTask])
    setShowCreateTask(false)
  }

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('确定删除该任务吗？')) {
      setTasks(tasks.filter(t => t.id !== taskId))
    }
  }

  const todoTasks = tasks.filter(t => t.status === 'TODO')
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
  const doneTasks = tasks.filter(t => t.status === 'DONE')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-1"
            >
              ← 返回项目列表
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          </div>
          <button
            onClick={() => setShowCreateTask(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-base"
          >
            + 新建任务
          </button>
        </div>
      </div>

      {/* 项目描述 */}
      <div className="max-w-6xl mx-auto px-4 py-4 bg-white border-b border-gray-200">
        <p className="text-gray-600 text-sm">{project.description}</p>
        <div className="mt-2 text-xs text-gray-500">共 {tasks.length} 个任务</div>
      </div>

      {/* 任务看板 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <TaskBoard
          todoTasks={todoTasks}
          inProgressTasks={inProgressTasks}
          doneTasks={doneTasks}
          onStatusChange={handleUpdateTaskStatus}
          onDelete={handleDeleteTask}
        />
      </div>

      {/* 创建任务模态框 */}
      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  )
}

export default ProjectDetail
