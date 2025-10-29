import './App.css'
import PWABadge from './PWABadge.jsx'
import AppRoutes from './routes.jsx'

const App = () => {
  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AppRoutes />
      </div>
      <PWABadge />
    </div>
  )
}

export default App