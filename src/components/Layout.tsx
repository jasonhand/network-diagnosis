import { Link, useLocation } from 'react-router-dom'
import { Wifi, Activity, Settings, HelpCircle, Home, Clock } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Speed Test', href: '/speed-test', icon: Activity },
  { name: 'Diagnostics', href: '/diagnostics', icon: Settings },
  { name: 'Troubleshooting', href: '/troubleshooting', icon: HelpCircle },
  { name: 'History', href: '/history', icon: Clock },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-secondary-900">
                  Network Diagnosis
                </h1>
                <p className="text-sm text-secondary-500">
                  Local vs ISP Issue Detection
                </p>
              </div>
            </div>
            
            {/* Online Status Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-network-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-secondary-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-secondary-500">
              Network Diagnosis Tool - Built with React & TypeScript
            </p>
            <p className="text-sm text-secondary-500">
              Progressive Web App
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 