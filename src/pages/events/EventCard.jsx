import { Link } from 'react-router-dom'

export default function EventCard({event}){
  return (
    <article className="bg-white rounded-lg shadow overflow-hidden">
      <img src={event.image || `/images/events-default.jpg`} alt={event.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">{event.congregation_name} — {event.location}</p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{event.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <time className="text-sm text-gray-500">{event.date} {event.time}</time>
          <Link to={`/events/${event.id}`} className="text-blue-600 text-sm">View</Link>
        </div>
      </div>
    </article>
  )
}