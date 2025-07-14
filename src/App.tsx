import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NetworkProvider } from './contexts/NetworkContext'
import Dashboard from './pages/Dashboard'
import SpeedTest from './pages/SpeedTest'
import Diagnostics from './pages/Diagnostics'
import Troubleshooting from './pages/Troubleshooting'
import History from './pages/History'
import Layout from './components/Layout'

function App() {
  return (
    <NetworkProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/speed-test" element={<SpeedTest />} />
                    <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/troubleshooting" element={<Troubleshooting />} />
        <Route path="/history" element={<History />} />
      </Routes>
        </Layout>
      </Router>
    </NetworkProvider>
  )
}

export default App 