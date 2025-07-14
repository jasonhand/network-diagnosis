import { useState, useEffect, useCallback } from 'react'
import { useNetwork } from '../contexts/NetworkContext'
import { RealNetworkMonitor } from '../services/RealNetworkMonitor'
import { SpeedTestResult, DNSPerformance, RouteAnalysis, NetworkStatus } from '../types/network'

export function useNetworkDiagnostics() {
  const { state, dispatch } = useNetwork()
  const [isRunningTest, setIsRunningTest] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState<string>('')

  const networkMonitor = new RealNetworkMonitor()

  // Initialize network status on mount
  useEffect(() => {
    initializeNetworkStatus()
  }, [])

  const initializeNetworkStatus = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const connectionInfo = await networkMonitor.assessConnectionQuality()
      const latency = await networkMonitor.measureLatency()
      const packetLoss = await networkMonitor.estimatePacketLoss()
      const bandwidth = await networkMonitor.estimateBandwidth()
      
      dispatch({
        type: 'SET_CONNECTION_INFO',
        payload: {
          isOnline: connectionInfo.isOnline,
          connectionType: connectionInfo.connectionType,
          downloadSpeed: bandwidth.download,
          uploadSpeed: bandwidth.upload,
          latency,
          packetLoss,
          lastUpdated: new Date()
        }
      })

      // Calculate network status based on real metrics
      let status = NetworkStatus.GOOD
      if (latency > 100 || packetLoss > 5) {
        status = NetworkStatus.POOR
      } else if (latency > 50 || packetLoss > 2) {
        status = NetworkStatus.FAIR
      } else if (latency < 20 && packetLoss < 1) {
        status = NetworkStatus.EXCELLENT
      }
      
      dispatch({ type: 'SET_STATUS', payload: status })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize network status' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch])

  // Run comprehensive speed test
  const runSpeedTest = useCallback(async (): Promise<SpeedTestResult | null> => {
    setIsRunningTest(true)
    setTestProgress(0)
    setCurrentTest('Initializing...')

    try {
      setTestProgress(10)
      setCurrentTest('Checking connection...')
      
      const connectionInfo = await networkMonitor.assessConnectionQuality()
      if (!connectionInfo.isOnline) {
        throw new Error('No internet connection available')
      }

      setTestProgress(20)
      setCurrentTest('Measuring latency...')
      const latency = await networkMonitor.measureLatency()

      setTestProgress(40)
      setCurrentTest('Estimating bandwidth...')
      await new Promise(resolve => setTimeout(resolve, 1000)) // Add delay for visibility
      const bandwidth = await networkMonitor.estimateBandwidth()

      setTestProgress(60)
      setCurrentTest('Measuring packet loss...')
      await new Promise(resolve => setTimeout(resolve, 1000)) // Add delay for visibility
      const packetLoss = await networkMonitor.estimatePacketLoss()

      setTestProgress(80)
      setCurrentTest('Analyzing results...')

      const result: SpeedTestResult = {
        downloadSpeed: bandwidth.download,
        uploadSpeed: bandwidth.upload,
        latency,
        jitter: 0, // Would need continuous monitoring for jitter
        packetLoss,
        server: 'real-network-test',
        timestamp: new Date()
      }

      // Calculate network status based on real metrics
      let status = NetworkStatus.GOOD
      if (latency > 100 || packetLoss > 5) {
        status = NetworkStatus.POOR
      } else if (latency > 50 || packetLoss > 2) {
        status = NetworkStatus.FAIR
      } else if (latency < 20 && packetLoss < 1) {
        status = NetworkStatus.EXCELLENT
      }

      dispatch({
        type: 'SET_CONNECTION_INFO',
        payload: {
          downloadSpeed: bandwidth.download,
          uploadSpeed: bandwidth.upload,
          latency,
          status,
          lastUpdated: new Date()
        }
      })

      dispatch({ type: 'SET_STATUS', payload: status })

      // Add to history
      dispatch({
        type: 'ADD_HISTORY_ENTRY',
        payload: {
          downloadSpeed: bandwidth.download,
          uploadSpeed: bandwidth.upload,
          latency,
          packetLoss: result.packetLoss,
          status
        }
      })

      setTestProgress(100)
      setCurrentTest('Test completed')
      
      // Add a small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Speed test failed' })
      return null
    } finally {
      setIsRunningTest(false)
      setTestProgress(0)
      setCurrentTest('')
    }
  }, [dispatch, networkMonitor])

  // Real network diagnostics using browser APIs
  // Note: These methods use actual network measurements, not simulations

  // Run DNS performance test
  const runDNSTest = useCallback(async (): Promise<DNSPerformance[]> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const results = await networkMonitor.testDNSPerformance()
      
      dispatch({
        type: 'SET_DIAGNOSTICS',
        payload: { dnsPerformance: results }
      })
      
      return results
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'DNS test failed' })
      return []
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch, networkMonitor])

  // Run route analysis
  const runRouteAnalysis = useCallback(async (): Promise<RouteAnalysis[]> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const results = await networkMonitor.analyzeRoute()
      
      dispatch({
        type: 'SET_DIAGNOSTICS',
        payload: { routeAnalysis: results }
      })
      
      return results
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Route analysis failed' })
      return []
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch, networkMonitor])

  // Run comprehensive diagnostics
  const runDiagnostics = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Run all diagnostic tests
      const [dnsResults, routeResults] = await Promise.all([
        networkMonitor.testDNSPerformance(),
        networkMonitor.analyzeRoute()
      ])
      
      // Classify issues
      const issueClassification = networkMonitor.classifyIssue(
        state.downloadSpeed,
        state.uploadSpeed,
        state.latency,
        state.packetLoss,
        dnsResults
      )
      
      dispatch({
        type: 'SET_DIAGNOSTICS',
        payload: {
          dnsPerformance: dnsResults,
          routeAnalysis: routeResults
        }
      })
      
      dispatch({
        type: 'SET_CONNECTION_INFO',
        payload: {
          isLocalIssue: issueClassification.isLocalIssue,
          isISPIssue: issueClassification.isISPIssue
        }
      })
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Diagnostics failed' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch, networkMonitor, state.downloadSpeed, state.uploadSpeed, state.latency, state.packetLoss])

  // Start continuous monitoring
  const startMonitoring = useCallback(() => {
    networkMonitor.startMonitoring((data) => {
      dispatch({
        type: 'SET_CONNECTION_INFO',
        payload: {
          isOnline: data.connection.isOnline,
          connectionType: data.connection.connectionType,
          latency: data.latency,
          lastUpdated: data.timestamp
        }
      })
      
      dispatch({
        type: 'SET_DIAGNOSTICS',
        payload: { dnsPerformance: data.dnsPerformance }
      })
    }, 30000) // Update every 30 seconds
  }, [dispatch, networkMonitor])

  // Stop continuous monitoring
  const stopMonitoring = useCallback(() => {
    networkMonitor.stopMonitoring()
  }, [networkMonitor])

  return {
    // State
    isRunningTest,
    testProgress,
    currentTest,
    
    // Actions
    runSpeedTest,
    runDNSTest,
    runRouteAnalysis,
    runDiagnostics,
    startMonitoring,
    stopMonitoring,
    initializeNetworkStatus
  }
} 