import { useNetwork } from '../contexts/NetworkContext'
import { useNetworkDiagnostics } from '../hooks/useNetworkDiagnostics'
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Wifi, 
  Activity,
  Play,
  RefreshCw
} from 'lucide-react'

export default function Troubleshooting() {
  const { state } = useNetwork()
  const { runDiagnostics, isRunningTest } = useNetworkDiagnostics()

  const getTroubleshootingSteps = () => {
    const steps = []
    
    if (!state.isOnline) {
      steps.push({
        id: 'check-internet',
        title: 'Check Internet Connection',
        description: 'Verify that your device is connected to the internet',
        status: 'pending',
        action: 'Check your WiFi or ethernet connection'
      })
    }
    
    if (state.latency > 200) {
      steps.push({
        id: 'high-latency',
        title: 'High Latency Detected',
        description: 'Your connection has high latency which may affect performance',
        status: 'warning',
        action: 'Try connecting to a closer server or contact your ISP'
      })
    }
    
    if (state.downloadSpeed < 10) {
      steps.push({
        id: 'slow-download',
        title: 'Slow Download Speed',
        description: 'Your download speed is below recommended levels',
        status: 'warning',
        action: 'Check for background downloads or contact your ISP'
      })
    }
    
    if (state.isLocalIssue) {
      steps.push({
        id: 'local-issue',
        title: 'Local Network Issue',
        description: 'Problem detected with your local network or devices',
        status: 'error',
        action: 'Restart your router and check device connections'
      })
    }
    
    if (state.isISPIssue) {
      steps.push({
        id: 'isp-issue',
        title: 'ISP Issue Detected',
        description: 'Problem detected with your internet service provider',
        status: 'error',
        action: 'Contact your ISP for assistance'
      })
    }
    
    if (steps.length === 0) {
      steps.push({
        id: 'no-issues',
        title: 'No Issues Detected',
        description: 'Your network appears to be functioning normally',
        status: 'success',
        action: 'Continue using your connection as normal'
      })
    }
    
    return steps
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-network-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-network-yellow-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-network-red-600" />
      default:
        return <HelpCircle className="h-5 w-5 text-secondary-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-network-green-200 bg-network-green-50'
      case 'warning':
        return 'border-network-yellow-200 bg-network-yellow-50'
      case 'error':
        return 'border-network-red-200 bg-network-red-50'
      default:
        return 'border-secondary-200 bg-secondary-50'
    }
  }

  const steps = getTroubleshootingSteps()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">
              Troubleshooting Guide
            </h2>
            <p className="text-secondary-600 mt-1">
              Intelligent network issue resolution and recommendations
            </p>
          </div>
          <button 
            onClick={runDiagnostics}
            disabled={isRunningTest}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningTest ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            <span>{isRunningTest ? 'Analyzing...' : 'Run Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Network Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Connection Status</p>
              <p className={`text-2xl font-bold ${state.isOnline ? 'text-network-green-600' : 'text-network-red-600'}`}>
                {state.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Wifi className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Network Health</p>
              <p className="text-2xl font-bold text-secondary-900 capitalize">
                {state.status}
              </p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Activity className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Issues Found</p>
              <p className="text-2xl font-bold text-secondary-900">
                {steps.filter(s => s.status !== 'success').length}
              </p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <HelpCircle className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Steps */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Recommended Actions
        </h3>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className={`p-4 rounded-lg border-2 ${getStatusColor(step.status)}`}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(step.status)}
                <div className="flex-1">
                  <h4 className="font-medium text-secondary-900 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-secondary-600 mb-2">
                    {step.description}
                  </p>
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-secondary-900">
                      Action: {step.action}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Quick Troubleshooting Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-secondary-900">For Slow Speeds:</h4>
            <ul className="space-y-1 text-secondary-600">
              <li>• Close unnecessary browser tabs</li>
              <li>• Pause background downloads</li>
              <li>• Move closer to your WiFi router</li>
              <li>• Try using an ethernet cable</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-secondary-900">For Connection Issues:</h4>
            <ul className="space-y-1 text-secondary-600">
              <li>• Restart your router</li>
              <li>• Check cable connections</li>
              <li>• Try a different DNS server</li>
              <li>• Contact your ISP if problems persist</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 