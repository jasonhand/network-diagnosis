import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { NetworkState, NetworkAction, NetworkStatus } from '../types/network'

const initialState: NetworkState = {
  status: NetworkStatus.UNKNOWN,
  connectionType: '',
  downloadSpeed: 0,
  uploadSpeed: 0,
  latency: 0,
  packetLoss: 0,
  isLocalIssue: false,
  isISPIssue: false,
  lastUpdated: null,
  isOnline: navigator.onLine,
  diagnostics: {
    dnsPerformance: [],
    routeAnalysis: [],
    connectionStability: [],
    webRTCInfo: null
  },
  history: [],
  isLoading: false,
  error: null
}

const NetworkContext = createContext<{
  state: NetworkState
  dispatch: React.Dispatch<NetworkAction>
} | null>(null)

function networkReducer(state: NetworkState, action: NetworkAction): NetworkState {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload }
    
    case 'SET_CONNECTION_INFO':
      return { ...state, ...action.payload }
    
    case 'SET_DIAGNOSTICS':
      return { ...state, diagnostics: { ...state.diagnostics, ...action.payload } }
    
    case 'ADD_HISTORY_ENTRY':
      return { 
        ...state, 
        history: [...state.history, { ...action.payload, timestamp: new Date() }]
      }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    default:
      return state
  }
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(networkReducer, initialState)

  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true })
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <NetworkContext.Provider value={{ state, dispatch }}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
} 