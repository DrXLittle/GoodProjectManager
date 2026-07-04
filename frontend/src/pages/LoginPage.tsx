import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

// Default credentials for testing
const DEFAULT_USERS = [
  { username: 'admin', password: 'admin123', name: 'Admin User' },
  { username: 'user1', password: 'user123', name: 'User One' },
  { username: 'user2', password: 'user123', name: 'User Two' },
  { username: 'user3', password: 'user123', name: 'User Three' },
  { username: 'manager', password: 'manager123', name: 'Project Manager' },
]

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showDefaults, setShowDefaults] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      // Check default credentials
      const user = DEFAULT_USERS.find(u => u.username === username && u.password === password)

      if (!user) {
        setError('Invalid username or password')
        return
      }

      // Mock token generation
      const token = `token_${user.username}_${Date.now()}`
      login(token, {
        id: user.username,
        username: user.username,
        name: user.name,
      })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  const handleQuickLogin = (user: typeof DEFAULT_USERS[0]) => {
    setUsername(user.username)
    setPassword(user.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">
          GoodPM
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">Project Management</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
          >
            Login
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowDefaults(!showDefaults)}
            className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-1"
          >
            {showDefaults ? '隐藏默认账户' : '显示默认账户'}
          </button>

          {showDefaults && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gray-600 font-medium">点击快速登录:</p>
              {DEFAULT_USERS.map(user => (
                <button
                  key={user.username}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-xs transition"
                >
                  {user.username} / {user.password}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
