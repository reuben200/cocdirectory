import './App.css'
import PWABadge from './PWABadge.jsx'
import AppRoutes from './routes.jsx'

const App = () => {
  return (
    <div className='bg-gray-100 dark:bg-gray-800'>
      <div className="min-h-screen flex flex-col">
        <AppRoutes />
      </div>
      <PWABadge />
    </div>
  )
}

export default App