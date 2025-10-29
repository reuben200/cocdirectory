import { useEffect, useState } from 'react'
import CongregationCard from '../directory/CongregationCard.jsx'

export default function FeaturedCongregations(){
  const [list,setList]=useState([])
  useEffect(()=>{ fetch('/api/congregations.json').then(r=>r.json()).then(d=>setList(d.slice(0,4))) },[])
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Featured Congregations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map(c=> <CongregationCard key={c.id} congregation={c} />)}
      </div>
    </section>
  )
}