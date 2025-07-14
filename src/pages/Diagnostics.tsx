import { useNetwork } from '../contexts/NetworkContext'
import { useNetworkDiagnostics } from '../hooks/useNetworkDiagnostics'

import { 
  Settings, 
  Wifi, 
  Globe, 
  Activity, 
  Play, 
  RefreshCw, 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

export default function Diagnostics() {
  const { state } = useNetwork()
  const { 
    isRunningTest, 
    runDNSTest, 
    runRouteAnalysis, 
    runDiagnostics 
  } = useNetworkDiagnostics()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-network-green-600" />
      case 'timeout':
        return <Clock className="h-4 w-4 text-network-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-network-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-secondary-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-network-green-600'
      case 'timeout':
        return 'text-network-yellow-600'
      case 'error':
        return 'text-network-red-600'
      default:
        return 'text-secondary-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">
              Network Diagnostics
            </h2>
            <p className="text-secondary-600 mt-1">
              Advanced network analysis and troubleshooting tools
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
            <span>{isRunningTest ? 'Running...' : 'Run Diagnostics'}</span>
          </button>
        </div>
      </div>

      {/* Connection Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Connection Status</p>
              <p className={`text-2xl font-bold capitalize ${state.isOnline ? 'text-network-green-600' : 'text-network-red-600'}`}>
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
              <p className="text-sm font-medium text-secondary-600">Connection Type</p>
              <p className="text-2xl font-bold text-secondary-900 capitalize">
                {state.connectionType || 'Unknown'}
              </p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Globe className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Network Status</p>
              <p className="text-2xl font-bold text-secondary-900 capitalize">
                {state.status}
              </p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Activity className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* DNS Performance */}
      {state.diagnostics.dnsPerformance.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            DNS Performance
          </h3>
          <div className="space-y-3">
            {state.diagnostics.dnsPerformance.map((dns, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(dns.status)}
                  <div>
                    <p className="font-medium text-secondary-900">{dns.server}</p>
                    <p className="text-sm text-secondary-600">
                      Response time: {dns.responseTime.toFixed(0)}ms
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getStatusColor(dns.status)}`}>
                  {dns.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Route Analysis */}
      {state.diagnostics.routeAnalysis.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Route Analysis
          </h3>
          <div className="space-y-3">
            {state.diagnostics.routeAnalysis.map((hop, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(hop.status)}
                  <div>
                    <p className="font-medium text-secondary-900">
                      Hop {hop.hop}: {hop.hostname}
                    </p>
                    <p className="text-sm text-secondary-600">
                      Latency: {hop.latency.toFixed(0)}ms
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getStatusColor(hop.status)}`}>
                  {hop.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issue Classification */}
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

      {/* Diagnostic Tools */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Diagnostic Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={runDNSTest}
            disabled={isRunningTest}
            className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Settings className="h-5 w-5" />
            <span>DNS Performance Test</span>
          </button>
          <button 
            onClick={() => runRouteAnalysis()}
            disabled={isRunningTest}
            className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Globe className="h-5 w-5" />
            <span>Route Analysis</span>
          </button>
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