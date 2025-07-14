import { useNetwork } from '../contexts/NetworkContext'
import { useNetworkDiagnostics } from '../hooks/useNetworkDiagnostics'
import { NetworkStatus } from '../types/network'
import SpeedGauge from '../components/SpeedGauge'
import ScanningAnimation from '../components/ScanningAnimation'
import { Activity, Wifi, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const { state } = useNetwork()
  const { 
    isRunningTest, 
    testProgress, 
    currentTest, 
    runSpeedTest, 
    runDiagnostics 
  } = useNetworkDiagnostics()

  const handleSaveTest = () => {
    const testData = {
      timestamp: new Date().toISOString(),
      downloadSpeed: state.downloadSpeed,
      uploadSpeed: state.uploadSpeed,
      latency: state.latency,
      packetLoss: state.packetLoss,
      status: state.status,
      isLocalIssue: state.isLocalIssue,
      isISPIssue: state.isISPIssue
    }
    
    const existingHistory = JSON.parse(localStorage.getItem('networkTestHistory') || '[]')
    existingHistory.push(testData)
    localStorage.setItem('networkTestHistory', JSON.stringify(existingHistory))
    
    // You could add a toast notification here
    console.log('Test data saved to history')
  }

  const getStatusColor = (status: NetworkStatus) => {
    switch (status) {
      case NetworkStatus.EXCELLENT:
      case NetworkStatus.GOOD:
        return 'text-network-green-600 bg-network-green-100'
      case NetworkStatus.FAIR:
        return 'text-network-yellow-600 bg-network-yellow-100'
      case NetworkStatus.POOR:
      case NetworkStatus.OFFLINE:
        return 'text-network-red-600 bg-network-red-100'
      default:
        return 'text-secondary-600 bg-secondary-100'
    }
  }

  const getStatusIcon = (status: NetworkStatus) => {
    switch (status) {
      case NetworkStatus.EXCELLENT:
      case NetworkStatus.GOOD:
        return <CheckCircle className="h-5 w-5" />
      case NetworkStatus.FAIR:
        return <AlertTriangle className="h-5 w-5" />
      case NetworkStatus.POOR:
      case NetworkStatus.OFFLINE:
        return <XCircle className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Network Status Header */}
      <ScanningAnimation isActive={true}>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">
                Network Status
              </h2>
              <p className="text-secondary-600 mt-1">
                {state.isOnline ? 'Connected to the internet' : 'No internet connection'}
              </p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(state.status)}`}>
              {getStatusIcon(state.status)}
              <span className="font-medium capitalize">{state.status}</span>
            </div>
          </div>
        </div>
      </ScanningAnimation>

      {/* Issue Classification - Moved to Top */}
      <ScanningAnimation isActive={true}>
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Issue Classification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border-2 ${
              state.isLocalIssue 
                ? 'border-network-red-300 bg-network-red-50' 
                : 'border-secondary-200 bg-secondary-50'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  state.isLocalIssue ? 'bg-network-red-500' : 'bg-secondary-300'
                }`}></div>
                <span className="font-medium">Local Network Issue</span>
              </div>
              <p className="text-sm text-secondary-600 mt-1">
                {state.isLocalIssue 
                  ? 'Problem detected with your local network or devices'
                  : 'No local network issues detected'
                }
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              state.isISPIssue 
                ? 'border-network-red-300 bg-network-red-50' 
                : 'border-secondary-200 bg-secondary-50'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  state.isISPIssue ? 'bg-network-red-500' : 'bg-secondary-300'
                }`}></div>
                <span className="font-medium">ISP Issue</span>
              </div>
              <p className="text-sm text-secondary-600 mt-1">
                {state.isISPIssue 
                  ? 'Problem detected with your internet service provider'
                  : 'No ISP issues detected'
                }
              </p>
            </div>
          </div>
        </div>
      </ScanningAnimation>

      {/* Speed Gauge */}
      <SpeedGauge
        downloadSpeed={state.downloadSpeed}
        uploadSpeed={state.uploadSpeed}
        isRunning={isRunningTest}
        onStartTest={runSpeedTest}
        onSaveTest={handleSaveTest}
        hasTestData={state.downloadSpeed > 0 || state.uploadSpeed > 0}
      />

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Download Speed</p>
              <p className="text-2xl font-bold text-secondary-900">
                {state.downloadSpeed > 0 ? `${state.downloadSpeed.toFixed(1)} Mbps` : '--'}
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
              <p className="text-sm font-medium text-secondary-600">Upload Speed</p>
              <p className="text-2xl font-bold text-secondary-900">
                {state.uploadSpeed > 0 ? `${state.uploadSpeed.toFixed(1)} Mbps` : '--'}
              </p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Activity className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <ScanningAnimation isActive={true}>
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Latency</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {state.latency > 0 ? `${state.latency}ms` : '--'}
                </p>
              </div>
              <div className="p-2 bg-primary-100 rounded-lg">
                <Wifi className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </ScanningAnimation>

        <ScanningAnimation isActive={true}>
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Packet Loss</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {state.packetLoss > 0 ? `${state.packetLoss.toFixed(1)}%` : '--'}
                </p>
              </div>
              <div className="p-2 bg-primary-100 rounded-lg">
                <Wifi className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </ScanningAnimation>
      </div>



      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={runSpeedTest}
            disabled={isRunningTest}
            className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningTest ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Activity className="h-5 w-5" />
            )}
            <span>{isRunningTest ? 'Running Test...' : 'Run Speed Test'}</span>
          </button>
          <button 
            onClick={runDiagnostics}
            disabled={isRunningTest}
            className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wifi className="h-5 w-5" />
            <span>Run Diagnostics</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Troubleshoot</span>
          </button>
        </div>
        
        {/* Test Progress */}
        {isRunningTest && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary-700">{currentTest}</span>
              <span className="text-sm text-secondary-500">{testProgress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${testProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 