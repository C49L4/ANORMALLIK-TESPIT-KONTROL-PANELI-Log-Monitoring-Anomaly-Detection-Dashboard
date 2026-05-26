import { useEffect, useState } from 'react'
import Dashboard from '../pages/Dashboard'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function App() {
  const [logs, setLogs] = useState([])
  const [chartLogs, setChartLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('ALL')
  const [totalLogs, setTotalLogs] = useState(0)
  const [loading, setLoading] = useState(false)
  const [running] = useState(true)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('pageSize', pageSize.toString())
      if (search) params.set('search', search)
      if (severity && severity !== 'ALL') params.set('severity', severity)

      const response = await fetch(`${API_BASE}/api/logs?${params.toString()}`)
      const data = await response.json()
      setLogs(data.logs || [])
      setTotalLogs(data.total || 0)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
      setLogs([])
      setTotalLogs(0)
    } finally {
      setLoading(false)
    }
  }

  const fetchChartLogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/logs/recent?limit=100`)
      const data = await response.json()
      setChartLogs(data || [])
    } catch (error) {
      console.error('Failed to fetch chart logs:', error)
      setChartLogs([])
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/logs/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStats(null)
    }
  }

  useEffect(() => {
    fetchLogs()
    fetchStats()
  }, [page, pageSize, search, severity])

  useEffect(() => {
    fetchChartLogs()
    const timer = setInterval(fetchChartLogs, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="App">
      <Dashboard
        logs={logs}
        chartLogs={chartLogs}
        stats={stats}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalLogs={totalLogs}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        search={search}
        setSearch={setSearch}
        severity={severity}
        setSeverity={setSeverity}
        running={running}
      />
    </div>
  )
}

export default App
