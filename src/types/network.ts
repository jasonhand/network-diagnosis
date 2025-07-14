export enum NetworkStatus {
  UNKNOWN = 'unknown',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  OFFLINE = 'offline'
}

export interface NetworkState {
  status: NetworkStatus
  connectionType: string
  downloadSpeed: number
  uploadSpeed: number
  latency: number
  packetLoss: number
  isLocalIssue: boolean
  isISPIssue: boolean
  lastUpdated: Date | null
  isOnline: boolean
  diagnostics: {
    dnsPerformance: DNSPerformance[]
    routeAnalysis: RouteAnalysis[]
    connectionStability: ConnectionStability[]
    webRTCInfo: WebRTCInfo | null
  }
  history: NetworkHistoryEntry[]
  isLoading: boolean
  error: string | null
}

export type NetworkAction =
  | { type: 'SET_STATUS'; payload: NetworkStatus }
  | { type: 'SET_CONNECTION_INFO'; payload: Partial<NetworkState> }
  | { type: 'SET_DIAGNOSTICS'; payload: Partial<NetworkState['diagnostics']> }
  | { type: 'ADD_HISTORY_ENTRY'; payload: Omit<NetworkHistoryEntry, 'timestamp'> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'CLEAR_ERROR' }

export interface DNSPerformance {
  server: string
  responseTime: number
  status: 'success' | 'timeout' | 'error'
  ipAddress?: string
}

export interface RouteAnalysis {
  hop: number
  hostname: string
  ip: string
  latency: number
  status: 'success' | 'timeout' | 'error'
}

export interface ConnectionStability {
  timestamp: Date
  latency: number
  packetLoss: number
  status: NetworkStatus
}

export interface WebRTCInfo {
  localIP: string
  publicIP: string
  connectionType: string
  iceServers: string[]
}

export interface NetworkHistoryEntry {
  timestamp: Date
  downloadSpeed: number
  uploadSpeed: number
  latency: number
  packetLoss: number
  status: NetworkStatus
}

export interface SpeedTestResult {
  downloadSpeed: number
  uploadSpeed: number
  latency: number
  jitter: number
  packetLoss: number
  server: string
  timestamp: Date
}

export interface DiagnosticResult {
  type: 'dns' | 'route' | 'stability' | 'webrtc'
  data: DNSPerformance[] | RouteAnalysis[] | ConnectionStability[] | WebRTCInfo
  timestamp: Date
  status: 'success' | 'error' | 'partial'
}

export interface TroubleshootingStep {
  id: string
  title: string
  description: string
  completed: boolean
  action?: () => void
  result?: string
}

export interface IssueClassification {
  type: 'local' | 'isp' | 'external' | 'unknown'
  confidence: number
  symptoms: string[]
  recommendations: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
} 