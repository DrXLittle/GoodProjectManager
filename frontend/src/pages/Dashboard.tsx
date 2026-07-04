import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import CreateProjectModal from '../components/CreateProjectModal'

interface Project {
  id: string
  name: string
  description?: string
  taskCount?: number
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: '项目A', description: '示例项目', taskCount: 5 },
    { id: '2', name: '项目B', description: '测试项目', taskCount: 3 },
  ])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleCreateProject = (name: string, description: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      taskCount: 0,
    }
    setProjects([...projects, newProject])
    setShowCreateModal(false)
  }

  const handleDeleteProject = (id: string) => {
    if (confirm('确定删除该项目吗？')) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">GoodPM</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">欢迎, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-1.5 rounded text-sm font-medium"
            >
              登出
            </button>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 标题和按钮 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">我的项目</h2>
            <p className="text-gray-600 text-sm mt-1">共 {projects.length} 个项目</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-base transition"
          >
            + 新建项目
          </button>
        </div>

        {/* 项目网格 */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">暂无项目</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-base"
            >
              创建第一个项目
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/project/${project.id}/edit`)
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium px-2 py-1"
                    >
                      编辑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProject(project.id)
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium px-2 py-1"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">任务数</span>
                  <span className="text-lg font-bold text-blue-600">{project.taskCount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 创建项目模态框 */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}

export default Dashboard
