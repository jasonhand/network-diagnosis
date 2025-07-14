import { useState } from 'react'
import { useNetwork } from '../contexts/NetworkContext'
import { useNetworkDiagnostics } from '../hooks/useNetworkDiagnostics'
import { NetworkStatus } from '../types/network'
import SpeedTestAnimation from '../components/SpeedTestAnimation'
import { 
 
  Download, 
  Upload, 
  Clock, 
  Wifi, 
  Play, 
  RefreshCw, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function SpeedTest() {
  const { state } = useNetwork()
  const { 
    isRunningTest, 
    testProgress, 
    currentTest, 
    runSpeedTest 
  } = useNetworkDiagnostics()
  
  const [showAnimation, setShowAnimation] = useState(false)
  const [hasCompletedTest, setHasCompletedTest] = useState(false)

  const getStatusColor = (status: NetworkStatus) => {
    switch (status) {
      case NetworkStatus.EXCELLENT:
      case NetworkStatus.GOOD:
        return 'text-network-green-600'
      case NetworkStatus.FAIR:
        return 'text-network-yellow-600'
      case NetworkStatus.POOR:
      case NetworkStatus.OFFLINE:
        return 'text-network-red-600'
      default:
        return 'text-secondary-600'
    }
  }

  const getSpeedRating = (speed: number, type: 'download' | 'upload') => {
    if (type === 'download') {
      if (speed >= 100) return { rating: 'Excellent', color: 'text-network-green-600' }
      if (speed >= 50) return { rating: 'Good', color: 'text-network-green-600' }
      if (speed >= 25) return { rating: 'Fair', color: 'text-network-yellow-600' }
      if (speed >= 10) return { rating: 'Poor', color: 'text-network-red-600' }
      return { rating: 'Very Poor', color: 'text-network-red-600' }
    } else {
      if (speed >= 50) return { rating: 'Excellent', color: 'text-network-green-600' }
      if (speed >= 25) return { rating: 'Good', color: 'text-network-green-600' }
      if (speed >= 10) return { rating: 'Fair', color: 'text-network-yellow-600' }
      if (speed >= 5) return { rating: 'Poor', color: 'text-network-red-600' }
      return { rating: 'Very Poor', color: 'text-network-red-600' }
    }
  }

  const downloadRating = getSpeedRating(state.downloadSpeed, 'download')
  const uploadRating = getSpeedRating(state.uploadSpeed, 'upload')

  const handleRunSpeedTest = async () => {
    setShowAnimation(true)
    setHasCompletedTest(false)
    await runSpeedTest()
    setHasCompletedTest(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">
              Speed Test
            </h2>
            <p className="text-secondary-600 mt-1">
              Test your internet connection speed and performance
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleRunSpeedTest}
              disabled={isRunningTest}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTest ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              <span>{isRunningTest ? 'Running Test...' : 'Start Test'}</span>
            </button>
            
            {hasCompletedTest && !isRunningTest && (
              <button 
                onClick={() => {
                  setShowAnimation(false)
                  setHasCompletedTest(false)
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className="h-5 w-5" />
                <span>New Test</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stunning Speed Test Animation */}
      {(isRunningTest || (showAnimation && hasCompletedTest)) && (
        <div className="card p-0 overflow-hidden">
          <SpeedTestAnimation
            isRunning={isRunningTest}
            progress={testProgress}
            currentTest={currentTest}
            showResults={hasCompletedTest}
          />
        </div>
      )}

      {/* Speed Results */}
      {state.downloadSpeed > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Download Speed */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Download className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-secondary-900">
                  Download Speed
                </h3>
              </div>
              <div className={`text-sm font-medium ${downloadRating.color}`}>
                {downloadRating.rating}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-900 mb-2">
                {state.downloadSpeed.toFixed(1)}
              </div>
              <div className="text-lg text-secondary-600 mb-4">Mbps</div>
              <div className="flex items-center justify-center space-x-2 text-sm text-secondary-500">
                <TrendingUp className="h-4 w-4" />
                <span>Download performance</span>
              </div>
            </div>
          </div>

          {/* Upload Speed */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Upload className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-secondary-900">
                  Upload Speed
                </h3>
              </div>
              <div className={`text-sm font-medium ${uploadRating.color}`}>
                {uploadRating.rating}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-900 mb-2">
                {state.uploadSpeed.toFixed(1)}
              </div>
              <div className="text-lg text-secondary-600 mb-4">Mbps</div>
              <div className="flex items-center justify-center space-x-2 text-sm text-secondary-500">
                <TrendingUp className="h-4 w-4" />
                <span>Upload performance</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Metrics */}
      {state.latency > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Latency */}
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Latency</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {state.latency.toFixed(0)}ms
                </p>
              </div>
              <div className="p-2 bg-primary-100 rounded-lg">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Connection Type */}
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Connection</p>
                <p className="text-2xl font-bold text-secondary-900 capitalize">
                  {state.connectionType || 'Unknown'}
                </p>
              </div>
              <div className="p-2 bg-primary-100 rounded-lg">
                <Wifi className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Overall Status */}
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Status</p>
                <p className={`text-2xl font-bold capitalize ${getStatusColor(state.status)}`}>
                  {state.status}
                </p>
              </div>
              <div className="p-2 bg-primary-100 rounded-lg">
                {state.status === NetworkStatus.EXCELLENT || state.status === NetworkStatus.GOOD ? (
                  <CheckCircle className="h-6 w-6 text-network-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-network-yellow-600" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Speed Test Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          About Speed Tests
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-secondary-600">
          <div>
            <h4 className="font-medium text-secondary-900 mb-2">Download Speed</h4>
            <p>
              Measures how fast you can receive data from the internet. 
              Important for streaming, downloading, and browsing.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-secondary-900 mb-2">Upload Speed</h4>
            <p>
              Measures how fast you can send data to the internet. 
              Important for video calls, file sharing, and gaming.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-secondary-900 mb-2">Latency</h4>
            <p>
              The time it takes for data to travel to and from servers. 
              Lower latency means better responsiveness for gaming and calls.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-secondary-900 mb-2">Connection Type</h4>
            <p>
              Your current network connection type (WiFi, 4G, etc.). 
              Affects overall performance and reliability.
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      {state.lastUpdated && (
        <div className="text-center text-sm text-secondary-500">
          Last updated: {state.lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  )
} 