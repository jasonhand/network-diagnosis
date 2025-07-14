import { useEffect, useState } from 'react'
import { 
  Activity, 
  Globe, 
  Server, 
  Zap, 
  TrendingUp, 
  CheckCircle,
  Loader2
} from 'lucide-react'

interface SpeedTestAnimationProps {
  isRunning: boolean
  progress: number
  currentTest: string
  onComplete?: () => void
  showResults?: boolean
}

interface NetworkNode {
  id: string
  x: number
  y: number
  status: 'scanning' | 'connected' | 'failed'
  latency: number
  speed: number
}

export default function SpeedTestAnimation({ 
  isRunning, 
  progress, 
  currentTest, 
  showResults = false
}: SpeedTestAnimationProps) {
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [scanLines, setScanLines] = useState<{ x: number; y: number; angle: number }[]>([])

  const [dataFlow, setDataFlow] = useState<{ x: number; y: number; direction: 'in' | 'out' }[]>([])
  const [connectionLines, setConnectionLines] = useState<{ from: string; to: string; active: boolean }[]>([])

  // Initialize network nodes
  useEffect(() => {
    if (isRunning) {
      const initialNodes: NetworkNode[] = [
        { id: 'local', x: 50, y: 50, status: 'scanning', latency: 0, speed: 0 },
        { id: 'router', x: 200, y: 100, status: 'scanning', latency: 0, speed: 0 },
        { id: 'isp', x: 350, y: 150, status: 'scanning', latency: 0, speed: 0 },
        { id: 'google', x: 500, y: 80, status: 'scanning', latency: 0, speed: 0 },
        { id: 'cloudflare', x: 450, y: 200, status: 'scanning', latency: 0, speed: 0 },
        { id: 'amazon', x: 600, y: 120, status: 'scanning', latency: 0, speed: 0 }
      ]
      setNodes(initialNodes)
      
      // Initialize connection lines
      setConnectionLines([
        { from: 'local', to: 'router', active: false },
        { from: 'router', to: 'isp', active: false },
        { from: 'isp', to: 'google', active: false },
        { from: 'isp', to: 'cloudflare', active: false },
        { from: 'isp', to: 'amazon', active: false }
      ])
    }
  }, [isRunning])

  // Animate scanning effect
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setScanLines(prev => [
        ...prev,
        { x: Math.random() * 600, y: Math.random() * 250, angle: Math.random() * 360 }
      ].slice(-5))


    }, 100)

    return () => clearInterval(interval)
  }, [isRunning])

  // Animate data flow
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setDataFlow(prev => [
        ...prev,
        {
          x: Math.random() * 600,
          y: Math.random() * 250,
          direction: (Math.random() > 0.5 ? 'in' : 'out') as 'in' | 'out'
        }
      ].slice(-8))
    }, 200)

    return () => clearInterval(interval)
  }, [isRunning])

  // Update node status and connection lines based on progress
  useEffect(() => {
    if (!isRunning) return

    const updateNodes = () => {
      setNodes(prev => prev.map((node, index) => {
        const nodeProgress = (index + 1) * (100 / prev.length)
        if (progress >= nodeProgress) {
          return {
            ...node,
            status: 'connected' as const,
            latency: Math.floor(Math.random() * 50) + 10,
            speed: Math.floor(Math.random() * 100) + 50
          }
        }
        return node
      }))
    }

    const updateConnections = () => {
      setConnectionLines(prev => prev.map((line, index) => {
        const lineProgress = (index + 1) * (100 / prev.length)
        return {
          ...line,
          active: progress >= lineProgress
        }
      }))
    }

    const timeout = setTimeout(() => {
      updateNodes()
      updateConnections()
    }, 1000)
    
    return () => clearTimeout(timeout)
  }, [progress, isRunning])

  if (!isRunning && !showResults) return null

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 rounded-xl overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary-400"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connectionLines.map((line, index) => {
          const fromNode = nodes.find(n => n.id === line.from)
          const toNode = nodes.find(n => n.id === line.to)
          
          if (!fromNode || !toNode) return null
          
          return (
            <line
              key={index}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={line.active ? '#10b981' : '#6b7280'}
              strokeWidth={line.active ? '2' : '1'}
              strokeDasharray={line.active ? '5,5' : 'none'}
              className={line.active ? 'animate-pulse' : ''}
              opacity={line.active ? 0.8 : 0.3}
            />
          )
        })}
      </svg>

      {/* Scanning Lines */}
      {scanLines.map((line, index) => (
        <div
          key={index}
          className="absolute w-1 h-8 bg-gradient-to-t from-primary-400 to-transparent animate-pulse"
          style={{
            left: line.x,
            top: line.y,
            transform: `rotate(${line.angle}deg)`,
            animationDelay: `${index * 0.2}s`
          }}
        />
      ))}

      {/* Pulse Effect */}
      <div
        className="absolute w-4 h-4 bg-primary-400 rounded-full animate-ping"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animationDuration: '2s'
        }}
      />

      {/* Network Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}px`, top: `${node.y}px` }}
        >
          <div className="relative">
            {/* Node Icon */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${node.status === 'connected' 
                ? 'bg-network-green-500 shadow-glow-green' 
                : node.status === 'failed'
                ? 'bg-network-red-500 shadow-glow-red'
                : 'bg-primary-500 shadow-glow'
              }
              transition-all duration-500
            `}>
              {node.status === 'connected' ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : node.status === 'failed' ? (
                <Server className="h-6 w-6 text-white" />
              ) : (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              )}
            </div>

            {/* Node Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="text-xs font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                {node.id}
              </div>
            </div>

            {/* Node Metrics */}
            {node.status === 'connected' && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  {node.latency}ms
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Data Flow Particles */}
      {dataFlow.map((particle, index) => (
        <div
          key={index}
          className={`absolute w-2 h-2 rounded-full ${
            particle.direction === 'in' ? 'bg-network-green-400' : 'bg-primary-400'
          } animate-pulse`}
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}

      {/* Progress Overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black bg-opacity-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {isRunning ? (
                <Activity className="h-5 w-5 text-primary-400 animate-pulse" />
              ) : (
                <CheckCircle className="h-5 w-5 text-network-green-400" />
              )}
              <span className="text-white font-medium">
                {isRunning ? currentTest : 'Test Completed Successfully'}
              </span>
            </div>
            <span className="text-white font-bold">
              {isRunning ? `${progress}%` : '100%'}
            </span>
          </div>
          <div className="w-full bg-secondary-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: isRunning ? `${progress}%` : '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-black bg-opacity-50 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-2">
            {isRunning ? (
              <>
                <Globe className="h-5 w-5 text-primary-400 animate-spin" />
                <span className="text-white font-medium">Analyzing Network Infrastructure</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-network-green-400" />
                <span className="text-white font-medium">Network Analysis Complete</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Speed Indicators */}
      <div className="absolute top-4 right-4">
        <div className="bg-black bg-opacity-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-network-green-400" />
            <span className="text-white font-bold">
              {Math.floor(Math.random() * 200) + 100} Mbps
            </span>
          </div>
        </div>
      </div>

      {/* Additional Speed Indicators */}
      <div className="absolute top-16 right-4">
        <div className="bg-black bg-opacity-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-network-yellow-400" />
            <span className="text-white font-bold">
              {Math.floor(Math.random() * 50) + 20} Mbps ↑
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 