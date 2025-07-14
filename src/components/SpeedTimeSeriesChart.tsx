import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SpeedDataPoint {
  timestamp: string
  downloadSpeed: number
  uploadSpeed: number
}

interface SpeedTimeSeriesChartProps {
  data: SpeedDataPoint[]
}

export default function SpeedTimeSeriesChart({ data }: SpeedTimeSeriesChartProps) {
  if (data.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-secondary-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No Speed Data Available</h3>
          <p className="text-secondary-600">
            Run speed tests and save them to see your performance trends over time.
          </p>
        </div>
      </div>
    )
  }

  // Format data for the chart
  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.timestamp),
    formattedDate: new Date(item.timestamp).toLocaleDateString(),
    formattedTime: new Date(item.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }))

  // Sort by date (newest first for display)
  chartData.sort((a, b) => b.date.getTime() - a.date.getTime())

  // Take the last 20 data points for better chart readability
  const displayData = chartData.slice(0, 20).reverse()

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Speed Performance Over Time</h3>
        <p className="text-sm text-secondary-600">
          Track your download and upload speeds to identify performance trends
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
              label={{ 
                value: 'Speed (Mbps)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6b7280' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#374151', fontWeight: '600' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
            />
            <Line 
              type="monotone" 
              dataKey="downloadSpeed" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name="Download Speed"
            />
            <Line 
              type="monotone" 
              dataKey="uploadSpeed" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              name="Upload Speed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-secondary-500">
        <p>Showing last {displayData.length} speed tests. Hover over points for detailed information.</p>
      </div>
    </div>
  )
} 