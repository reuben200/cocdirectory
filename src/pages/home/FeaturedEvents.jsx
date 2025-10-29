import { useEffect, useState } from 'react'
import EventCard from '../events/EventCard'

export default function FeaturedEvents(){
  const [events,setEvents]=useState([])
  useEffect(()=>{ fetch('/api/events.json').then(r=>r.json()).then(d=>setEvents(d.slice(0,3))) },[])
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map(e=> <EventCard key={e.id} event={e} />)}
      </div>
    </section>
  )
}
