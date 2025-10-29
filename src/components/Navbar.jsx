import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () =>{
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">Church Directory</Link>
        <nav className="space-x-4">
          <Link to="/" className="text-sm">Home</Link>
          <Link to="/directory" className="text-sm">Directory</Link>
          <Link to="/events" className="text-sm">Events</Link>
          <Link to="/about" className="text-sm">About</Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
