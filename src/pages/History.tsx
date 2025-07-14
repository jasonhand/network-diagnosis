import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react'
import SpeedTimeSeriesChart from '../components/SpeedTimeSeriesChart'

interface TestHistoryItem {
  timestamp: string
  downloadSpeed: number
  uploadSpeed: number
  latency: number
  packetLoss: number
  status: string
  isLocalIssue: boolean
  isISPIssue: boolean
}

export default function History() {
  const [history, setHistory] = useState<TestHistoryItem[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'week' | 'month'>('all')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('networkTestHistory')
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory)
      setHistory(parsedHistory.reverse()) // Show newest first
    }
  }

  const clearHistory = () => {
    localStorage.removeItem('networkTestHistory')
    setHistory([])
  }

  const deleteTest = (timestamp: string) => {
    const updatedHistory = history.filter(item => item.timestamp !== timestamp)
    localStorage.setItem('networkTestHistory', JSON.stringify(updatedHistory))
    setHistory(updatedHistory)
  }

  const getFilteredHistory = () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    return history.filter(item => {
      const itemDate = new Date(item.timestamp)
      switch (selectedTimeframe) {
        case 'week':
          return itemDate >= weekAgo
        case 'month':
          return itemDate >= monthAgo
        default:
          return true
      }
    })
  }

  const getAverageSpeed = (type: 'download' | 'upload') => {
    const filtered = getFilteredHistory()
    if (filtered.length === 0) return 0
    
    const sum = filtered.reduce((acc, item) => 
      acc + (type === 'download' ? item.downloadSpeed : item.uploadSpeed), 0
    )
    return sum / filtered.length
  }

  const getSpeedTrend = (type: 'download' | 'upload') => {
    const filtered = getFilteredHistory()
    if (filtered.length < 2) return 'stable'
    
    const recent = filtered.slice(0, Math.ceil(filtered.length / 2))
    const older = filtered.slice(Math.ceil(filtered.length / 2))
    
    const recentAvg = recent.reduce((acc, item) => 
      acc + (type === 'download' ? item.downloadSpeed : item.uploadSpeed), 0
    ) / recent.length
    
    const olderAvg = older.reduce((acc, item) => 
      acc + (type === 'download' ? item.downloadSpeed : item.uploadSpeed), 0
    ) / older.length
    
    if (recentAvg > olderAvg * 1.1) return 'improving'
    if (recentAvg < olderAvg * 0.9) return 'declining'
    return 'stable'
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
      case 'good':
        return 'text-network-green-600'
      case 'fair':
        return 'text-network-yellow-600'
      case 'poor':
      case 'offline':
        return 'text-network-red-600'
      default:
        return 'text-secondary-600'
    }
  }

  const filteredHistory = getFilteredHistory()
  const avgDownload = getAverageSpeed('download')
  const avgUpload = getAverageSpeed('upload')
  const downloadTrend = getSpeedTrend('download')
  const uploadTrend = getSpeedTrend('upload')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">
              Test History
            </h2>
            <p className="text-secondary-600 mt-1">
              Track your network performance over time
            </p>
          </div>
          <button
            onClick={clearHistory}
            className="btn-secondary flex items-center space-x-2"
          >
            <Trash2 className="h-5 w-5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">
            Time Period
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTimeframe('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedTimeframe === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-secondary-100 text-secondary-700'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setSelectedTimeframe('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedTimeframe === 'week'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-secondary-100 text-secondary-700'
              }`}
            >
              Last Week
            </button>
            <button
              onClick={() => setSelectedTimeframe('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedTimeframe === 'month'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-secondary-100 text-secondary-700'
              }`}
            >
              Last Month
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Tests Recorded</p>
              <p className="text-2xl font-bold text-secondary-900">
                {filteredHistory.length}
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
              <p className="text-sm font-medium text-secondary-600">Avg Download</p>
              <p className="text-2xl font-bold text-secondary-900">
                {avgDownload.toFixed(1)} Mbps
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {downloadTrend === 'improving' && <TrendingUp className="h-4 w-4 text-network-green-600" />}
                {downloadTrend === 'declining' && <TrendingDown className="h-4 w-4 text-network-red-600" />}
                <span className={`text-xs ${downloadTrend === 'improving' ? 'text-network-green-600' : downloadTrend === 'declining' ? 'text-network-red-600' : 'text-secondary-600'}`}>
                  {downloadTrend}
                </span>
              </div>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Download className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Avg Upload</p>
              <p className="text-2xl font-bold text-secondary-900">
                {avgUpload.toFixed(1)} Mbps
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {uploadTrend === 'improving' && <TrendingUp className="h-4 w-4 text-network-green-600" />}
                {uploadTrend === 'declining' && <TrendingDown className="h-4 w-4 text-network-red-600" />}
                <span className={`text-xs ${uploadTrend === 'improving' ? 'text-network-green-600' : uploadTrend === 'declining' ? 'text-network-red-600' : 'text-secondary-600'}`}>
                  {uploadTrend}
                </span>
              </div>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Issues Found</p>
              <p className="text-2xl font-bold text-secondary-900">
                {filteredHistory.filter(item => item.isLocalIssue || item.isISPIssue).length}
              </p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Speed Performance Chart */}
      <SpeedTimeSeriesChart data={filteredHistory} />

      {/* Test History List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Test Results
        </h3>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">No test history found for this time period</p>
            <p className="text-sm text-secondary-500 mt-2">
              Run a speed test and save it to see your history here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div key={item.timestamp} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">
                        {formatDate(item.timestamp)}
                      </p>
                      <p className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTest(item.timestamp)}
                    className="p-2 text-secondary-400 hover:text-network-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-secondary-600">Download</p>
                    <p className="text-lg font-bold text-secondary-900">
                      {item.downloadSpeed.toFixed(1)} Mbps
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary-600">Upload</p>
                    <p className="text-lg font-bold text-secondary-900">
                      {item.uploadSpeed.toFixed(1)} Mbps
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary-600">Latency</p>
                    <p className="text-lg font-bold text-secondary-900">
                      {item.latency}ms
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary-600">Packet Loss</p>
                    <p className="text-lg font-bold text-secondary-900">
                      {item.packetLoss.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {(item.isLocalIssue || item.isISPIssue) && (
                  <div className="mt-3 pt-3 border-t border-secondary-200">
                    <div className="flex items-center space-x-4">
                      {item.isLocalIssue && (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-network-red-500 rounded-full"></div>
                          <span className="text-sm text-secondary-600">Local Issue</span>
                        </div>
                      )}
                      {item.isISPIssue && (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-network-red-500 rounded-full"></div>
                          <span className="text-sm text-secondary-600">ISP Issue</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 