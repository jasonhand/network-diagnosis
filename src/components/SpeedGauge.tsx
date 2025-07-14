import { Activity, TrendingUp, Zap, RefreshCw, Save } from 'lucide-react'
import ScanningAnimation from './ScanningAnimation'

interface SpeedGaugeProps {
  downloadSpeed: number
  uploadSpeed: number
  isRunning: boolean
  onStartTest: () => void
  onSaveTest?: () => void
  hasTestData?: boolean
}

export default function SpeedGauge({ 
  downloadSpeed, 
  uploadSpeed, 
  isRunning, 
  onStartTest,
  onSaveTest,
  hasTestData = false
}: SpeedGaugeProps) {
  const getSpeedColor = (speed: number) => {
    if (speed >= 100) return 'text-network-green-600'
    if (speed >= 50) return 'text-network-green-600'
    if (speed >= 25) return 'text-network-yellow-600'
    if (speed >= 10) return 'text-network-red-600'
    return 'text-secondary-600'
  }

  const getSpeedRating = (speed: number) => {
    if (speed >= 100) return 'Excellent'
    if (speed >= 50) return 'Good'
    if (speed >= 25) return 'Fair'
    if (speed >= 10) return 'Poor'
    return 'Very Poor'
  }

  const downloadRating = getSpeedRating(downloadSpeed)
  const uploadRating = getSpeedRating(uploadSpeed)

  return (
    <ScanningAnimation isActive={!isRunning}>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-secondary-900">Network Speed</h3>
          <p className="text-secondary-600">Current connection performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onStartTest}
            disabled={isRunning}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Activity className="h-5 w-5" />
            )}
            <span>{isRunning ? 'Testing...' : 'Test Speed'}</span>
          </button>
          {hasTestData && onSaveTest && (
            <button
              onClick={onSaveTest}
              className="btn-secondary flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save Test</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Download Speed Gauge */}
        <div className="relative">
          <div className="text-center">
            <div className="relative inline-block">
              {/* Gauge Background */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Progress Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={downloadSpeed > 0 ? '#3b82f6' : '#e5e7eb'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(downloadSpeed / 200) * 339.292} 339.292`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-2xl font-bold ${getSpeedColor(downloadSpeed)}`}>
                  {downloadSpeed > 0 ? downloadSpeed.toFixed(1) : '--'}
                </div>
                <div className="text-sm text-secondary-600">Mbps</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-secondary-900">Download</span>
              </div>
              <div className={`text-sm font-medium ${getSpeedColor(downloadSpeed)}`}>
                {downloadRating}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Speed Gauge */}
        <div className="relative">
          <div className="text-center">
            <div className="relative inline-block">
              {/* Gauge Background */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Progress Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={uploadSpeed > 0 ? '#10b981' : '#e5e7eb'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(uploadSpeed / 100) * 339.292} 339.292`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-2xl font-bold ${getSpeedColor(uploadSpeed)}`}>
                  {uploadSpeed > 0 ? uploadSpeed.toFixed(1) : '--'}
                </div>
                <div className="text-sm text-secondary-600">Mbps</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-network-green-600" />
                <span className="font-medium text-secondary-900">Upload</span>
              </div>
              <div className={`text-sm font-medium ${getSpeedColor(uploadSpeed)}`}>
                {uploadRating}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Speed Legend */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-network-green-500 rounded-full"></div>
            <span className="text-secondary-600">Excellent (100+ Mbps)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-network-green-500 rounded-full"></div>
            <span className="text-secondary-600">Good (50-99 Mbps)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-network-yellow-500 rounded-full"></div>
            <span className="text-secondary-600">Fair (25-49 Mbps)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-network-red-500 rounded-full"></div>
            <span className="text-secondary-600">Poor (&lt;25 Mbps)</span>
          </div>
        </div>
      </div>
    </div>
    </ScanningAnimation>
  )
} 