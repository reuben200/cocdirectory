import { useState } from 'react'

export default function EventFilterBar({ onFilter }){
  const [query,setQuery]=useState('')
  const [category,setCategory]=useState('')

  const apply = ()=> onFilter({ query, category })

  return (
    <div className="bg-white p-4 rounded-lg shadow flex gap-3 flex-col md:flex-row">
      <input className="flex-1 border rounded px-3 py-2" placeholder="Search events, congregation or location" value={query} onChange={e=>setQuery(e.target.value)} onKeyUp={apply} />
      <select className="w-48 border rounded px-3 py-2" value={category} onChange={e=>{setCategory(e.target.value); apply();}}>
        <option value="">All Categories</option>
        <option>Evangelism</option>
        <option>Worship</option>
        <option>Training</option>
        <option>Outreach</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={apply}>Filter</button>
    </div>
  )
}