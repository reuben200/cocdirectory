import { useEffect, useState } from 'react'
import EventFilterBar from './EventFilterBar'
import EventCard from './EventCard'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function EventList(){
  const [events,setEvents]=useState([])
  const [filtered, setFiltered] = useState(events);
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    fetch('/api/events.json')
      .then(r=>r.json())
      .then(data=>{
        // sort by date/time ascending
        const sorted = data.sort((a,b)=> new Date(a.date + 'T' + (a.time||'00:00')) - new Date(b.date + 'T' + (b.time||'00:00')))
        setEvents(sorted); setFiltered(sorted)
      })
      .catch(console.error)
      .finally(()=>setLoading(false))
  },[])

  const handleFilter = ({ query, category, location, congregation }) => {
    let result = events;
  
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.congregation_name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }
  
    if (category) result = result.filter(e => e.category === category);
    if (location) result = result.filter(e => e.location === location);
    if (congregation) result = result.filter(e => e.congregation_name === congregation);
  
    setFiltered(result);
  };

  if(loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <EventFilterBar events={events} onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map(ev=> <EventCard key={ev.id} event={ev} />)}
      </div>
    </div>
  )
}